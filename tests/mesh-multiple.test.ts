import { expect, describe, it } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate multiple MESH terms (PubMed -> *)', () => {
  it('translate `"term1 term2"[Mesh]` -> PM `"term1 term2"[Mesh]`', () => {
    expect(gilgit.translate('"term1 term2"[Mesh]', 'PubMed abbreviation')).toBe(
      '"term1 term2"[Mesh]',
    );
    expect(
      gilgit.translate('"term1 and term2"[Mesh]', 'PubMed abbreviation'),
    ).toBe('"term1 and term2"[Mesh]');
  });

  it('translate `"term1 term2"[Mesh]` -> OV `exp term1 term2/`', () => {
    expect(gilgit.translate('"term1 term2"[Mesh]', 'Ovid MEDLINE')).toBe(
      'exp "term1 term2"/',
    );
    expect(gilgit.translate('"term1 and term2"[Mesh]', 'Ovid MEDLINE')).toBe(
      'exp "term1 and term2"/',
    );
  });

  // ... rest of the test cases with .to.equal() changed to .toBe()
});

describe('Translate multiple MESH terms (PubMed (short) -> *)', () => {
  it('translate `"term1 term2"[mh]` -> PM `"term1 term2"[Mesh]`', () => {
    expect(gilgit.translate('"term1 term2"[mh]', 'PubMed abbreviation')).toBe(
      '"term1 term2"[Mesh]',
    );
    expect(
      gilgit.translate('"term1 and term2"[mh]', 'PubMed abbreviation'),
    ).toBe('"term1 and term2"[Mesh]');
  });

  // ... rest of the test cases with .to.equal() changed to .toBe()
});

describe('Translate multiple MESH terms (PubMed (long) -> *)', () => {
  it('translate `"term1 term2"[MeSH Terms]` -> PM `"term1 term2"[Mesh]`', () => {
    expect(
      gilgit.translate('"term1 term2"[MeSH Terms]', 'PubMed abbreviation'),
    ).toBe('"term1 term2"[Mesh]');
    expect(
      gilgit.translate('"term1 and term2"[MeSH Terms]', 'PubMed abbreviation'),
    ).toBe('"term1 and term2"[Mesh]');
  });

  // ... rest of the test cases with .to.equal() changed to .toBe()
});

describe('Translate multiple MESH terms (Ovid MEDLINE -> *)', () => {
  it('translate `exp term1 term2/` -> PM `"term1 term2"[Mesh]`', () => {
    expect(gilgit.translate('exp term1 term2/', 'PubMed abbreviation')).toBe(
      '"term1 term2"[Mesh]',
    );
    expect(
      gilgit.translate('exp term1 and term2/', 'PubMed abbreviation'),
    ).toBe('"term1 and term2"[Mesh]');
    expect(
      gilgit.translate('exp "term1 and term2"/', 'PubMed abbreviation'),
    ).toBe('"term1 and term2"[Mesh]');
  });

  // ... rest of the test cases with .to.equal() changed to .toBe()
});
