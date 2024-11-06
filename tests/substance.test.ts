import { expect, describe, it } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate substance searches (PubMed -> *)', () => {
  it('translate `term[nm]` -> PM `term[nm]`', () => {
    expect(gilgit.translate('term[nm]', 'PubMed abbreviation')).toBe(
      'term[nm]',
    );
  });

  it('translate `term[nm]` -> OV `term.nm.`', () => {
    expect(gilgit.translate('term[nm]', 'Ovid MEDLINE')).toBe('term.nm.');
  });

  it('translate `term[nm]` -> CO `term:ti`', () => {
    expect(gilgit.translate('term[nm]', 'Cochrane Library')).toBe('term:kw');
  });

  it('translate `term[nm]` -> EM `term:ti`', () => {
    expect(gilgit.translate('term[nm]', 'Embase (Elsevier)')).toBe('term:tn');
  });

  it('translate `term[nm]` -> CI `MW term`', () => {
    expect(gilgit.translate('term[nm]', 'CINAHL (Ebsco)')).toBe('(MW term)');
  });

  it('translate `term[nm]` -> PY `term.hw.`', () => {
    expect(gilgit.translate('term[nm]', 'PsycInfo (Ovid)')).toBe('term.hw.');
  });

  it('translate `term[nm]` -> SC `CHEM(term)`', () => {
    expect(gilgit.translate('term[nm]', 'Scopus (advanced search)')).toBe(
      'CHEM(term)',
    );
  });

  it('translate `term[nm]` -> WS `term`', () => {
    expect(gilgit.translate('term[nm]', 'Web of Science')).toBe('term');
  });

  it('translate `term[nm]` -> HAT `term`', () => {
    expect(gilgit.translate('term[nm]', 'International HTA Database')).toBe(
      'term',
    );
  });

  it('translate `term[nm]` -> PYE `MW term`', () => {
    expect(gilgit.translate('term[nm]', 'PsycInfo (Ebsco)')).toBe('(MW term)');
  });

  it('translate `term[nm]` -> BU `MW term`', () => {
    expect(gilgit.translate('term[nm]', 'Business Source Ultimate')).toBe(
      '(MW term)',
    );
  });
});

describe('Translate substance searches (Ovid MEDLINE -> *)', () => {
  it('translate `term.nm.` -> PM `term[nm]`', () => {
    expect(gilgit.translate('term.nm.', 'PubMed abbreviation')).toBe(
      'term[nm]',
    );
  });

  it('translate `term.nm.` -> OV `term.nm.`', () => {
    expect(gilgit.translate('term.nm.', 'Ovid MEDLINE')).toBe('term.nm.');
  });

  it('translate `term.nm.` -> CO `term:ti`', () => {
    expect(gilgit.translate('term.nm.', 'Cochrane Library')).toBe('term:kw');
  });

  it('translate `term.nm.` -> EM `term:ti`', () => {
    expect(gilgit.translate('term.nm.', 'Embase (Elsevier)')).toBe('term:tn');
  });

  it('translate `term.nm.` -> CI `TI term`', () => {
    expect(gilgit.translate('term.nm.', 'CINAHL (Ebsco)')).toBe('(MW term)');
  });

  it('translate `term.nm.` -> PY `AB term`', () => {
    expect(gilgit.translate('term.nm.', 'PsycInfo (Ovid)')).toBe('term.hw.');
  });

  it('translate `term.nm.` -> SC `AB term`', () => {
    expect(gilgit.translate('term.nm.', 'Scopus (advanced search)')).toBe(
      'CHEM(term)',
    );
  });

  it('translate `term.nm.` -> WS `term`', () => {
    expect(gilgit.translate('term.nm.', 'Web of Science')).toBe('term');
  });

  it('translate `term.nm.` -> HAT `term`', () => {
    expect(gilgit.translate('term.nm.', 'International HTA Database')).toBe(
      'term',
    );
  });

  it('translate `term.nm.` -> PYE `TI term`', () => {
    expect(gilgit.translate('term.nm.', 'PsycInfo (Ebsco)')).toBe('(MW term)');
  });

  it('translate `term.nm.` -> BU `TI term`', () => {
    expect(gilgit.translate('term.nm.', 'Business Source Ultimate')).toBe(
      '(MW term)',
    );
  });
});
