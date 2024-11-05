import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Translate adjacency searches (ADJ format)', () => {
  it('translate `term1 ADJ3 term2` -> PM `term1 AND term2`', () => {
    expect(gilgit.translate('term1 ADJ3 term2', 'PubMed abbreviation')).toBe(
      'term1 AND term2',
    );
  });

  it('translate `term1 ADJ3 term2` -> OV `term1 ADJ3 term2`', () => {
    expect(gilgit.translate('term1 ADJ3 term2', 'Ovid MEDLINE')).toBe(
      'term1 ADJ3 term2',
    );
  });

  // ... rest of ADJ format tests with .toBe() instead of .to.equal()
});

describe('Translate adjacency searches (NEAR3 format)', () => {
  it('translate `term1 NEAR3 term2` -> PM `term1 AND term2`', () => {
    expect(gilgit.translate('term1 NEAR3 term2', 'PubMed abbreviation')).toBe(
      'term1 AND term2',
    );
  });

  // ... rest of NEAR3 format tests with .toBe() instead of .to.equal()
});

describe('Translate adjacency searches (NEAR/3 format)', () => {
  it('translate `term1 NEAR/3 term2` -> PM `term1 AND term2`', () => {
    expect(gilgit.translate('term1 NEAR/3 term2', 'PubMed abbreviation')).toBe(
      'term1 AND term2',
    );
  });

  // ... rest of NEAR/3 format tests with .toBe() instead of .to.equal()
});

describe('Translate adjacency searches (N3 format)', () => {
  it('translate `term1 N3 term2` -> PM `term1 AND term2`', () => {
    expect(gilgit.translate('term1 N3 term2', 'PubMed abbreviation')).toBe(
      'term1 AND term2',
    );
  });

  // ... rest of N3 format tests with .toBe() instead of .to.equal()
});

describe('Translate edge case adjacency fields Cinahl', () => {
  it('translate `title`', () => {
    expect(gilgit.translate('(term1 adj3 term2).ti.', 'CINAHL (Ebsco)')).toBe(
      '((TI term1) N3 (TI term2))',
    );
  });

  // ... rest of Cinahl tests with .toBe() instead of .to.equal()
});

describe('Translate Ovid MEDLINE adjacency fields to HTA', () => {
  it('translate `title`', () => {
    expect(
      gilgit.translate('(term1 adj3 term2).ti.', 'International HTA Database'),
    ).toBe('((term1)[title] AND (term2)[title])');
  });

  // ... rest of HTA tests with .toBe() instead of .to.equal()
});

describe('Translate edge case adjacency fields PsycInfo', () => {
  it('translate `title`', () => {
    expect(gilgit.translate('(term1 adj3 term2).ti.', 'PsycInfo (Ebsco)')).toBe(
      '((TI term1) N3 (TI term2))',
    );
  });

  // ... rest of PsycInfo tests with .toBe() instead of .to.equal()
});

describe('Translate edge case adjacency fields Business', () => {
  it('translate `title`', () => {
    expect(
      gilgit.translate('(term1 adj3 term2).ti.', 'Business Source Ultimate'),
    ).toBe('((TI term1) N3 (TI term2))');
  });

  // ... rest of Business tests with .toBe() instead of .to.equal()
});
