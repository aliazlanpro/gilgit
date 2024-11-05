// @ts-nocheck

import tools from './tools.js';

// Parsing Objects
import fieldCodesParse from './data/field-codes-parse.js';
import meshTranslationsParse from './data/mesh-translation-parse.js';

// Escape all regular expression chars except for pipe
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()[\]\\]/g, '\\$&'); // $& means the whole matched string
}
import { type TreeNode } from './tools.js';

// Add these interfaces at the top of the file
interface TreeNode {
  type?: string;
  nodes: TreeNode[];
  number?: number;
  isNumbered?: boolean;
  content?: string;
  field?: string;
  ref?: string[] | number[];
  heading?: string;
  offset?: number;
  cond?: string;
  proximity?: number;
}

interface Branch extends TreeNode {
  nodes: TreeNode[];
}

interface Leaf extends TreeNode {
  type: string;
  content: string;
  field?: string;
}

/**
 * Parse a given string into a lexical object tree
 * This tree can then be recompiled via each engines compile()
 * @param {string} query The query string to compile. This can be multiline
 * @param {Object} [options] Optional options to use when parsing
 * @param {boolean} [options.groupLines=false] Wrap lines inside their own groups (only applies if multiple lines are present)
 * @param {boolean} [options.groupLinesAlways=true] Group lines even if there is only one apparent line (i.e. enclose single line queries within brackets)
 * @param {boolean} [options.transposeLines=true] Insert all line references where needed (e.g. `1 - 3/OR`)
 * @param {boolean} [options.removeNumbering=true] Remove any number prefixes from lines - this is a classic copy/paste error from certain online search engines (e.g. `1. Term` -> `term`)
 * @param {boolean} [options.preserveNewlines=true] Preserve newlines in the output as 'raw' tree nodes
 * @return {array} Array representing the parsed tree nodes
 */
