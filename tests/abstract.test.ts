import { expect, describe, it } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate abstract searches (PubMed -> *)', () => {
  it('translate `term[ab]` -> PM `term[tiab]`', () => {
    expect(gilgit.translate('term[ab]', 'PubMed abbreviation')).toBe(
      'term[ab]',
    );
  });

  it('translate `term[ab]` -> OV `term.ab`', () => {
    expect(gilgit.translate('term[ab]', 'Ovid MEDLINE')).toBe('term.ab.');
  });

  it('translate `term[ab]` -> CO `term:ab`', () => {
    expect(gilgit.translate('term[ab]', 'Cochrane Library')).toBe('term:ab');
  });

  it('translate `term[ab]` -> EM `term:ab`', () => {
    expect(gilgit.translate('term[ab]', 'Embase (Elsevier)')).toBe('term:ab');
  });

  it('translate `term[ab]` -> CI `AB term`', () => {
    expect(gilgit.translate('term[ab]', 'CINAHL (Ebsco)')).toBe('(AB term)');
  });

  it('translate `term[ab]` -> PY `term.ab.`', () => {
    expect(gilgit.translate('term[ab]', 'PsycInfo (Ovid)')).toBe('term.ab.');
  });

  it('translate `term[ab]` -> SC `ABS(term)`', () => {
    expect(gilgit.translate('term[ab]', 'Scopus (advanced search)')).toBe(
      'ABS(term)',
    );
  });

  it('translate `term[ab]` -> WS `term`', () => {
    expect(gilgit.translate('term[ab]', 'Web of Science')).toBe('term');
  });

  //International HTA Database
  it('translate `term[ab]` -> HTA `(term)[abs]`', () => {
    expect(gilgit.translate('term[ab]', 'International HTA Database')).toBe(
      '(term)[abs]',
    );
  });

  // PsycInfo (Ebsco)
  it('translate `term[ab]` -> PYE `AB term`', () => {
    expect(gilgit.translate('term[ab]', 'PsycInfo (Ebsco)')).toBe('(AB term)');
  });

  // Business Source Ultimate
  it('translate `term[ab]` -> BU `AB term`', () => {
    expect(gilgit.translate('term[ab]', 'Business Source Ultimate')).toBe(
      '(AB term)',
    );
  });
});
