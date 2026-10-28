import { describe, expect, it } from 'vitest';
import { TEST_BOARD, TEST_TRIE } from './fixtures';
import { validatePath, wordFromPath } from './path';

const check = (path: number[]) => validatePath(TEST_BOARD, path, TEST_TRIE);

describe('wordFromPath', () => {
  it('reads letters in path order', () => {
    expect(wordFromPath(TEST_BOARD, [2, 1, 0, 5])).toBe('taco');
  });
});

describe('validatePath', () => {
  it('accepts a straight-line word', () => {
    expect(check([0, 1, 2])).toEqual({ ok: true, word: 'cat' });
  });

  it('accepts a word that uses a diagonal step', () => {
    expect(check([2, 1, 0, 5])).toEqual({ ok: true, word: 'taco' });
  });

  it('accepts a word using two different tiles with the same letter', () => {
    expect(check([6, 7, 10])).toEqual({ ok: true, word: 'gee' });
  });

  it('rejects reusing a tile, even when the letters would spell a word', () => {
    expect(check([6, 7, 7])).toEqual({ ok: false, reason: 'tile-reused' });
    expect(check([2, 1, 2])).toEqual({ ok: false, reason: 'tile-reused' }); // "tat"
  });

  it('rejects non-adjacent steps', () => {
    expect(check([1, 0, 2])).toEqual({ ok: false, reason: 'not-adjacent' }); // "act"
  });

  it('rejects wrapping from the end of one row to the start of the next', () => {
    expect(check([2, 3, 4])).toEqual({ ok: false, reason: 'not-adjacent' });
  });

  it('rejects words shorter than 3 letters, even real ones', () => {
    expect(check([5, 4])).toEqual({ ok: false, reason: 'too-short' }); // "ox"
    expect(check([0])).toEqual({ ok: false, reason: 'too-short' });
    expect(check([])).toEqual({ ok: false, reason: 'too-short' });
  });

  it('rejects indices off the board', () => {
    expect(check([-1, 0, 1])).toEqual({ ok: false, reason: 'out-of-bounds' });
    expect(check([14, 15, 16])).toEqual({ ok: false, reason: 'out-of-bounds' });
    expect(check([0, 1.5, 2])).toEqual({ ok: false, reason: 'out-of-bounds' });
  });

  it('rejects valid paths that do not spell a dictionary word', () => {
    expect(check([4, 5, 9])).toEqual({ ok: false, reason: 'not-a-word' }); // "xox"
    expect(check([0, 1, 5])).toEqual({ ok: false, reason: 'not-a-word' }); // "cao"
  });
});
