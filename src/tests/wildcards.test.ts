import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Translate wildcards searches (multiple character "*" style)', () => {
  it('translate `term*` -> PM `term*`', () => {
    expect(gilgit.translate('term*', 'PubMed abbreviation')).toBe('term*');
  });

  it('translate `term*` -> OV `term*`', () => {
    expect(gilgit.translate('term*', 'Ovid MEDLINE')).toBe('term*');
  });

  it('translate `term*` -> CO `term*`', () => {
    expect(gilgit.translate('term*', 'Cochrane Library')).toBe('term*');
  });

  it('translate `term*` -> EM `term*`', () => {
    expect(gilgit.translate('term*', 'Embase (Elsevier)')).toBe('term*');
  });

  it('translate `term*` -> CI `term*`', () => {
    expect(gilgit.translate('term*', 'CINAHL (Ebsco)')).toBe('term*');
  });

  it('translate `term*` -> PY `term*`', () => {
    expect(gilgit.translate('term*', 'PsycInfo (Ovid)')).toBe('term*');
  });

  it('translate `term*` -> SC `term*`', () => {
    expect(gilgit.translate('term*', 'Scopus (advanced search)')).toBe('term*');
  });

  it('translate `term*` -> WS `term*`', () => {
    expect(gilgit.translate('term*', 'Web of Science')).toBe('term*');
  });

  it('translate `term*` -> HTA `term*`', () => {
    expect(gilgit.translate('term*', 'International HTA Database')).toBe(
      'term*',
    );
  });

  it('translate `term*` -> PYE `term*`', () => {
    expect(gilgit.translate('term*', 'PsycInfo (Ebsco)')).toBe('term*');
  });

  it('translate `term*` -> BU `term*`', () => {
    expect(gilgit.translate('term*', 'Business Source Ultimate')).toBe('term*');
  });
});

describe('Translate wildcards searches (single character "#" style)', () => {
  it('translate `term#` -> PM `term*`', () => {
    expect(gilgit.translate('term#', 'PubMed abbreviation')).toBe('term*');
  });

  it('translate `term#` -> OV `term#`', () => {
    expect(gilgit.translate('term#', 'Ovid MEDLINE')).toBe('term#');
  });

  it('translate `term#` -> CO `term?`', () => {
    expect(gilgit.translate('term#', 'Cochrane Library')).toBe('term?');
  });

  it('translate `term#` -> EM `term?`', () => {
    expect(gilgit.translate('term#', 'Embase (Elsevier)')).toBe('term?');
  });

  it('translate `term#` -> CI `term?`', () => {
    expect(gilgit.translate('term#', 'CINAHL (Ebsco)')).toBe('term?');
  });

  it('translate `term#` -> PY `term#`', () => {
    expect(gilgit.translate('term#', 'PsycInfo (Ovid)')).toBe('term#');
  });

  it('translate `term#` -> SC `term?`', () => {
    expect(gilgit.translate('term#', 'Scopus (advanced search)')).toBe('term?');
  });

  it('translate `term#` -> WS `term?`', () => {
    expect(gilgit.translate('term#', 'Web of Science')).toBe('term?');
  });

  it('translate `term#` -> HTA `term*`', () => {
    expect(gilgit.translate('term#', 'International HTA Database')).toBe(
      'term*',
    );
  });

  it('translate `term#` -> PYE `term?`', () => {
    expect(gilgit.translate('term#', 'PsycInfo (Ebsco)')).toBe('term?');
  });

  it('translate `term#` -> BU `term?`', () => {
    expect(gilgit.translate('term#', 'Business Source Ultimate')).toBe('term?');
  });
});

describe('Translate wildcards searches (single character Ovid "?" style)', () => {
  it('translate `term?` -> PM `term*`', () => {
    expect(gilgit.translate('term?', 'PubMed abbreviation')).toBe('term*');
  });

  it('translate `term?` -> OV `term?`', () => {
    expect(gilgit.translate('term?', 'Ovid MEDLINE')).toBe('term?');
  });

  it('translate `term?` -> CO `term?`', () => {
    expect(gilgit.translate('term?', 'Cochrane Library')).toBe('term?');
  });

  it('translate `term?` -> EM `term$`', () => {
    expect(gilgit.translate('term?', 'Embase (Elsevier)')).toBe('term$');
  });

  it('translate `term?` -> CI `term#`', () => {
    expect(gilgit.translate('term?', 'CINAHL (Ebsco)')).toBe('term#');
  });

  it('translate `term?` -> PY `term?`', () => {
    expect(gilgit.translate('term?', 'PsycInfo (Ovid)')).toBe('term?');
  });

  it('translate `term?` -> SC `term*`', () => {
    expect(gilgit.translate('term?', 'Scopus (advanced search)')).toBe('term*');
  });

  it('translate `term?` -> WS `term$`', () => {
    expect(gilgit.translate('term?', 'Web of Science')).toBe('term$');
  });

  it('translate `term?` -> HTA `term*`', () => {
    expect(gilgit.translate('term?', 'International HTA Database')).toBe(
      'term*',
    );
  });

  it('translate `term?` -> PYE `term#`', () => {
    expect(gilgit.translate('term?', 'PsycInfo (Ebsco)')).toBe('term#');
  });

  it('translate `term?` -> BU `term#`', () => {
    expect(gilgit.translate('term?', 'Business Source Ultimate')).toBe('term#');
  });
});

describe('Translate wildcards searches (single character Ovid MEDLINE "$" style)', () => {
  it('translate `term$` -> PM `term*`', () => {
    expect(gilgit.translate('term$', 'PubMed abbreviation')).toBe('term*');
  });

  it('translate `term$` -> OV `term$`', () => {
    expect(gilgit.translate('term$', 'Ovid MEDLINE')).toBe('term$');
  });

  it('translate `term$` -> CO `term?`', () => {
    expect(gilgit.translate('term$', 'Cochrane Library')).toBe('term?');
  });

  it('translate `term$` -> EM `term*`', () => {
    expect(gilgit.translate('term$', 'Embase (Elsevier)')).toBe('term?');
  });

  it('translate `term$` -> CI `term*`', () => {
    expect(gilgit.translate('term$', 'CINAHL (Ebsco)')).toBe('term?');
  });

  it('translate `term$` -> PY `term*`', () => {
    expect(gilgit.translate('term$', 'PsycInfo (Ovid)')).toBe('term#');
  });

  it('translate `term$` -> SC `term*`', () => {
    expect(gilgit.translate('term$', 'Scopus (advanced search)')).toBe('term?');
  });

  it('translate `term$` -> WS `term*`', () => {
    expect(gilgit.translate('term$', 'Web of Science')).toBe('term?');
  });

  it('translate `term$` -> HTA `term*`', () => {
    expect(gilgit.translate('term$', 'International HTA Database')).toBe(
      'term*',
    );
  });

  it('translate `term$` -> PYE `term*`', () => {
    expect(gilgit.translate('term$', 'PsycInfo (Ebsco)')).toBe('term?');
  });

  it('translate `term$` -> BU `term*`', () => {
    expect(gilgit.translate('term$', 'Business Source Ultimate')).toBe('term?');
  });
});
