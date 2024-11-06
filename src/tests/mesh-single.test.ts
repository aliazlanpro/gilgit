import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Translate single MESH terms (PubMed -> *)', () => {
  it('translate `term[Mesh]` -> PM `term[Mesh]`', () => {
    expect(gilgit.translate('term[Mesh]', 'PubMed abbreviation')).toBe(
      'term[Mesh]',
    );
  });

  it('translate `term[Mesh]` -> OV `exp term/`', () => {
    expect(gilgit.translate('term[Mesh]', 'Ovid MEDLINE')).toBe('exp term/');
  });

  it('translate `term[Mesh]` -> CO `[mh term]`', () => {
    expect(gilgit.translate('term[Mesh]', 'Cochrane Library')).toBe(
      '[mh term]',
    );
  });

  it('translate `term[Mesh]` -> EM `term/exp`', () => {
    expect(gilgit.translate('term[Mesh]', 'Embase (Elsevier)')).toBe(
      'term/exp',
    );
  });

  it('translate `term[Mesh]` -> CI `(MH term+)`', () => {
    expect(gilgit.translate('term[Mesh]', 'CINAHL (Ebsco)')).toBe('(MH term+)');
  });

  it('translate `term[Mesh]` -> PY `term`', () => {
    expect(gilgit.translate('term[Mesh]', 'PsycInfo (Ovid)')).toBe('exp term/');
  });

  it('translate `term[Mesh]` -> SC `(MH term+)`', () => {
    expect(gilgit.translate('term[Mesh]', 'Scopus (advanced search)')).toBe(
      'INDEXTERMS(term)',
    );
  });

  it('translate `term[Mesh]` -> WS `term`', () => {
    expect(gilgit.translate('term[Mesh]', 'Web of Science')).toBe('term');
  });

  it('translate `term[Mesh]` -> HTA `term[mhe]`', () => {
    expect(gilgit.translate('term[Mesh]', 'International HTA Database')).toBe(
      'term[mhe]',
    );
  });

  it('translate `term[Mesh]` -> PYE `(MH term+)`', () => {
    expect(gilgit.translate('term[Mesh]', 'PsycInfo (Ebsco)')).toBe(
      '(MH term+)',
    );
  });

  it('translate `term[Mesh]` -> BU `(MH term+)`', () => {
    expect(gilgit.translate('term[Mesh]', 'Business Source Ultimate')).toBe(
      '(MH term+)',
    );
  });
});

describe('Translate single MESH terms (PubMed (short) -> *)', () => {
  it('translate `term[mh]` -> PM `term[Mesh]`', () => {
    expect(gilgit.translate('term[mh]', 'PubMed abbreviation')).toBe(
      'term[Mesh]',
    );
  });

  it('translate `term[mh]` -> OV `exp term/`', () => {
    expect(gilgit.translate('term[mh]', 'Ovid MEDLINE')).toBe('exp term/');
  });

  it('translate `term[mh]` -> CO `[mh term]`', () => {
    expect(gilgit.translate('term[mh]', 'Cochrane Library')).toBe('[mh term]');
  });

  it('translate `term[mh]` -> EM `term/exp`', () => {
    expect(gilgit.translate('term[mh]', 'Embase (Elsevier)')).toBe('term/exp');
  });

  it('translate `term[mh]` -> CI `(MH term+)`', () => {
    expect(gilgit.translate('term[mh]', 'CINAHL (Ebsco)')).toBe('(MH term+)');
  });

  it('translate `term[mh]` -> PY `term`', () => {
    expect(gilgit.translate('term[mh]', 'PsycInfo (Ovid)')).toBe('exp term/');
  });

  it('translate `term[mh]` -> SC `(MH term+)`', () => {
    expect(gilgit.translate('term[mh]', 'Scopus (advanced search)')).toBe(
      'INDEXTERMS(term)',
    );
  });

  it('translate `term[mh]` -> WS `term`', () => {
    expect(gilgit.translate('term[mh]', 'Web of Science')).toBe('term');
  });

  it('translate `term[mh]` -> HTA `term[mhe]`', () => {
    expect(gilgit.translate('term[mh]', 'International HTA Database')).toBe(
      'term[mhe]',
    );
  });

  it('translate `term[mh]` -> PYE `(MH term+)`', () => {
    expect(gilgit.translate('term[mh]', 'PsycInfo (Ebsco)')).toBe('(MH term+)');
  });

  it('translate `term[mh]` -> BU `(MH term+)`', () => {
    expect(gilgit.translate('term[mh]', 'Business Source Ultimate')).toBe(
      '(MH term+)',
    );
  });
});

