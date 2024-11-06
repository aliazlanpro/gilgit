import { describe, it, expect } from 'vitest';
import gilgit from '../index.js';

// FIXME: Not currently supported
describe.skip('Line numbers', () => {
  it('should be preserved for all engines', () => {
    const input = '1 Foo AND\n' + '2 Bar AND\n' + '3 Baz OR\n' + '4 Quz';

    const output = input; // Output is the same as input (i.e. no operation or mangling should happen)

    // All engines should act the same so don't bother to break them up into different tests
    expect(gilgit.translate(input, 'PubMed abbreviation')).toBe(output);
    expect(gilgit.translate(input, 'Ovid MEDLINE')).toBe(output);
    expect(gilgit.translate(input, 'Cochrane Library')).toBe(output);
    expect(gilgit.translate(input, 'Embase (Elsevier)')).toBe(output);
    expect(gilgit.translate(input, 'CINAHL (Ebsco)')).toBe(output);
    expect(gilgit.translate(input, 'PsycInfo (Ebsco)')).toBe(output);
    expect(gilgit.translate(input, 'PsycInfo (Ovid)')).toBe(output);
    expect(gilgit.translate(input, 'Scopus (advanced search)')).toBe(output);
    expect(gilgit.translate(input, 'Web of Science')).toBe(output);
    expect(gilgit.translate(input, 'Business Source Ultimate')).toBe(output);
  });
});

describe('Translate Line numbers (Ovid MEDLINE -> *)', () => {
  it('translate `OR/1,3` -> HTA `#1 OR #3`', () => {
    expect(gilgit.translate('OR/1,3', 'International HTA Database')).toBe(
      '#1 OR #3',
    );
  });
});

describe('Line expression expansion', () => {
  const input =
    '1 Foo AND\n' + '2 Bar AND\n' + '3 Baz OR\n' + '4 Quz\n' + '5 OR/1-4';

  it('translate line expansion format -> PM', () => {
    expect(gilgit.translate(input, 'PubMed abbreviation')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        '#1 OR #2 OR #3 OR #4',
    );
  });

  it('translate line expansion format -> OV', () => {
    expect(gilgit.translate(input, 'Ovid MEDLINE')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        '1 OR 2 OR 3 OR 4',
    );
  });

  it('translate line expansion format -> CO', () => {
    expect(gilgit.translate(input, 'Cochrane Library')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        '#1 OR #2 OR #3 OR #4',
    );
  });

  it('translate line expansion format -> EM', () => {
    expect(gilgit.translate(input, 'Embase (Elsevier)')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        '#1 OR #2 OR #3 OR #4',
    );
  });

  it('translate line expansion format -> CI', () => {
    expect(gilgit.translate(input, 'CINAHL (Ebsco)')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        'S1 OR S2 OR S3 OR S4',
    );
  });

  it('translate line expansion format -> PY', () => {
    expect(gilgit.translate(input, 'PsycInfo (Ovid)')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        '1 OR 2 OR 3 OR 4',
    );
  });

  it('translate line expansion format -> SC', () => {
    expect(gilgit.translate(input, 'Scopus (advanced search)')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        '#1 OR #2 OR #3 OR #4',
    );
  });

  it('translate line expansion format -> WS', () => {
    expect(gilgit.translate(input, 'Web of Science')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        '#1 OR #2 OR #3 OR #4',
    );
  });

  it('translate line expansion format -> PYE', () => {
    expect(gilgit.translate(input, 'PsycInfo (Ebsco)')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        'S1 OR S2 OR S3 OR S4',
    );
  });

  it('translate line expansion format -> BU', () => {
    expect(gilgit.translate(input, 'Business Source Ultimate')).toBe(
      'Foo AND<br/>' +
        'Bar AND<br/>' +
        'Baz OR<br/>' +
        'Quz<br/>' +
        'S1 OR S2 OR S3 OR S4',
    );
  });
});