export const parse = (
  query: string,
  options?: {
    groupLines?: boolean;
    groupLinesAlways?: boolean;
    transposeLines?: boolean;
    removeNumbering?: boolean;
    preserveNewlines?: boolean;
  },
): TreeNode[] => {
  var settings = Object.assign(
    {
      groupLines: false,
      groupLinesAlways: false,
      removeNumbering: false,
      preserveNewlines: true,
      transposeLines: true,
    },
    options,
  );

  // global.variables.no_field_tag = []; // Empty array of offsets each time the query is parsed

  var q = query + ''; // Clone query
  var tree: Branch = { nodes: [] }; // Tree is the full parsed tree
  var branchStack: Branch[] = [tree]; // Stack for where we are within the tree (will get pushed when a new group is encountered)
  var branch: Branch = branchStack[branchStack.length - 1]; // Branch is the parent of leaf (branch always equals last element of branchStack)
  var lastGroup: Branch | undefined;
  var leaf: Leaf | TreeNode[] | undefined = branch.nodes; // Leaf is the currently active leaf node (usually branch.nodes)
  var afterWhitespace = true; // Set to true when the current character is following whitespace, a newline or the very start of the query
  var lineRefs = {}; // Object lookup for line references (usually something like `1. Foo`), only populated if `transposeLines` is true

  // Operate in line-by-line mode? {{{
  if (
    settings.transposeLines ||
    settings.groupLines ||
    settings.removeNumbering
  ) {
    var lines = q.split('\n');

    // Remove numbering {{{
    if (settings.removeNumbering) {
      var match;
      lines = lines.map((line): string => {
        if (line && (match = /^\s*\d+\.?\s(.*)$/.exec(line))) {
          return match[1] || '';
        }
        return line || '';
      });
    }
    // }}}

    // Group line content {{{
    if (
      settings.groupLines &&
      (settings.groupLinesAlways || lines.length > 1)
    ) {
      // Wrap lines provided they are not blank and are not just 'and', 'or', 'not' by themselves or a comment
      lines = lines.map((line) =>
        line.trim() &&
        !/^\s*(and|or|not)\s*$/i.test(line) &&
        !/^\s*#/.test(line)
          ? '(' + line + ')'
          : line,
      );
    }
    // }}}

    q = lines.join('\n'); // Join up lines again
  }
  // }}}

  // Utility functions {{{
  /**
   * Trim previous leaf content if it has any text
   * The leaf will be removed completely if it is now blank
   */
  function trimLastLeaf() {
    if (
      leaf &&
      ['phrase', 'raw'].includes(leaf.type) &&
      / $/.test(leaf.content)
    ) {
      leaf.content = leaf.content.substr(0, leaf.content.length - 1);
      if (!leaf.content) branch.nodes.pop();
    }
  }
  /**
   * End the previous line branch and create a new one
   * this function is run every time a new raw node is inserted
   */
  function newLine(currentNumber: number) {
    lastGroup = branch;
    branch = branchStack.pop() || tree;
    leaf = branch.nodes;
    var newGroup: Branch = {
      type: 'line',
      number: currentNumber,
      isNumbered: false,
      nodes: [],
    };
    branch.nodes.push(newGroup);
    branchStack.push(branch);
    branch = newGroup;
    leaf = branch.nodes;
  }
  // }}}

  // Create a group for the first line
  var newGroup = { type: 'line', number: 1, isNumbered: false, nodes: [] };
  branch.nodes.push(newGroup);
  branchStack.push(branch);
  branch = newGroup;
  leaf = branch.nodes;
  var lineNumber = 1;

  // Variable to store whether there is user entered line numbering
  var userLineNumber = false;
  // Variable to store byte offset of string at current point
  var offset = 0;

  // Create string of field codes seperated by pipe operator
  var fieldCodes = escapeRegExp(Object.keys(fieldCodesParse).join('|'));
  var meshTranslations = escapeRegExp(
    Object.keys(meshTranslationsParse).join('|'),
  );

  while (q.length) {
    var cropString = true; // Whether to remove one charcater from the beginning of the string (set to false if the lexical match handles this behaviour itself)
    var match;

    if (/^\(/.test(q)) {
      var newGroup = { type: 'group', nodes: [] };
      branch.nodes.push(newGroup);
      branchStack.push(branch);
      branch = newGroup;
      leaf = branch.nodes;
    } else if (/^\)/.test(q)) {
      lastGroup = branch;
      if (branchStack.length > 0) {
        branch = branchStack.pop();
      } else {
        // TODO: Code for popover message
        // branch.msg = "Extra closing bracket removed after term"
      }
      leaf = branch.nodes;
    } else if (
      (match = /^([0-9]+)\s*[‐\-]\s*([0-9]+)(?:\/(AND|OR|NOT))/i.exec(q))
    ) {
      // 1-7/OR
      branch.nodes.push({
        type: 'ref',
        ref: range(Number(match[1]), Number(match[2])),
        cond: match[3].toUpperCase(),
        nodes: [],
      });
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if (
      (match = /^(AND|OR|NOT)(?:\/([0-9]+)\s*[‐\-]\s*([0-9]+))/i.exec(q))
    ) {
      // OR/1-7
      branch.nodes.push({
        type: 'ref',
        ref: range(Number(match[2]), Number(match[3])),
        cond: match[1].toUpperCase(),
        nodes: [],
      });
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if ((match = /^(OR)\/([0-9]+(?:,[0-9]+)*)/i.exec(q))) {
      // OR/1,3
      branch.nodes.push({
        type: 'ref',
        ref: match[2].split(','),
        cond: match[1].toUpperCase(),
        nodes: [],
      });
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if ((match = /^(AND)\/([0-9]+(?:,[0-9]+)*)/i.exec(q))) {
      // AND/1,3
      branch.nodes.push({
        type: 'ref',
        ref: match[2].split(',').map((num) => `#${num.trim()}`),
        cond: match[1].toUpperCase(),
        nodes: [],
      });
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
      // } else if (match = /^(OR)\/([0-9]+(?:,[0-9]+)*)/i.exec(q)) {
      //     // OR/11,14,..
      //     const refNumbers = match[2].split(',').map(num => `#${num.trim()}`).join(' OR ');

      //     branch.nodes.push({
      //         type: 'ref',
      //         ref: refNumbers,
      //         cond: 'OR',
      //         nodes: []
      //     });
      //     offset += match[0].length;
      //     q = q.substr(match[0].length);
      //     cropString = false;
    } else if ((match = /^(#?([0-9]+)) +(AND|OR|NOT)\s+/i.exec(q))) {
      // 1 AND ...
      if (leaf.type != 'phrase') {
        branch.nodes.push({
          type: 'ref',
          ref: [match[2]],
          cond: '',
          nodes: [],
        });
        offset += match[1].length;
        q = q.substr(match[1].length); // NOTE we only move by the digits, not the whole expression - so we can still handle the AND/OR correctly
        cropString = false;
      } else {
        leaf.content += match[1];
        offset += match[1].length - 1;
        q = q.substr(match[1].length - 1);
      }
    } else if (
      (match = /^((AND|OR|NOT) +#?([0-9]+))($(?![\r\n])|\s+|\))/i.exec(q))
    ) {
      // AND 2...
      trimLastLeaf();
      switch (match[2].toLowerCase()) {
        case 'and':
          branch.nodes.push({ type: 'joinAnd' });
          break;
        case 'or':
          branch.nodes.push({ type: 'joinOr' });
          break;
        case 'not':
          branch.nodes.push({ type: 'joinNot' });
          break;
      }
      leaf = undefined;
      cropString = false;

      branch.nodes.push({
        type: 'ref',
        ref: [match[3]],
        cond: '',
        nodes: [],
      });
      offset += match[1].length;
      q = q.substr(match[1].length);
    } else if ((match = /^([0-9]+\.?)\s+/i.exec(q))) {
      // 1 or 1. (Line number)
      if (leaf.type != 'phrase') {
        lineNumber = parseInt(match[1], 10);
        branch.number = lineNumber;
        branch.isNumbered = true;
        userLineNumber = true;
        offset += match[0].length - 1;
        q = q.substr(match[0].length - 1);
      } else {
        leaf.content += match[1];
        offset += match[1].length - 1;
        q = q.substr(match[1].length - 1);
      }
    } else if (afterWhitespace && (match = /^and\b/i.exec(q))) {
      trimLastLeaf();
      branch.nodes.push({ type: 'joinAnd' });
      leaf = undefined;
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if (afterWhitespace && (match = /^or\b/i.exec(q))) {
      trimLastLeaf();
      branch.nodes.push({ type: 'joinOr' });
      leaf = undefined;
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if (afterWhitespace && (match = /^not\b/i.exec(q))) {
      trimLastLeaf();
      branch.nodes.push({ type: 'joinNot' });
      leaf = undefined;
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if (
      afterWhitespace &&
      (match = /^(near\/|near|adj|n)(\d+)\b/i.exec(q))
    ) {
      trimLastLeaf();
      if (match[2])
        branch.nodes.push({
          type: 'joinNear',
          proximity: Number(match[2]),
        });
      else branch.nodes.push({ type: 'joinNear', proximity: 1 });
      leaf = undefined;
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if (
      afterWhitespace &&
      (match = /^(next\/|next|adj|w|w\/|pre\/|p\/)(\d+)?\b/i.exec(q))
    ) {
      trimLastLeaf();
      if (match[2])
        branch.nodes.push({
          type: 'joinNext',
          proximity: Number(match[2]),
        });
      else branch.nodes.push({ type: 'joinNext', proximity: 1 });
      leaf = undefined;
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    }
    // MESHTRANSLATIONS {{{
    else if (
      afterWhitespace &&
      (match = new RegExp(`^(${meshTranslations})`, 'i').exec(
        q.toLowerCase().replace(/"/g, ''),
      ))
    ) {
      branch.nodes.push({
        type: 'meshTranslation',
        field: meshTranslationsParse[match[1]],
      });
      match = /.+?[\.\[]\S+[\.\]]/.exec(q);
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    }
    /// }}}
    // MESH {{{
    else if ((match = /^\[(mesh terms|mesh|mh)(:NoExp|:no exp)?\]/i.exec(q))) {
      // Mesh term - PubMed syntax
      leaf.type = 'mesh';
      leaf.field = match[2]
        ? 'Mesh search (Not exploded)'
        : 'Mesh search (exploded)';
      if (/^["“”].*["“”]$/.test(leaf.content))
        leaf.content = leaf.content.substr(1, leaf.content.length - 2); // Remove wrapping '"' characters
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if (
      (match =
        /^([^\s\/]*)\/?([^\s\)\/]+)?\[(majr|mesh major topic)(:NoExp|:no exp)?\]/i.exec(
          q,
        ))
    ) {
      // Major Mesh term - PubMed syntax (No Quotes)
      var newLeaf = {};
      newLeaf.type = 'mesh';
      newLeaf.content = match[1];
      if (match[2]) {
        newLeaf.heading = match[2];
      }
      newLeaf.field = match[4]
        ? 'MeSH Major Topic search (Not exploded)'
        : 'MeSH Major Topic search (exploded)';
      if (/^["“”].*["“”]$/.test(newLeaf.content))
        newLeaf.content = newLeaf.content.substr(1, newLeaf.content.length - 2); // Remove wrapping '"' characters
      branch.nodes.push(newLeaf);
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if (
      (match =
        /^"([^\\[]*)"\/?([^\s\)\/]+)?\[(majr|mesh major topic)(:NoExp|:no exp)?\]/i.exec(
          q,
        ))
    ) {
      // Major Mesh term - PubMed syntax (With Quotes)
      var newLeaf = {};
      newLeaf.type = 'mesh';
      newLeaf.content = match[1];
      if (match[2]) {
        newLeaf.heading = match[2];
      }
      newLeaf.field = match[4]
        ? 'MeSH Major Topic search (Not exploded)'
        : 'MeSH Major Topic search (exploded)';
      if (/^["“”].*["“”]$/.test(newLeaf.content))
        newLeaf.content = newLeaf.content.substr(1, newLeaf.content.length - 2); // Remove wrapping '"' characters
      branch.nodes.push(newLeaf);
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if ((match = /^\[(mesh subheading|sh)\]/i.exec(q))) {
      // Mesh subheading search - PubMed syntax
      leaf.type = 'mesh';
      leaf.field = 'MeSH subheading search';
      if (/^["“”].*["“”]$/.test(leaf.content))
        leaf.content = leaf.content.substr(1, leaf.content.length - 2); // Remove wrapping '"' characters
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if ((match = /^\.(fs)\./i.exec(q))) {
      // Mesh subheading search - Ovid syntax
      var useLeaf;
      if (isObject(leaf) && 'type' in leaf && leaf.type === 'phrase') {
        useLeaf = leaf as Leaf;
      } else if (Array.isArray(leaf) && lastGroup) {
        useLeaf = lastGroup;
      }
      leaf.type = 'mesh';
      useLeaf.field = 'MeSH subheading search';
      if (/^["“”].*["“”]$/.test(leaf.content))
        leaf.content = leaf.content.substr(1, leaf.content.length - 2); // Remove wrapping '"' characters
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if ((match = /^\.(xm|sh)\./i.exec(q))) {
      // Mesh search (field codes) - Ovid syntax
      var useLeaf;
      if (isObject(leaf) && 'type' in leaf && leaf.type === 'phrase') {
        useLeaf = leaf as Leaf;
      } else if (Array.isArray(leaf) && lastGroup) {
        useLeaf = lastGroup;
      }
      leaf.type = 'mesh';
      useLeaf.field =
        match[1] === 'xm'
          ? 'Mesh search (exploded)'
          : 'Mesh search (Not exploded)';
      if (/^["“”].*["“”]$/.test(leaf.content))
        leaf.content = leaf.content.substr(1, leaf.content.length - 2); // Remove wrapping '"' characters
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if (
      (match = /^(exp "([^*]*?)"\/)\s*/i.exec(q)) ||
      (match = /^(exp ([^*]*?)\/([^\s\)]+)?)\s*/i.exec(q))
    ) {
      // Mesh term - Ovid syntax (exploded)
      var newLeaf = {
        type: 'mesh',
        field: 'Mesh search (exploded)',
        content: match[2],
      };
      if (match[3]) {
        newLeaf.heading = match[3];
      }
      branch.nodes.push(newLeaf);
      offset += match[1].length;
      q = q.substr(match[1].length);
      cropString = false;
      afterWhitespace = true;
    } else if (
      (match = /^(exp \*"([^*]*?)"\/)\s*/i.exec(q)) ||
      (match = /^(exp \*([^*]*?)\/([^\s\)]+)?)\s*/i.exec(q))
    ) {
      // Major Mesh term - Ovid syntax
      var newLeaf = {
        type: 'mesh',
        field: 'MeSH Major Topic search (exploded)',
        content: match[2],
      };
      if (match[3]) {
        newLeaf.heading = match[3];
      }
      branch.nodes.push(newLeaf);
      offset += match[1].length;
      q = q.substr(match[1].length);
      cropString = false;
      afterWhitespace = true;
    } else if (/^\//.test(q) && leaf && leaf.type && leaf.type == 'phrase') {
      // Mesh term - Ovid syntax (non-exploded)
      leaf.type = 'mesh';
      // Major Mesh
      if (leaf.content[0] == '*') {
        leaf.content = leaf.content.substr(1);
        leaf.field = 'MeSH Major Topic search (Not exploded)';
      } else leaf.field = 'Mesh search (Not exploded)';
    }
    // }}}
    else if ((match = /^<(.*?)>/.exec(q))) {
      branch.nodes.push({ type: 'template', content: match[1].toLowerCase() });
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    } else if ((match = /^(\n)+/.exec(q))) {
      if (settings.preserveNewlines) {
        var number_newline = match[0].length;
        branch.nodes.push({
          type: 'raw',
          content: '\n'.repeat(number_newline),
        });
        leaf = undefined;
      }
      lineNumber += match[0].length;
      if (
        branchStack.length > 0 &&
        branchStack[branchStack.length - 1].nodes.every(
          (node) => node.type !== 'group',
        )
      ) {
        // If we are currently inside a group don't add a newline group
        newLine(lineNumber);
      }
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
      afterWhitespace = true;
    } else if ((match = /^(\r)+/.exec(q))) {
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
      afterWhitespace = true;
    }
    // Match field codes {{{
    else if (
      (match = new RegExp(`^(${fieldCodes}) *(\\[mp=[^\\]\\n]*\\])?`, 'i').exec(
        q,
      ))
    ) {
      // Field specifier - PubMed syntax
      // Figure out the leaf to use (usually the last one) or the previously used group
      var useLeaf;
      if (isObject(leaf) && leaf.type == 'phrase') {
        useLeaf = leaf;
      } else if (Array.isArray(leaf) && lastGroup) {
        useLeaf = lastGroup;
      }

      useLeaf.field = fieldCodesParse[match[1].toLowerCase()];
      if (match[2]) {
        offset += match[0].length;
        q = q.substr(match[0].length);
      } else {
        offset += match[1].length;
        q = q.substr(match[1].length);
      }
      cropString = false;
    }
    // }}}
    /// Comment {{{
    else if ((match = /^#([^\)\d\n][^\)\n]+)/.exec(q))) {
      trimLastLeaf();
      branch.nodes.push({ type: 'comment', content: match[1] });
      leaf = undefined;
      offset += match[0].length;
      q = q.substr(match[0].length);
      cropString = false;
    }
    // }}}
    else {
      var nextChar = q.substr(0, 1);
      if ((leaf === undefined || Array.isArray(leaf)) && nextChar != ' ') {
        // Leaf pointing to array entity - probably not created fallback leaf to append to
        if (/^["“”]$/.test(nextChar) && (match = /^["“”](.*?)["“”]/.exec(q))) {
          // First character is a speachmark - slurp until we see the next one
          leaf = { type: 'phrase', content: match[1], offset: offset };
          branch.nodes.push(leaf);
          offset += match[0].length;
          q = q.substr(match[0].length);
          cropString = false;
        } else if ((match = /^[^\s:/[.)]+/.exec(q))) {
          // Slurp the phrase until the space or any character which indicates the end of a phrase
          leaf = { type: 'phrase', content: match[0], offset: offset };
          branch.nodes.push(leaf);
          offset += match[0].length;
          q = q.substr(match[0].length);
          cropString = false;
        } else {
          // All other first chars - just dump into a buffer and let it fill slowly
          leaf = { type: 'phrase', content: nextChar, offset: offset };
          branch.nodes.push(leaf);
        }
      } else if (isObject(leaf) && leaf.type == 'phrase') {
        leaf.content += nextChar;
      }

      afterWhitespace = nextChar == ' '; // Is the nextChar whitespace? Then set the flag
    }

    if (cropString) {
      offset += 1; // Increment offset by 1
      q = q.substr(1); // Crop 1 character
    }
  }

  if (settings.transposeLines) {
    tools.visit(tree.nodes, ['ref'], (node: TreeNode) => {
      if (!node.ref || !Array.isArray(node.ref)) return;

      node.nodes = node.nodes || [];

      for (const reference of node.ref) {
        let found = false;

        for (const line of tree.nodes || []) {
          if (userLineNumber) {
            if (line.number === reference && line.isNumbered) {
              node.nodes.push(...(line.nodes || []));
              if (node.nodes.length > 0) {
                node.nodes.pop();
              }
              found = true;
            }
          } else {
            if (line.number === reference) {
              node.nodes.push(...(line.nodes || []));
              if (node.nodes.length > 0) {
                node.nodes.pop();
              }
              found = true;
            }
          }
        }

        if (!found) {
          node.nodes.push({
            type: 'phrase',
            content: tools.createTooltip(
              'Line ' + reference + ' not found',
              'Gilgit could not find specified line in the search query',
              'red-underline',
            ),
            nodes: [],
          });
        }
      }
    });
  }

  return tree.nodes;
};

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function isObject(value: any): boolean {
  return value !== null && typeof value === 'object';
}
