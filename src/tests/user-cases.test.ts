import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

/**
 * Collection of user-found bugs and edge cases
 */
describe('User edge cases', () => {
  // Issue - a running series of 'whitespace' doesn't get closed off properly. So a mesh term + closing brackets cancels the next whitespace character
  it('Running whitespace - mesh + brackets + real whitespace', () => {
    expect(
      gilgit.translate('(exp term1/) and (term2)', 'PubMed abbreviation'),
    ).toBe('(term1[Mesh]) AND (term2)');
    expect(gilgit.translate('respiratory', 'PubMed abbreviation')).toBe(
      'respiratory',
    );
    expect(
      gilgit.translate('refrigerator OR understand', 'PubMed abbreviation'),
    ).toBe('refrigerator OR understand'); // Words containing OR + AND
  });

  // Issue any whitespace after a search phrase gets bundled in with the field translation
  it('Whitespace for field translations should be removed', () => {
    expect(gilgit.translate('term .tw.', 'PubMed abbreviation')).toBe(
      'term[tiab]',
    );
    expect(gilgit.translate('term.tw. ', 'PubMed abbreviation')).toBe(
      'term[tiab]',
    );
    expect(gilgit.translate('term.tw.  ', 'PubMed abbreviation')).toBe(
      'term[tiab]',
    );
    expect(gilgit.translate('hello world .tw.', 'PubMed abbreviation')).toBe(
      '"hello world"[tiab]',
    );
    expect(gilgit.translate('hello world.tw. ', 'PubMed abbreviation')).toBe(
      '"hello world"[tiab]',
    );
    expect(gilgit.translate('hello world.tw.  ', 'PubMed abbreviation')).toBe(
      '"hello world"[tiab]',
    );
  });

  // Issue 'or' and 'and' occurring at the start of words gets interpreted as the meta conditions 'OR' / 'AND'
  it('Boolean meta-terms within text should not get interpreted (AND / OR / NOT / ADJ / NEAR)', () => {
    expect(gilgit.translate('ornamental androids', 'PubMed abbreviation')).toBe(
      '"ornamental androids"',
    );
    expect(
      gilgit.translate('"parkland subcontractor"', 'PubMed abbreviation'),
    ).toBe('"parkland subcontractor"');
    expect(
      gilgit.translate('androgynous orchestra', 'PubMed abbreviation'),
    ).toBe('"androgynous orchestra"');
    expect(gilgit.translate('notational origins', 'PubMed abbreviation')).toBe(
      '"notational origins"',
    );
    expect(
      gilgit.translate('"worship sandwiches"', 'PubMed abbreviation'),
    ).toBe('"worship sandwiches"');
    expect(
      gilgit.translate('sandlewood deodorant', 'PubMed abbreviation'),
    ).toBe('"sandlewood deodorant"');
    expect(
      gilgit.translate('"notionally nearsighted"', 'PubMed abbreviation'),
    ).toBe('"notionally nearsighted"');
    expect(gilgit.translate('"adjust knot"', 'PubMed abbreviation')).toBe(
      '"adjust knot"',
    );
  });
});
