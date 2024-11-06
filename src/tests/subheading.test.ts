import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Translate subheadings with or without quotes (Ovid -> *)', () => {
  it('translate `"abnormalities".fs.` -> CH `[mh /AB]`', () => {
    expect(gilgit.translate('"abnormalities".fs.', 'Cochrane Library')).toBe(
      '[mh /AB]',
    );
  });

  it('translate `abnormalities.fs.` -> CH `[mh /AB]`', () => {
    expect(gilgit.translate('abnormalities.fs.', 'Cochrane Library')).toBe(
      '[mh /AB]',
    );
  });

  //International HTA Database
  it('translate `abnormalities.fs.` -> HTA `Abnormalities`', () => {
    expect(
      gilgit.translate('abnormalities.fs.', 'International HTA Database'),
    ).toBe('"Abnormalities"');
  });
});

describe('Translate subheadings at end of mesh term (PubMed -> *)', () => {
  it('translate `psoriasis/dt[Majr]` -> PM `psoriasis/dt[Majr]`', () => {
    expect(gilgit.translate('psoriasis/dt[Majr]', 'PubMed abbreviation')).toBe(
      'psoriasis/dt[Majr]',
    );
  });

  it('translate `psoriasis/dt[Majr]` -> OV `exp *psoriasis/dt`', () => {
    expect(gilgit.translate('psoriasis/dt[Majr]', 'Ovid MEDLINE')).toBe(
      'exp *psoriasis/dt',
    );
  });

  //International HTA Database
  it('translate `psoriasis/dt[Majr]` -> HTA `psoriasis/dt[mhe]`', () => {
    expect(
      gilgit.translate('psoriasis/dt[Majr]', 'International HTA Database'),
    ).toBe('psoriasis/dt[mhe]');
  });
});

describe('Translate subheadings at end of mesh term (Ovid -> *)', () => {
  it('translate `exp *psoriasis/dt` -> PM `psoriasis/dt[majr]`', () => {
    expect(gilgit.translate('exp *psoriasis/dt', 'PubMed abbreviation')).toBe(
      'psoriasis/dt[Majr]',
    );
  });

  it('translate `exp *psoriasis/dt` -> OV `exp *psoriasis/dt`', () => {
    expect(gilgit.translate('exp *psoriasis/dt', 'Ovid MEDLINE')).toBe(
      'exp *psoriasis/dt',
    );
  });

  //International HTA Database
  it('translate `exp *psoriasis/dt` -> HTA `psoriasis/dt[mhe]`', () => {
    expect(
      gilgit.translate('exp *psoriasis/dt', 'International HTA Database'),
    ).toBe('psoriasis/dt[mhe]');
  });
});
