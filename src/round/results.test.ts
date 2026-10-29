import { describe, expect, it } from 'vitest';
import { boardFromLetters } from '../game';
import { TEST_BOARD, TEST_TRIE } from '../game/fixtures';
import { buildResults, parseFoundParam } from './results';

// On the test board the reachable words are: cat, cats, gee, sex, taco

describe('parseFoundParam', () => {
  it('splits a comma-separated list', () => {
    expect(parseFoundParam('cat,dog,bird')).toEqual(['cat', 'dog', 'bird']);
  });

  it('returns an empty list for a missing or empty parameter', () => {
    expect(parseFoundParam(undefined)).toEqual([]);
    expect(parseFoundParam('')).toEqual([]);
  });

  it('lowercases, trims, and drops blanks', () => {
    expect(parseFoundParam(' CAT ,,Dog,')).toEqual(['cat', 'dog']);
  });
});

describe('buildResults', () => {
  it('lists every word on the board, with found words marked', () => {
    const results = buildResults(TEST_BOARD, TEST_TRIE, ['cat', 'gee']);
    const all = results.groups.flatMap((g) => g.words);
    expect(all.map((w) => w.word).sort()).toEqual(['cat', 'cats', 'gee', 'sex', 'taco']);
    expect(all.filter((w) => w.found).map((w) => w.word).sort()).toEqual(['cat', 'gee']);
  });

  it('groups by length, longest first, alphabetical within a length', () => {
    const { groups } = buildResults(TEST_BOARD, TEST_TRIE, []);
    expect(groups.map((g) => g.length)).toEqual([4, 3]);
    expect(groups[0].words.map((w) => w.word)).toEqual(['cats', 'taco']);
    expect(groups[1].words.map((w) => w.word)).toEqual(['cat', 'gee', 'sex']);
  });

  it('counts found words per group', () => {
    const { groups } = buildResults(TEST_BOARD, TEST_TRIE, ['cat', 'gee', 'taco']);
    expect(groups.map((g) => g.foundCount)).toEqual([1, 2]);
  });

  it('scores the found words and the whole board', () => {
    const results = buildResults(TEST_BOARD, TEST_TRIE, ['cat', 'taco']);
    expect(results.score).toBe(100 + 400);
    expect(results.maxScore).toBe(100 + 400 + 100 + 100 + 400); // cat, cats, gee, sex, taco
    expect(results.foundCount).toBe(2);
    expect(results.totalCount).toBe(5);
  });

  it('keeps found words in the order they were found', () => {
    const results = buildResults(TEST_BOARD, TEST_TRIE, ['taco', 'cat', 'gee']);
    expect(results.foundWords.map((w) => w.word)).toEqual(['taco', 'cat', 'gee']);
  });

  it('handles a round where nothing was found', () => {
    const results = buildResults(TEST_BOARD, TEST_TRIE, []);
    expect(results.score).toBe(0);
    expect(results.foundCount).toBe(0);
    expect(results.foundWords).toEqual([]);
    expect(results.totalCount).toBe(5);
  });

  it('ignores words that are not on the board, so the score cannot be faked', () => {
    const results = buildResults(TEST_BOARD, TEST_TRIE, ['cat', 'zebra', 'tot', 'ox']);
    expect(results.foundWords.map((w) => w.word)).toEqual(['cat']);
    expect(results.score).toBe(100);
  });

  it('counts a word listed twice once', () => {
    const results = buildResults(TEST_BOARD, TEST_TRIE, ['cat', 'cat']);
    expect(results.foundCount).toBe(1);
    expect(results.score).toBe(100);
  });

  it('handles a board with no words', () => {
    const results = buildResults(boardFromLetters('x'.repeat(16)), TEST_TRIE, ['cat']);
    expect(results).toMatchObject({ score: 0, maxScore: 0, foundCount: 0, totalCount: 0, groups: [] });
  });
});
