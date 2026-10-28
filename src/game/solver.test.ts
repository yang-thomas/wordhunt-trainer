import { describe, expect, it } from 'vitest';
import { loadEnable } from '../../test/enable';
import { boardFromLetters } from './board';
import { TEST_BOARD, TEST_TRIE } from './fixtures';
import { generateBoard } from './generate';
import { validatePath } from './path';
import { solveBoard } from './solver';
import { buildTrie } from './trie';

const words = (found: { word: string }[]) => found.map((f) => f.word).sort();

describe('solveBoard', () => {
  const found = solveBoard(TEST_BOARD, TEST_TRIE);

  it('finds exactly the reachable dictionary words', () => {
    expect(words(found)).toEqual(['cat', 'cats', 'gee', 'sex', 'taco']);
  });

  it('finds words that need a diagonal step', () => {
    expect(words(found)).toContain('taco');
  });

  it('finds words that use two tiles with the same letter', () => {
    expect(words(found)).toContain('gee');
  });

  it('does not find words that would reuse a tile', () => {
    expect(words(found)).not.toContain('tot');
  });

  it('does not find words with non-adjacent letters', () => {
    expect(words(found)).not.toContain('act');
  });

  it('skips words under 3 letters', () => {
    expect(words(found)).not.toContain('ox');
  });

  it('returns a path for each word that passes validatePath', () => {
    for (const { word, path } of found) {
      expect(validatePath(TEST_BOARD, path, TEST_TRIE)).toEqual({ ok: true, word });
    }
  });

  it('lists each word once even when it can be traced several ways', () => {
    // "eee" can be traced many ways on an all-e board
    const all = solveBoard(boardFromLetters('e'.repeat(16)), buildTrie(['eee']));
    expect(all).toHaveLength(1);
  });

  it('finds a word that uses every tile', () => {
    // Snake through the board: row 0 left→right, row 1 right→left, ...
    const board = boardFromLetters('abcd hgfe ijkl ponm');
    expect(words(solveBoard(board, buildTrie(['abcdefghijklmnop'])))).toEqual(['abcdefghijklmnop']);
  });

  it('returns nothing for an empty dictionary', () => {
    expect(solveBoard(TEST_BOARD, buildTrie([]))).toEqual([]);
  });

  it('solves real boards with ENABLE, and every result is valid', () => {
    const { trie } = loadEnable();
    const board = generateBoard('solver-check', trie);
    for (const { word, path } of solveBoard(board, trie)) {
      expect(validatePath(board, path, trie)).toEqual({ ok: true, word });
    }
  });

  it('solves a board in under 5 ms (median of 100 boards)', () => {
    const { trie } = loadEnable();
    const boards = Array.from({ length: 100 }, (_, i) => generateBoard(`perf-${i}`, trie, { minWords: 0 }));
    solveBoard(boards[0], trie); // warm up the JIT

    const times = boards.map((board) => {
      const start = performance.now();
      solveBoard(board, trie);
      return performance.now() - start;
    });
    times.sort((a, b) => a - b);
    const median = times[50];
    console.log(`solveBoard median ${median.toFixed(3)} ms, max ${times[99].toFixed(3)} ms`);
    expect(median).toBeLessThan(5);
  });
});
