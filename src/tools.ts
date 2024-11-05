export type TreeNode = {
  type?: string;
  content?: string;
  nodes?: TreeNode[];
};

type Tree = TreeNode[];

type Replacement = {
  subject: string | RegExp;
  value: string | ((match: string) => string);
};

type VisitCallback = (node: TreeNode, path: string[]) => 'DEL' | void;

type WildCardReplacements = {
  [key: string]:
    | string
    | {
        tooltip: string;
        value: string;
      };
};

type QuotePhraseSettings = {
  replaceWildcards: boolean;
  highlighting: boolean;
  testing?: boolean;
};

type ConditionCollapseOptions = {
  depth?: number;
};

/**
 * Collection of utility functions to apply common behaviour to a compiled tree
 * @var {Object}
 */
const tools = {
  /**
   * Visit the given node types within a deeply nested tree and run a function
   * This function may mutate the input tree depending on the actions of the callbacks
   * NOTE: If the return value of the callback is `"DEL"` the node is deleted
   * @param {array} tree The tree sturcture to operate on
   * @param {null|array} types Node filter to apply to (if falsy all are used)
   * @param {function} callback The callback to call with each node. Called as (node, path)
   * @return {array} The input tree
   */
  visit: (
    tree: Tree,
    types: string[] | null,
    callback: VisitCallback,
  ): Tree => {
    const removals: string[][] = [];
    const treeWalker = (tree: Tree, path: string[]) => {
      for (let i = 0; i < tree.length; i++) {
        const branch = tree[i];
        const nodePath = path.concat(i.toString());

        if (!types || (branch && types.includes(branch.type as string))) {
          if (branch) {
            var result = callback(branch, nodePath);
            if (result === 'DEL') removals.push(nodePath);
          }
        }

        if (
          branch &&
          (branch.type == 'group' || branch.type == 'line') &&
          branch.nodes
        ) {
          treeWalker(branch.nodes, nodePath.concat(['nodes']));
        }
      }
    };

    treeWalker(tree, []);

    removals.reverse().forEach((path) => {
      var nodeName = path.pop();
      var parent = path.length ? getNestedValue(tree, path) : tree;
      if (parent && nodeName !== undefined) {
        delete parent[nodeName];
      }
    });

    return tree;
  },

  /**
   * Apply a series of text replacements to every matching node object within a tree
   * This function mutates tree
   * @param {array} tree The tree sturcture to operate on
   * @param {null|array} types Type filter to apply. If falsy all are used
   * @param {array} replacements Array of replacements to apply. Each must be of the form `{subject: STRING|REGEXP, value: STRING|FUNCTION}`
   * @return {array} The input tree element with the replacements applied
   */
  replaceContent: function (
    tree: Tree,
    types: string[] | null,
    replacements: Replacement[],
  ): Tree {
    this.visit(tree, types, (branch) => {
      if (!branch.content) return;
      replacements.forEach((replacement) => {
        if (typeof replacement.value === 'string') {
          branch.content = branch.content?.replace(
            replacement.subject,
            replacement.value,
          );
        } else {
          branch.content = branch.content?.replace(
            replacement.subject,
            replacement.value as (substring: string, ...args: any[]) => string,
          );
        }
      });
    });
    return tree;
  },

  // Escape all regular expression chars except for pipe
  escapeRegExp: (string: string): string => {
    return string.replace(/[.*+?^${}()[\]\\]/g, '\\$&'); // $& means the whole matched string
  },

  // Replace multiple terms at once
  multiReplace: (
    text: string,
    replaceObj: { [key: string]: string },
  ): string => {
    var template = tools.escapeRegExp(Object.keys(replaceObj).join('|'));
    if (template.length > 0) {
      var regex = new RegExp(template, 'g');
      return text.replace(regex, (match) => replaceObj[match] ?? match);
    } else {
      return text;
    }
  },

  /**
   * Structure the wild cards correctly for cochrane to ensure no wildcards appear inside quotation marks
   * @param {string} text The text to parse
   * @param {Boolean} highlighting Whether to assign custom fonts
   * @return {string} The parsed string seperated by NEXT
   */
  wildCardCochrane: (text: string, highlighting: boolean): string => {
    const wildcards = ['?', '$', '*'];
    let words = text.split(' ');
    let lastMatch = -1;
    let foundMatch = false;
    for (let i = 0; i < words.length; i++) {
      if (wildcards.some((wildcard) => words[i]?.includes(wildcard))) {
        foundMatch = true;
        if (i - 1 > lastMatch) {
          words[lastMatch + 1] = highlighting
            ? '<font color="DarkBlue">"' + words[lastMatch + 1]
            : '"' + words[lastMatch + 1];
          words[i - 1] = highlighting
            ? words[i - 1] + '"</font>'
            : words[i - 1] + '"';
        }
        lastMatch = i;
        if (
          i > 0 &&
          !wildcards.some((wildcard) => words[i - 1]?.includes(wildcard))
        ) {
          words[i] = highlighting
            ? '<font color="purple">NEXT</font> ' + words[i]
            : 'NEXT ' + words[i];
        }
        if (i < words.length - 1) {
          words[i] = highlighting
            ? words[i] + ' <font color="purple">NEXT</font>'
            : words[i] + ' NEXT';
        }
      }
    }
    if (lastMatch + 1 < words.length) {
      words[lastMatch + 1] = highlighting
        ? '<font color="DarkBlue">"' + words[lastMatch + 1]
        : '"' + words[lastMatch + 1];
      words[words.length - 1] = highlighting
        ? words[words.length - 1] + '"</font>'
        : words[words.length - 1] + '"';
    }
    return foundMatch ? `(${words.join(' ')})` : words.join(' ');
  },

  /**
   * Print number in format defined by engine
   * @param {string} engine Engine to use
   * @param {string} ref Branch ref (e.g. 1)
   * @return {string} Formatted number
   */
  printNumber(engine: string, ref: string): string {
    var number = ref;
    switch (engine) {
      case 'PubMed full':
      case 'PubMed abbreviation':
      case 'Cochrane Library':
      case 'Embase (Elsevier)':
      case 'Web of Science':
      case 'WoS Advanced':
      case 'Scopus (basic search)':
      case 'Scopus (advanced search)':
      //HTA
      case 'International HTA Database':
        number = '#' + ref;
        break;
      case 'Ovid MEDLINE':
      case 'PsycInfo (Ovid)':
      case 'ProQuest Health and Medical':
        number = ref;
        break;
      case 'CINAHL (Ebsco)':
      case 'Business Source Ultimate':
      case 'PsycInfo (Ebsco)':
      case 'SPORTDiscus':
        number = 'S' + ref;
        break;
      default:
    }
    return number;
  },

  /**
   * Determine if a phrase needs to be enclosed within speachmarks and return the result
   * @param {Object} branch Phrase branch to examine
   * @param {string} engine Optional engine ID to examine for other enclose methods
   * @param {boolean} highlighting Optional bool to determine if html color styling is added
   * @return {string} The phrase enclosed as needed
   */
  quotePhrase: (
    branch: TreeNode,
    engine?: string,
    settings?: QuotePhraseSettings,
  ): string => {
    var text = branch.content?.trimEnd();
    var space = /\s/.test(text || '');

    if (settings?.replaceWildcards) {
      var replaceObj = {};
      switch (engine) {
        case 'PubMed full':
        case 'PubMed abbreviation':
          replaceObj = {
            $: settings.highlighting
              ? tools.createTooltip(
                  '*',
                  'As PubMed does not support single character truncation a wildcard is used here',
                  'highlight',
                )
              : '*',
            '?': settings.highlighting
              ? tools.createTooltip(
                  '*',
                  'As PubMed does not 0 or 1 character truncation a wildcard is used here',
                  'highlight',
                )
              : '*',
            '#': settings.highlighting
              ? tools.createTooltip(
                  '*',
                  'As PubMed does not single character wildcards a wildcard is used here',
                  'highlight',
                )
              : '*',
          };
          break;
        case 'Ovid MEDLINE':
          break;
        case 'Cochrane Library':
          if (space && text) {
            text = tools.wildCardCochrane(text, settings.highlighting);
          }
          replaceObj = {
            $: settings.highlighting
              ? tools.createTooltip(
                  '?',
                  'As Cochrane does not support single character truncation, the 0 or 1 character truncation is used here.',
                  'highlight',
                )
              : '?',
            '#': '?',
          };
          return tools.multiReplace(text || '', replaceObj);
        case 'Embase (Elsevier)':
        case 'Web of Science':
        case 'WoS Advanced':
          replaceObj = {
            $: '?',
            '?': '$',
            '#': '?',
          };
          break;
        case 'CINAHL (Ebsco)':
          replaceObj = {
            $: '?',
            '?': '#',
            '#': '?',
          };
          break;
        case 'Business Source Ultimate':
          replaceObj = {
            $: '?',
            '?': '#',
            '#': '?',
          };
          break;
        case 'PsycInfo (Ebsco)':
          replaceObj = {
            $: '?',
            '?': '#',
            '#': '?',
          };
          break;
        case 'Scopus (basic search)':
        case 'Scopus (advanced search)':
          // space = true; //Always include quotes with scopus to make phrase a "loose phrase"
          replaceObj = {
            $: '?',
            '?': settings.highlighting
              ? tools.createTooltip(
                  '*',
                  '0 or 1 character truncation is not available. The multiple character wildcard symbol has been substituted.',
                  'highlight',
                )
              : '*',
            '#': '?',
          };
          break;
        case 'PsycInfo (Ovid)':
          replaceObj = {
            $: '#',
          };
          break;
        case 'ProQuest Health and Medical':
          replaceObj = {
            $: '?',
            '#': '?',
          };
          break;
        case 'SPORTDiscus':
          if (!settings.testing) {
            space = true; //Always include quotes with SPORTDiscus
          }
          replaceObj = {
            $: '#?',
            '?': '#',
          };
          break;
        case 'Informit Health Collection':
          replaceObj = {
            $: '?',
            '?': '*1',
          };
          break;
        //HTA
        case 'International HTA Database':
          replaceObj = {
            $: settings.highlighting
              ? tools.createTooltip(
                  '*',
                  'As INAHTA does not support single character truncation a wildcard is used here',
                  'highlight',
                )
              : '*',
            '?': settings.highlighting
              ? tools.createTooltip(
                  '*',
                  'As INAHTA does not support single character truncation a wildcard is used here',
                  'highlight',
                )
              : '*',
            '#': settings.highlighting
              ? tools.createTooltip(
                  '*',
                  'As INAHTA does not support single character truncation a wildcard is used here',
                  'highlight',
                )
              : '*',
          };
          break;
      }
      text = tools.multiReplace(text ?? '', replaceObj);
    }

    return engine == 'Embase (Elsevier)'
      ? space
        ? settings?.highlighting
          ? "<font color='DarkBlue'>'" + text + "'</font>"
          : "'" + text + "'"
        : `${text}`
      : space
        ? settings?.highlighting
          ? '<font color="DarkBlue">"' + text + '"</font>'
          : '"' + text + '"'
        : `${text}`;
  },

  /**
   * Convert the '$or' / '$and' nodes within a tree into a nested structure
   * This function will also flatten identical branches (i.e. run-on multiple $and / $or into one array)
   * @param {Object} tree The object tree to recombine
   * @returns {Object} The recombined tree
   */
  renestConditions: (tree: Tree): Tree => {
    if (!Array.isArray(tree)) return tree;

    return tree.reduce((res, branch, index, arr) => {
      var firstKey = Object.keys(branch)[0];
      if (firstKey == '$or' || firstKey == '$and') {
        var expression: Record<string, any[]> = {};
        expression[firstKey] = [res.pop(), arr.splice(index + 1, 1)[0]];
        (res as any[]).push(expression);
      } else {
        (res as any[]).push(branch);
      }

      return res;
    }, []);
  },

  /**
   * Combine multiple run-on $and / $or conditional branches into one branch
   * This function is a companion function to renestConditions and should be called directly afterwards if needed
   * @param {Object} tree The tree to traverse
   * @param {Object} [options] Additional options to accept
   * @param {number} [options.depth=10] The maximum depth to traverse before giving up, set to 0 to infinitely recurse
   * @return {Object} The collapsed tree
   * @example
   * {left, joinAnd, right} => {joinAnd: [left, right]}
   * @example
   * {foo, joinOr, bar, joinOr, baz} => {joinOr: [foo, bar, baz]}
   */
  combineConditions: (tree: Tree, options?: ConditionCollapseOptions): Tree => {
    const settings = { depth: 10, ...options };

    let collapses: { key: string; path: (string | number)[] }[] = [];
    const traverseTree = (
      branch: Record<string, any>,
      path: (string | number)[] = [],
    ) => {
      for (const k in branch) {
        const v = branch[k];
        if (typeof v === 'object' && v !== null) {
          var firstKey = Object.keys(branch)[0];
          if (path.length > 1 && (firstKey == '$or' || firstKey == '$and')) {
            var lastKey = collapses
              .reverse()
              .find((i) => i.key == '$and' || i.key == '$or');
            collapses.reverse();
            if (!lastKey || lastKey.key == firstKey) {
              collapses.push({ key: firstKey, path: path });
            }
          }
          if (settings.depth && path.length > settings.depth) continue;
          traverseTree(v, path.concat([k]));
        }
      }
    };
    traverseTree(tree);

    collapses.forEach((collapse) => {
      var parent = getNestedValue(tree, collapse.path.slice(0, -1));
      var child = getNestedValue(tree, collapse.path.concat([collapse.key]));
      if (!child || !parent || !parent.length) return;
      var child2 = parent[1];

      if (child2) child.push(child2);

      var lastParent = collapse.path
        .slice(0, -1)
        .reverse()
        .find((item) => typeof item === 'string');
      if (lastParent && lastParent == '$and' && collapse.key == '$or')
        child = { $or: child };

      setNestedValue(tree, collapse.path.slice(0, -1), child);
    });

    return tree;
  },

  /**
   * Create a tooltip with a specified message
   * @param {string} content Content to append tooltip to
   * @param {string} message Message to contain inside tooltip
   * @param {string} css CSS class to use
   */
  createTooltip(content: string, message: string, css?: string): string {
    css = typeof css !== 'undefined' ? css : 'black-underline';
    return (
      `<span class="` +
      css +
      '" v-tooltip="`' +
      message +
      '`">' +
      content +
      '</span>'
    );
  },

  /**
   * Create a popover with options to replace empty field tags with specified field tag
   * @param {string} content Content to append popover to
   */
  createPopover(content: string, offset?: number): string {
    return (
      '<v-popover offset="8" placement="right">' +
      '<span class="blue-underline">' +
      content +
      '</span>' +
      '<template slot="popover">' +
      '<h3 class="popover-header">Add Field Tag</h3>' +
      '<input class="tooltip-content" v-model="customField" placeholder="Field tag" />' +
      '<div class="replace-all">' +
      '<input type="checkbox" id="checkbox" v-model="replaceAll">' +
      '<label for="checkbox">Replace All</label>' +
      '</div>' +
      '<div class="replace-buttons">' +
      '<button v-on:click="replaceFields(customField, replaceAll, ' +
      offset +
      ')" type="button" class="btn btn-primary">Replace</button>' +
      '<button v-close-popover type="button" class="btn btn-dark">Close</button>' +
      '</div>' +
      '</template>' +
      '</v-popover>'
    );
  },
};

function getNestedValue(obj: any, path: (string | number)[]): any {
  return path.reduce(
    (current, key) =>
      current && typeof current === 'object' ? current[key] : undefined,
    obj,
  );
}

function setNestedValue(obj: any, path: (string | number)[], value: any): void {
  const lastKey = path.pop();
  const target = path.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  if (lastKey !== undefined) target[lastKey] = value;
}

export default tools;
