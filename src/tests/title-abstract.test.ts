import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Translate title + abstract searches (PubMed -> *)', () => {
  it('translate `term[tiab]` -> PM `term[tiab]`', () => {
    expect(gilgit.translate('term[tiab]', 'PubMed abbreviation')).toBe(
      'term[tiab]',
    );
  });

  it('translate `term[tiab]` -> OV `term.tw.`', () => {
    expect(gilgit.translate('term[tiab]', 'Ovid MEDLINE')).toBe('term.tw.');
  });

  it('translate `term[tiab]` -> CO `term:ti,ab`', () => {
    expect(gilgit.translate('term[tiab]', 'Cochrane Library')).toBe(
      'term:ti,ab',
    );
  });

  it('translate `term[tiab]` -> EM `term:ti,ab`', () => {
    expect(gilgit.translate('term[tiab]', 'Embase (Elsevier)')).toBe(
      'term:ti,ab',
    );
  });

  it('translate `term[tiab]` -> CI `TI term OR AB term2`', () => {
    expect(gilgit.translate('term[tiab]', 'CINAHL (Ebsco)')).toBe(
      '(TI term OR AB term)',
    );
  });

  it('translate `term[tiab]` -> PY `term.ti,ab.`', () => {
    expect(gilgit.translate('term[tiab]', 'PsycInfo (Ovid)')).toBe(
      'term.ti,ab.',
    );
  });

  it('translate `term[tiab]` -> SC `TITLE-ABS(term)`', () => {
    expect(gilgit.translate('term[tiab]', 'Scopus (advanced search)')).toBe(
      'TITLE-ABS(term)',
    );
  });

  it('translate `term[tiab]` -> WS `term`', () => {
    expect(gilgit.translate('term[tiab]', 'Web of Science')).toBe('term');
  });

  //International HTA Database
  it('translate `term[tiab]` -> HTA `(term)[title] OR (term)[abs]`', () => {
    expect(gilgit.translate('term[tiab]', 'International HTA Database')).toBe(
      '(term)[title] OR (term)[abs]',
    );
  });

  // PsycInfo(Ebsco)
  it('translate `term[tiab]` -> PYE `TI term OR AB term2`', () => {
    expect(gilgit.translate('term[tiab]', 'PsycInfo (Ebsco)')).toBe(
      '(TI term OR AB term)',
    );
  });

  // Business Source Ultimate
  it('translate `term[tiab]` -> BU `TI term OR AB term2`', () => {
    expect(gilgit.translate('term[tiab]', 'Business Source Ultimate')).toBe(
      '(TI term OR AB term)',
    );
  });
});

// ... Continue with the same pattern for other describe blocks ...
