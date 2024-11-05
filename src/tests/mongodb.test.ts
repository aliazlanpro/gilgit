import { describe, it, expect } from 'vitest';
import gilgit from '../index.js';

describe.skip('Translate searches (PubMed -> Mongo)', () => {
  const o = {
    forceString: false,
    html: false,
    trim: false,
  };

  it('translate `term[ti]` -> MongoDB', () => {
    expect(gilgit.translate('term[ti]', 'mongodb', o)).toEqual({
      title: 'term',
    });
  });

  it('translate `term1[ti] OR term2[ti]` -> MongoDB', () => {
    expect(gilgit.translate('term1[ti] OR term2[ti]', 'mongodb', o)).toEqual({
      $or: [{ title: 'term1' }, { title: 'term2' }],
    });
  });

  it('translate `term1[ti] OR term2[ti] OR term3[ti]` -> MongoDB', () => {
    expect(
      gilgit.translate('term1[ti] OR term2[ti] OR term3[ti]', 'mongodb', o),
    ).toEqual({
      $or: [{ title: 'term1' }, { title: 'term2' }, { title: 'term3' }],
    });
  });

  it('translate `term1[ti] AND term2[ti] AND term3[ti]` -> MongoDB', () => {
    expect(
      gilgit.translate('term1[ti] AND term2[ti] AND term3[ti]', 'mongodb', o),
    ).toEqual({
      $and: [{ title: 'term1' }, { title: 'term2' }, { title: 'term3' }],
    });
  });

  it('translate `(term1[ti] AND term2[ti]) OR (term3[ti] AND term4[ti])` -> MongoDB', () => {
    expect(
      gilgit.translate(
        '(term1[ti] AND term2[ti]) OR (term3[ti] AND term4[ti])',
        'mongodb',
        o,
      ),
    ).toEqual({
      $or: [
        [{ title: 'term1' }, { title: 'term2' }],
        [{ title: 'term3' }, { title: 'term4' }],
      ],
    });
  });

  it('translate `Common Cold/ OR common cold*.tw. OR head cold*.tw. OR coryza.tw. OR upper respiratory infection*.tw.` -> MongoDB', () => {
    expect(
      gilgit.translate(
        'Common Cold/ OR common cold*.tw. OR head cold*.tw. OR coryza.tw. OR upper respiratory infection*.tw.',
        'mongodb',
        o,
      ),
    ).toEqual({
      $or: [
        [{ title: 'Common Cold' }], // FIXME: This should be a mesh search
        [{ title: 'common cold*' }],
        [{ title: 'head cold*' }],
        [{ title: 'coryza' }],
        [{ title: 'upper respiratory infection*' }],
      ],
    });
  });

  it('translate `(term1[ti] OR term2[ti]) AND (term3[ti] OR term4[ti])` -> MongoDB', () => {
    expect(
      gilgit.translate(
        '(term1[ti] OR term2[ti]) AND (term3[ti] OR term4[ti])',
        'mongodb',
        o,
      ),
    ).toEqual({
      $and: [
        {
          $or: [{ title: 'term1' }, { title: 'term2' }],
        },
        {
          $or: [{ title: 'term3' }, { title: 'term4' }],
        },
      ],
    });
  });
});
