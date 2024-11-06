import { expect, describe, it } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate search phrases (PubMed -> *)', () => {
  it('translate `"term1 term2"` -> PM `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'PubMed abbreviation')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> OV `term1 term2`', () => {
    expect(gilgit.translate('"term1 term2"', 'Ovid MEDLINE')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> CO `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Cochrane Library')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> EM `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Embase (Elsevier)')).toBe(
      "'term1 term2'",
    );
  });

  it('translate `"term1 term2"` -> CI `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'CINAHL (Ebsco)')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> PY `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'PsycInfo (Ovid)')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> SC `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Scopus (advanced search)')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> WS `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Web of Science')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> HTA `"term1 term2"`', () => {
    expect(
      gilgit.translate('"term1 term2"', 'International HTA Database'),
    ).toBe('"term1 term2"');
  });

  it('translate `"term1 term2"` -> PYE `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'PsycInfo (Ebsco)')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> BU `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Business Source Ultimate')).toBe(
      '"term1 term2"',
    );
  });
});

describe('Translate search phrases (Ovid MEDLINE -> *)', () => {
  it('translate `"term1 term2"` -> PM `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'PubMed abbreviation')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> OV `term1 term2`', () => {
    expect(gilgit.translate('"term1 term2"', 'Ovid MEDLINE')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> CO `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Cochrane Library')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> EM `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Embase (Elsevier)')).toBe(
      "'term1 term2'",
    );
  });

  it('translate `"term1 term2"` -> CI `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'CINAHL (Ebsco)')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> PY `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'PsycInfo (Ovid)')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> SC `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Scopus (advanced search)')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> WS `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Web of Science')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> HTA `"term1 term2"`', () => {
    expect(
      gilgit.translate('"term1 term2"', 'International HTA Database'),
    ).toBe('"term1 term2"');
  });

  it('translate `"term1 term2"` -> PYE `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'PsycInfo (Ebsco)')).toBe(
      '"term1 term2"',
    );
  });

  it('translate `"term1 term2"` -> BU `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'Business Source Ultimate')).toBe(
      '"term1 term2"',
    );
  });
});
