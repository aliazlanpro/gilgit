import { expect, describe, it } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate publication type searches (PubMed -> *)', () => {
  it('translate `term[pt]` -> PM `term[pt]`', () => {
    expect(gilgit.translate('term[pt]', 'PubMed abbreviation')).toBe(
      'term[pt]',
    );
  });

  it('translate `term[pt]` -> OV `term.pt`', () => {
    expect(gilgit.translate('term[pt]', 'Ovid MEDLINE')).toBe('term.pt.');
  });

  it('translate `term[pt]` -> CO `term:pt`', () => {
    expect(gilgit.translate('term[pt]', 'Cochrane Library')).toBe('term:pt');
  });

  it('translate `term[pt]` -> EM `term:it`', () => {
    expect(gilgit.translate('term[pt]', 'Embase (Elsevier)')).toBe('term:it');
  });

  it('translate `term[pt]` -> CI `PT term`', () => {
    expect(gilgit.translate('term[pt]', 'CINAHL (Ebsco)')).toBe('(PT term)');
  });

  it('translate `term[pt]` -> PY `term.pt.`', () => {
    expect(gilgit.translate('term[pt]', 'PsycInfo (Ovid)')).toBe('term.pt.');
  });

  it('translate `term[pt]` -> SC `DOCTYPE(term)`', () => {
    expect(gilgit.translate('term[pt]', 'Scopus (advanced search)')).toBe(
      'DOCTYPE(term)',
    );
  });

  it('translate `term[pt]` -> WS `term`', () => {
    expect(gilgit.translate('term[pt]', 'Web of Science')).toBe('term');
  });

  //International HTA Database
  it('translate `term[pt]` -> HTA `term`', () => {
    expect(gilgit.translate('term[pt]', 'International HTA Database')).toBe(
      'term',
    );
  });

  // PsycInfo(Ebsco)
  it('translate `term[pt]` -> PYE `PT term`', () => {
    expect(gilgit.translate('term[pt]', 'PsycInfo (Ebsco)')).toBe('(PT term)');
  });

  // Business Source Ultimate
  it('translate `term[pt]` -> BU `PT term`', () => {
    expect(gilgit.translate('term[pt]', 'Business Source Ultimate')).toBe(
      '(PT term)',
    );
  });
});
