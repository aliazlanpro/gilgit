import { describe, it, expect } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate floating subheading searches (PubMed -> *)', () => {
  it('translate `term[sh]` -> PM `term[sh]`', () => {
    expect(gilgit.translate('term[sh]', 'PubMed abbreviation')).toBe(
      'term[sh]',
    );
  });

  it('translate `term[sh]` -> OV `term.fs`', () => {
    expect(gilgit.translate('term[sh]', 'Ovid MEDLINE')).toBe('term.fs.');
  });

  it('translate `term[sh]` -> CO `[mh /term]`', () => {
    expect(gilgit.translate('term[sh]', 'Cochrane Library')).toBe('[mh /term]');
  });

  it('translate `term[sh]` -> EM `term:lnk`', () => {
    expect(gilgit.translate('term[sh]', 'Embase (Elsevier)')).toBe('term:lnk');
  });

  it('translate `term[sh]` -> CI `MW term`', () => {
    expect(gilgit.translate('term[sh]', 'CINAHL (Ebsco)')).toBe('(MW term)');
  });

  it('translate `term[sh]` -> PY `term.hw.`', () => {
    expect(gilgit.translate('term[sh]', 'PsycInfo (Ovid)')).toBe('term.hw.');
  });

  it('translate `term[sh]` -> SC `INDEXTERMS(term)`', () => {
    expect(gilgit.translate('term[sh]', 'Scopus (advanced search)')).toBe(
      'INDEXTERMS(term)',
    );
  });

  it('translate `term[sh]` -> WS `term`', () => {
    expect(gilgit.translate('term[sh]', 'Web of Science')).toBe('term');
  });

  it('translate `term[sh]` -> HTA `term`', () => {
    expect(gilgit.translate('term[sh]', 'International HTA Database')).toBe(
      'term',
    );
  });

  it('translate `term[sh]` -> PYE `MW term`', () => {
    expect(gilgit.translate('term[sh]', 'PsycInfo (Ebsco)')).toBe('(MW term)');
  });

  it('translate `term[sh]` -> BU `MW term`', () => {
    expect(gilgit.translate('term[sh]', 'Business Source Ultimate')).toBe(
      '(MW term)',
    );
  });
});
