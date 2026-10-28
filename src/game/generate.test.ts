import { describe, expect, it } from 'vitest';
import { loadEnable } from '../../test/enable';
import { DEFAULT_MIN_WORDS, generateBoard } from './generate';
import { solveBoard } from './solver';
import { buildTrie } from './trie';

describe('generateBoard', () => {
  const { trie } = loadEnable();

  it('returns 16 lowercase letters', () => {
    const board = generateBoard('shape', trie);
    expect(board).toHaveLength(16);
    for (const tile of board) {
      expect(tile).toMatch(/^[a-z]$/);
    }
  });

  it('gives the same board for the same seed', () => {
    expect(generateBoard('replay-me', trie)).toEqual(generateBoard('replay-me', trie));
    expect(generateBoard(1234, trie)).toEqual(generateBoard(1234, trie));
  });

  it('gives different boards for different seeds', () => {
    expect(generateBoard('seed-a', trie)).not.toEqual(generateBoard('seed-b', trie));
  });

  it(`only returns boards with at least ${DEFAULT_MIN_WORDS} words`, () => {
    for (let i = 0; i < 20; i++) {
      const board = generateBoard(`playable-${i}`, trie);
      expect(solveBoard(board, trie).length).toBeGreaterThanOrEqual(DEFAULT_MIN_WORDS);
    }
  });

  it('respects a custom minWords', () => {
    const board = generateBoard('picky', trie, { minWords: 150 });
    expect(solveBoard(board, trie).length).toBeGreaterThanOrEqual(150);
  });

  it('throws when no board can meet the minimum', () => {
    expect(() => generateBoard('hopeless', buildTrie(['zzz']), { maxAttempts: 5 })).toThrow();
  });
});
