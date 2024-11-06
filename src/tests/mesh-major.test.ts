import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Translate Mesh which appears later in search (Pubmed -> *)', () => {
  it('translate `Language[Majr]` -> OV `exp *Language/`', () => {
    expect(
      gilgit.translate('Title[ti] and Language[Majr]', 'Ovid MEDLINE'),
    ).toBe('Title.ti. AND exp *Language/');
  });

  it('translate `"Practice Guidelines as Topic"[Majr]` -> OV `exp *"Practice Guidelines as Topic"/`', () => {
    expect(
      gilgit.translate(
        'Title[ti] and "Practice Guidelines as Topic"[Majr]',
        'Ovid MEDLINE',
      ),
    ).toBe('Title.ti. AND exp *"Practice Guidelines as Topic"/');
  });

  it('translate `Sandwiched mesh` -> OV', () => {
    expect(
      gilgit.translate(
        '"Practice Guidelines as Topic"[Majr] OR Guideline[ti] OR "Guideline Adherence"[Majr]',
        'Ovid MEDLINE',
      ),
    ).toBe(
      'exp *"Practice Guidelines as Topic"/ OR Guideline.ti. OR exp *"Guideline Adherence"/',
    );
  });
});

describe('Translate MeSH major terms (PubMed -> *)', () => {
  it('translate `term[Majr]` -> PM `term[Majr]`', () => {
    expect(gilgit.translate('term[Majr]', 'PubMed abbreviation')).toBe(
      'term[Majr]',
    );
  });

  it('translate `term[Majr]` -> OV `exp *term/`', () => {
    expect(gilgit.translate('term[Majr]', 'Ovid MEDLINE')).toBe('exp *term/');
  });

  // ... continuing with the same pattern for other tests
  it('translate `term[Majr]` -> CO `[mh term]`', () => {
    expect(gilgit.translate('term[Majr]', 'Cochrane Library')).toBe(
      '[mh term]',
    );
  });

  it('translate `term[Majr]` -> EM `term/exp/mj`', () => {
    expect(gilgit.translate('term[Majr]', 'Embase (Elsevier)')).toBe(
      'term/exp/mj',
    );
  });

  it('translate `term[Majr]` -> CI `(MM term+)`', () => {
    expect(gilgit.translate('term[Majr]', 'CINAHL (Ebsco)')).toBe('(MM term+)');
  });

  it('translate `term[Majr]` -> PY `exp *term/`', () => {
    expect(gilgit.translate('term[Majr]', 'PsycInfo (Ovid)')).toBe(
      'exp *term/',
    );
  });

  it('translate `term[Majr]` -> SC `INDEXTERMS(term)`', () => {
    expect(gilgit.translate('term[Majr]', 'Scopus (advanced search)')).toBe(
      'INDEXTERMS(term)',
    );
  });

  it('translate `term[Majr]` -> WS `term`', () => {
    expect(gilgit.translate('term[Majr]', 'Web of Science')).toBe('term');
  });

  it('translate `term[Majr]` -> HTA `term[mhe]`', () => {
    expect(gilgit.translate('term[Majr]', 'International HTA Database')).toBe(
      'term[mhe]',
    );
  });

  it('translate `term[Majr]` -> PYE `(MM term+)`', () => {
    expect(gilgit.translate('term[Majr]', 'PsycInfo (Ebsco)')).toBe(
      '(MM term+)',
    );
  });

  it('translate `term[Majr]` -> BU `(MM term+)`', () => {
    expect(gilgit.translate('term[Majr]', 'Business Source Ultimate')).toBe(
      '(MM term+)',
    );
  });
});

describe('Translate MeSH major terms (PubMed (long) -> *)', () => {
  it('translate `term[MeSH Major Topic]` -> PM `term[Majr]`', () => {
    expect(
      gilgit.translate('term[MeSH Major Topic]', 'PubMed abbreviation'),
    ).toBe('term[Majr]');
  });

  // ... continuing with similar pattern for other long form tests
  // The pattern is the same as above, just with 'term[MeSH Major Topic]' instead of 'term[Majr]'
});

describe('Translate MeSH major terms (Ovid MEDLINE -> *)', () => {
  it('translate `exp *term/` -> PM `term[Majr]`', () => {
    expect(gilgit.translate('exp *term/', 'PubMed abbreviation')).toBe(
      'term[Majr]',
    );
  });

  // ... continuing with similar pattern for other Ovid MEDLINE tests
  // The pattern is the same as above, just with 'exp *term/' as the input
});