describe('Translate single MESH terms (PubMed (long) -> *)', () => {
  it('translate `term[MeSH Terms]` -> PM `term[Mesh]`', () => {
    expect(gilgit.translate('term[MeSH Terms]', 'PubMed abbreviation')).toBe(
      'term[Mesh]',
    );
  });

  it('translate `term[MeSH Terms]` -> OV `exp term/`', () => {
    expect(gilgit.translate('term[MeSH Terms]', 'Ovid MEDLINE')).toBe(
      'exp term/',
    );
  });

  it('translate `term[MeSH Terms]` -> CO `[mh term]`', () => {
    expect(gilgit.translate('term[MeSH Terms]', 'Cochrane Library')).toBe(
      '[mh term]',
    );
  });

  it('translate `term[MeSH Terms]` -> EM `term/exp`', () => {
    expect(gilgit.translate('term[MeSH Terms]', 'Embase (Elsevier)')).toBe(
      'term/exp',
    );
  });

  it('translate `term[MeSH Terms]` -> CI `(MH term+)`', () => {
    expect(gilgit.translate('term[MeSH Terms]', 'CINAHL (Ebsco)')).toBe(
      '(MH term+)',
    );
  });

  it('translate `term[MeSH Terms]` -> PY `term`', () => {
    expect(gilgit.translate('term[MeSH Terms]', 'PsycInfo (Ovid)')).toBe(
      'exp term/',
    );
  });

  it('translate `term[MeSH Terms]` -> SC `(MH term+)`', () => {
    expect(
      gilgit.translate('term[MeSH Terms]', 'Scopus (advanced search)'),
    ).toBe('INDEXTERMS(term)');
  });

  it('translate `term[MeSH Terms]` -> WS `term`', () => {
    expect(gilgit.translate('term[MeSH Terms]', 'Web of Science')).toBe('term');
  });

  it('translate `term[MeSH Terms]` -> HTA `term[mhe]`', () => {
    expect(
      gilgit.translate('term[MeSH Terms]', 'International HTA Database'),
    ).toBe('term[mhe]');
  });

  it('translate `term[MeSH Terms]` -> PYE `(MH term+)`', () => {
    expect(gilgit.translate('term[MeSH Terms]', 'PsycInfo (Ebsco)')).toBe(
      '(MH term+)',
    );
  });

  it('translate `term[MeSH Terms]` -> BU `(MH term+)`', () => {
    expect(
      gilgit.translate('term[MeSH Terms]', 'Business Source Ultimate'),
    ).toBe('(MH term+)');
  });
});

describe('Translate single MESH terms (Ovid MEDLINE -> *)', () => {
  it('translate `exp term/` -> PM `term[Mesh]`', () => {
    expect(gilgit.translate('exp term/', 'PubMed abbreviation')).toBe(
      'term[Mesh]',
    );
  });

  it('translate `exp term/` -> OV `exp term/`', () => {
    expect(gilgit.translate('exp term/', 'Ovid MEDLINE')).toBe('exp term/');
  });

  it('translate `exp term/` -> CO `[mh term]`', () => {
    expect(gilgit.translate('exp term/', 'Cochrane Library')).toBe('[mh term]');
  });

  it('translate `exp term/` -> EM `term/exp`', () => {
    expect(gilgit.translate('exp term/', 'Embase (Elsevier)')).toBe('term/exp');
  });

  it('translate `exp term/` -> CI `(MH term+)`', () => {
    expect(gilgit.translate('exp term/', 'CINAHL (Ebsco)')).toBe('(MH term+)');
  });

  it('translate `exp term/` -> PY `term`', () => {
    expect(gilgit.translate('exp term/', 'PsycInfo (Ovid)')).toBe('exp term/');
  });

  it('translate `exp term/` -> SC `(MH term+)`', () => {
    expect(gilgit.translate('exp term/', 'Scopus (advanced search)')).toBe(
      'INDEXTERMS(term)',
    );
  });

  it('translate `exp term/` -> WS `term`', () => {
    expect(gilgit.translate('exp term/', 'Web of Science')).toBe('term');
  });

  it('translate `exp term/` -> HTA `term[mhe]`', () => {
    expect(gilgit.translate('exp term/', 'International HTA Database')).toBe(
      'term[mhe]',
    );
  });

  it('translate `exp term/` -> PYE `(MH term+)`', () => {
    expect(gilgit.translate('exp term/', 'PsycInfo (Ebsco)')).toBe(
      '(MH term+)',
    );
  });

  it('translate `exp term/` -> BU `(MH term+)`', () => {
    expect(gilgit.translate('exp term/', 'Business Source Ultimate')).toBe(
      '(MH term+)',
    );
  });
});
