import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Check options', () => {
  it('translate (html=false)', () => {
    expect(
      gilgit.translate('"foo#"\nand\nbar', 'PubMed abbreviation', {
        html: false,
      }),
    ).toBe('foo*\nAND\nbar');
  });
});
