import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Translate search phrases (with mangled quote marks)', () => {
  it('translate `“term1 term2”` -> PM `"term1 term2"`', () => {
    expect(gilgit.translate('"term1 term2"', 'PubMed abbreviation')).toBe(
      '"term1 term2"',
    );
  });
});
