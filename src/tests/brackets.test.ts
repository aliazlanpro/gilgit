import { expect, describe, it } from 'vitest';
import gilgit from '../index.js';

describe('Dont expand ovid brackets (Ovid -> *)', () => {
  const translation =
    '(( web  OR  online  OR  "on-line"  OR  internet  OR  video  OR  virtual  OR  tele ) adj3 (intervention*  OR  conferenc*  OR  communication  OR  seminar*  OR  information* )).ti,ab.';

  it('translate `Ovid` -> `Ovid`', () => {
    expect(gilgit.translate(translation, 'Ovid MEDLINE')).toBe(
      '((web OR online OR on-line OR internet OR video OR virtual OR tele) ADJ3 (intervention* OR conferenc* OR communication OR seminar* OR information*)).tw.',
    );
  });

  it('translate `Ovid` -> `Scopus`', () => {
    expect(gilgit.translate(translation, 'Scopus (advanced search)')).toBe(
      'TITLE-ABS((web OR online OR on-line OR internet OR video OR virtual OR tele) W/3 (intervention* OR conferenc* OR communication OR seminar* OR information*))',
    );
  });
});
