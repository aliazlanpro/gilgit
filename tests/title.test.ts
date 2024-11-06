import { expect, describe, it } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate title searches (PubMed -> *)', () => {
  it('translate `term[ti]` -> PM `term[ti]`', () => {
    expect(gilgit.translate('term[ti]', 'PubMed abbreviation')).toBe(
      'term[ti]',
    );
  });

  it('translate `term[ti]` -> OV `term.ti`', () => {
    expect(gilgit.translate('term[ti]', 'Ovid MEDLINE')).toBe('term.ti.');
  });

  it('translate `term[ti]` -> CO `term:ti`', () => {
    expect(gilgit.translate('term[ti]', 'Cochrane Library')).toBe('term:ti');
  });

  it('translate `term[ti]` -> EM `term:ti`', () => {
    expect(gilgit.translate('term[ti]', 'Embase (Elsevier)')).toBe('term:ti');
  });

  it('translate `term[ti]` -> CI `TI term`', () => {
    expect(gilgit.translate('term[ti]', 'CINAHL (Ebsco)')).toBe('(TI term)');
  });

  it('translate `term[ab]` -> PY `term.ti.`', () => {
    expect(gilgit.translate('term[ti]', 'PsycInfo (Ovid)')).toBe('term.ti.');
  });

  it('translate `term[ab]` -> SC `AB term`', () => {
    expect(gilgit.translate('term[ti]', 'Scopus (advanced search)')).toBe(
      'TITLE(term)',
    );
  });

  it('translate `term[ti]` -> WS `term`', () => {
    expect(gilgit.translate('term[ti]', 'Web of Science')).toBe('term');
  });

  it('translate `term[ti]` -> HTA `(term)[title]`', () => {
    expect(gilgit.translate('term[ti]', 'International HTA Database')).toBe(
      '(term)[title]',
    );
  });

  it('translate `term[ti]` -> PYE `TI term`', () => {
    expect(gilgit.translate('term[ti]', 'PsycInfo (Ebsco)')).toBe('(TI term)');
  });

  it('translate `term[ti]` -> BU `TI term`', () => {
    expect(gilgit.translate('term[ti]', 'Business Source Ultimate')).toBe(
      '(TI term)',
    );
  });
});

describe('Translate title searches (PubMed -> *)', () => {
  it('translate `term[Title]` -> PM `term[ti]`', () => {
    expect(gilgit.translate('term[Title]', 'PubMed abbreviation')).toBe(
      'term[ti]',
    );
  });

  it('translate `term[Title]` -> OV `term.ti`', () => {
    expect(gilgit.translate('term[Title]', 'Ovid MEDLINE')).toBe('term.ti.');
  });

  it('translate `term[Title]` -> CO `term:ti`', () => {
    expect(gilgit.translate('term[Title]', 'Cochrane Library')).toBe('term:ti');
  });

  it('translate `term[Title]` -> EM `term:ti`', () => {
    expect(gilgit.translate('term[Title]', 'Embase (Elsevier)')).toBe(
      'term:ti',
    );
  });

  it('translate `term[Title]` -> CI `TI term`', () => {
    expect(gilgit.translate('term[Title]', 'CINAHL (Ebsco)')).toBe('(TI term)');
  });

  it('translate `term[Title]` -> PY `term.ti.`', () => {
    expect(gilgit.translate('term[Title]', 'PsycInfo (Ovid)')).toBe('term.ti.');
  });

  it('translate `term[Title]` -> SC `AB term`', () => {
    expect(gilgit.translate('term[Title]', 'Scopus (advanced search)')).toBe(
      'TITLE(term)',
    );
  });

  it('translate `term[Title]` -> WS `term`', () => {
    expect(gilgit.translate('term[Title]', 'Web of Science')).toBe('term');
  });

  it('translate `term[Title]` -> HTA `(term)[title]`', () => {
    expect(gilgit.translate('term[Title]', 'International HTA Database')).toBe(
      '(term)[title]',
    );
  });

  it('translate `term[Title]` -> PYE `TI term`', () => {
    expect(gilgit.translate('term[Title]', 'PsycInfo (Ebsco)')).toBe(
      '(TI term)',
    );
  });

  it('translate `term[Title]` -> BU `TI term`', () => {
    expect(gilgit.translate('term[Title]', 'Business Source Ultimate')).toBe(
      '(TI term)',
    );
  });
});

describe('Translate title searches (Ovid MEDLINE -> *)', () => {
  it('translate `term.ti` -> PM `term[ti]`', () => {
    expect(gilgit.translate('term.ti', 'PubMed abbreviation')).toBe('term[ti]');
  });

  it('translate `term.ti` -> OV `term.ti`', () => {
    expect(gilgit.translate('term.ti', 'Ovid MEDLINE')).toBe('term.ti.');
  });

  it('translate `term.ti` -> CO `term:ti`', () => {
    expect(gilgit.translate('term.ti', 'Cochrane Library')).toBe('term:ti');
  });

  it('translate `term.ti` -> EM `term:ti`', () => {
    expect(gilgit.translate('term.ti', 'Embase (Elsevier)')).toBe('term:ti');
  });

  it('translate `term.ti` -> CI `TI term`', () => {
    expect(gilgit.translate('term.ti', 'CINAHL (Ebsco)')).toBe('(TI term)');
  });

  it('translate `term.ti.` -> PY `AB term`', () => {
    expect(gilgit.translate('term.ti', 'PsycInfo (Ovid)')).toBe('term.ti.');
  });

  it('translate `term.ti` -> SC `AB term`', () => {
    expect(gilgit.translate('term.ti', 'Scopus (advanced search)')).toBe(
      'TITLE(term)',
    );
  });

  it('translate `term.ti` -> WS `term`', () => {
    expect(gilgit.translate('term.ti', 'Web of Science')).toBe('term');
  });

  it('translate `term.ti` -> HTA `(term)[title]`', () => {
    expect(gilgit.translate('term.ti', 'International HTA Database')).toBe(
      '(term)[title]',
    );
  });

  it('translate `term.ti` -> PYE `TI term`', () => {
    expect(gilgit.translate('term.ti', 'PsycInfo (Ebsco)')).toBe('(TI term)');
  });

  it('translate `term.ti` -> BU `TI term`', () => {
    expect(gilgit.translate('term.ti', 'Business Source Ultimate')).toBe(
      '(TI term)',
    );
  });
});
