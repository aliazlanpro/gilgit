import { expect, describe, it } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate title + abstract + other searches (PubMed -> *)', () => {
  it('translate `term[tw]` -> PM `term[tw]`', () => {
    expect(gilgit.translate('term[tw]', 'PubMed abbreviation')).toBe(
      'term[tw]',
    );
  });

  it('translate `term[tw]` -> OV `term.mp.`', () => {
    expect(gilgit.translate('term[tw]', 'Ovid MEDLINE')).toBe('term.mp.');
  });

  it('translate `term[tw]` -> CO `term:ti,ab,kw`', () => {
    expect(gilgit.translate('term[tw]', 'Cochrane Library')).toBe(
      'term:ti,ab,kw',
    );
  });

  it('translate `term[tw]` -> EM `term`', () => {
    expect(gilgit.translate('term[tw]', 'Embase (Elsevier)')).toBe('term');
  });

  it('translate `term[tw]` -> CI `term`', () => {
    expect(gilgit.translate('term[tw]', 'CINAHL (Ebsco)')).toBe('term');
  });

  it('translate `term[tw]` -> PY `term.mp.`', () => {
    expect(gilgit.translate('term[tw]', 'PsycInfo (Ovid)')).toBe('term.mp.');
  });

  it('translate `term[tw]` -> SC `TITLE-ABS-KEY(term)`', () => {
    expect(gilgit.translate('term[tw]', 'Scopus (advanced search)')).toBe(
      'TITLE-ABS-KEY(term)',
    );
  });

  it('translate `term[tw]` -> WS `term`', () => {
    expect(gilgit.translate('term[tw]', 'Web of Science')).toBe('term');
  });

  it('translate `term[tw]` -> HTA `term`', () => {
    expect(gilgit.translate('term[tw]', 'International HTA Database')).toBe(
      'term',
    );
  });

  it('translate `term[tw]` -> PYE `term`', () => {
    expect(gilgit.translate('term[tw]', 'PsycInfo (Ebsco)')).toBe('term');
  });

  it('translate `term[tw]` -> BU `term`', () => {
    expect(gilgit.translate('term[tw]', 'Business Source Ultimate')).toBe(
      'term',
    );
  });
});

describe('Translate title + abstract + other searches (Ovid MEDLINE -> *)', () => {
  it('translate `term.mp.` -> PM `term[tw]`', () => {
    expect(gilgit.translate('term.mp.', 'PubMed abbreviation')).toBe(
      'term[tw]',
    );
  });

  it('translate `term.mp.` -> OV `term.mp.`', () => {
    expect(gilgit.translate('term.mp.', 'Ovid MEDLINE')).toBe('term.mp.');
  });

  it('translate `term.mp.` -> CO `term:ti,ab,kw`', () => {
    expect(gilgit.translate('term.mp.', 'Cochrane Library')).toBe(
      'term:ti,ab,kw',
    );
  });

  it('translate `term.mp.` -> EM `term`', () => {
    expect(gilgit.translate('term.mp.', 'Embase (Elsevier)')).toBe('term');
  });

  it('translate `term.mp.` -> CI `term`', () => {
    expect(gilgit.translate('term.mp.', 'CINAHL (Ebsco)')).toBe('term');
  });

  it('translate `term.mp.` -> PY `term.mp.`', () => {
    expect(gilgit.translate('term.mp.', 'PsycInfo (Ovid)')).toBe('term.mp.');
  });

  it('translate `term.mp.` -> SC `TITLE-ABS-KEY(term)`', () => {
    expect(gilgit.translate('term.mp.', 'Scopus (advanced search)')).toBe(
      'TITLE-ABS-KEY(term)',
    );
  });

  it('translate `term.mp.` -> WS `term`', () => {
    expect(gilgit.translate('term.mp.', 'Web of Science')).toBe('term');
  });

  it('translate `term.mp` -> HTA `term`', () => {
    expect(gilgit.translate('term.mp.', 'International HTA Database')).toBe(
      'term',
    );
  });

  it('translate `term.mp.` -> PYE `term`', () => {
    expect(gilgit.translate('term.mp.', 'PsycInfo (Ebsco)')).toBe('term');
  });

  it('translate `term.mp.` -> BU `term`', () => {
    expect(gilgit.translate('term.mp.', 'Business Source Ultimate')).toBe(
      'term',
    );
  });
});

describe('Translate title + abstract + other searches, with automated gunk (Ovid MEDLINE -> *)', () => {
  const gunkSuffix =
    ' [mp=title, abstract, original title, name of substance word, subject heading word, keyword heading word, protocol supplementary concept word, rare disease supplementary concept word, unique identifier, synonyms]';

  it('translate `term.mp. [...]` -> PM `term[tw]`', () => {
    expect(
      gilgit.translate(`term.mp.${gunkSuffix}`, 'PubMed abbreviation'),
    ).toBe('term[tw]');
  });

  it('translate `term.mp. [...]` -> OV `term.mp.`', () => {
    expect(gilgit.translate(`term.mp.${gunkSuffix}`, 'Ovid MEDLINE')).toBe(
      'term.mp.',
    );
  });

  it('translate `term.mp. [...]` -> CO `term:ti,ab,kw`', () => {
    expect(gilgit.translate(`term.mp.${gunkSuffix}`, 'Cochrane Library')).toBe(
      'term:ti,ab,kw',
    );
  });

  it('translate `term.mp. [...]` -> EM `term`', () => {
    expect(gilgit.translate(`term.mp.${gunkSuffix}`, 'Embase (Elsevier)')).toBe(
      'term',
    );
  });

  it('translate `term.mp. [...]` -> CI `term`', () => {
    expect(gilgit.translate(`term.mp.${gunkSuffix}`, 'CINAHL (Ebsco)')).toBe(
      'term',
    );
  });

  it('translate `term.mp. [...]` -> PY `term.mp.`', () => {
    expect(gilgit.translate(`term.mp.${gunkSuffix}`, 'PsycInfo (Ovid)')).toBe(
      'term.mp.',
    );
  });

  it('translate `term.mp. [...]` -> SC `TITLE-ABS-KEY(term)`', () => {
    expect(
      gilgit.translate(`term.mp.${gunkSuffix}`, 'Scopus (advanced search)'),
    ).toBe('TITLE-ABS-KEY(term)');
  });

  it('translate `term.mp. [...]` -> WS `term`', () => {
    expect(gilgit.translate(`term.mp.${gunkSuffix}`, 'Web of Science')).toBe(
      'term',
    );
  });

  it('translate `term.mp. [...]` -> HTA `term`', () => {
    expect(
      gilgit.translate(`term.mp.${gunkSuffix}`, 'International HTA Database'),
    ).toBe('term');
  });

  it('translate `term.mp. [...]` -> PYE `term`', () => {
    expect(gilgit.translate(`term.mp.${gunkSuffix}`, 'PsycInfo (Ebsco)')).toBe(
      'term',
    );
  });

  it('translate `term.mp. [...]` -> BU `term`', () => {
    expect(
      gilgit.translate(`term.mp.${gunkSuffix}`, 'Business Source Ultimate'),
    ).toBe('term');
  });
});
