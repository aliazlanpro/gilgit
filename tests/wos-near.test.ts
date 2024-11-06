import { expect, describe, it } from 'vitest';
import gilgit from '../src/index.js';

describe('Translate adj3 to WOS (Ovid -> *)', () => {
  it('translate `(muscle$ adj3 resist$).ti,ab.` -> WoS `TI=(muscle? NEAR/3 resist?) OR AB=(muscle? NEAR/3 resist?)`', () => {
    expect(
      gilgit.translate('(muscle$ adj3 resist$).ti,ab.', 'WoS Advanced'),
    ).toBe('(TI=(muscle? NEAR/3 resist?) OR AB=(muscle? NEAR/3 resist?))');
  });

  it('translate `((muscle or muscles) adj3 (resist or resists)).ti,ab.` -> WoS `(TI=((muscle OR muscles) NEAR/3 (resist OR resists)) OR AB=((muscle OR muscles) NEAR/3 (resist OR resists)))`', () => {
    expect(
      gilgit.translate(
        '((muscle or muscles) adj3 (resist or resists)).ti,ab.',
        'WoS Advanced',
      ),
    ).toBe(
      '(TI=((muscle OR muscles) NEAR/3 (resist OR resists)) OR AB=((muscle OR muscles) NEAR/3 (resist OR resists)))',
    );
  });
});
