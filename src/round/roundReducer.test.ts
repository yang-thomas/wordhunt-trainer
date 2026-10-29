import { describe, expect, it } from 'vitest';
import { TEST_BOARD, TEST_TRIE } from '../game/fixtures';
import { createRound, currentWordStatus, roundReducer, type RoundAction, type RoundState } from './roundReducer';

//  c  a  t  s      0  1  2  3
//  x  o  g  e      4  5  6  7
//  x  x  e  x      8  9 10 11
//  x  x  x  x     12 13 14 15
// Words: cat, cats, taco, gee, sex (plus unreachable ones)

const start = () => createRound(TEST_BOARD, TEST_TRIE);

function run(state: RoundState, ...actions: RoundAction[]): RoundState {
  return actions.reduce(roundReducer, state);
}

/** Drag across the given tiles, then release. */
function drag(state: RoundState, tiles: number[]): RoundState {
  return run(state, ...tiles.map((tile): RoundAction => ({ type: 'enterTile', tile })), { type: 'release' });
}

describe('roundReducer', () => {
  it('starts empty', () => {
    expect(start()).toMatchObject({ path: [], found: [], score: 0, feedback: null });
  });

  it('builds a path while dragging, using the selection rules', () => {
    const state = run(start(), { type: 'enterTile', tile: 0 }, { type: 'enterTile', tile: 1 }, { type: 'enterTile', tile: 2 });
    expect(state.path).toEqual([0, 1, 2]);
  });

  it('scores a valid word on release and clears the path', () => {
    const state = drag(start(), [0, 1, 2]);
    expect(state.path).toEqual([]);
    expect(state.found).toEqual(['cat']);
    expect(state.score).toBe(100);
    expect(state.feedback).toEqual({ kind: 'valid', word: 'cat', points: 100 });
  });

  it('adds up points across words', () => {
    const state = drag(drag(start(), [0, 1, 2]), [0, 1, 2, 3]);
    expect(state.found).toEqual(['cat', 'cats']);
    expect(state.score).toBe(500);
  });

  it('rejects a word already found, without scoring it again', () => {
    const once = drag(start(), [6, 7, 10]); // gee
    const twice = drag(once, [6, 10, 7]); // gee again, different e tiles
    expect(twice.found).toEqual(['gee']);
    expect(twice.score).toBe(100);
    expect(twice.feedback).toEqual({ kind: 'duplicate', word: 'gee' });
  });

  it('rejects a word that is not in the dictionary', () => {
    const state = drag(start(), [0, 1, 5]); // cao
    expect(state.found).toEqual([]);
    expect(state.score).toBe(0);
    expect(state.feedback).toEqual({ kind: 'not-a-word', word: 'cao' });
  });

  it('rejects a 2-letter word as too short', () => {
    const state = drag(start(), [5, 4]); // ox
    expect(state.feedback).toEqual({ kind: 'too-short', word: 'ox' });
    expect(state.score).toBe(0);
  });

  it('treats a single tap as nothing', () => {
    const state = drag(start(), [0]);
    expect(state.path).toEqual([]);
    expect(state.feedback).toBeNull();
  });

  it('ignores a release with no tiles selected', () => {
    const state = start();
    expect(roundReducer(state, { type: 'release' })).toBe(state);
  });

  it('keeps feedback visible until the next word starts', () => {
    const scored = drag(start(), [0, 1, 2]);
    const nextStarted = roundReducer(scored, { type: 'enterTile', tile: 6 });
    expect(nextStarted.feedback).toBeNull();
  });

  it('scores the undone path, not the longest one dragged', () => {
    // c-a-t-s, back onto t: submits "cat"
    const state = drag(start(), [0, 1, 2, 3, 2]);
    expect(state.found).toEqual(['cat']);
  });
});

describe('currentWordStatus', () => {
  const dragging = (state: RoundState, tiles: number[]) =>
    run(state, ...tiles.map((tile): RoundAction => ({ type: 'enterTile', tile })));

  it('is valid for a new dictionary word', () => {
    expect(currentWordStatus(dragging(start(), [0, 1, 2]))).toBe('valid');
  });

  it('is duplicate for a word already found', () => {
    expect(currentWordStatus(dragging(drag(start(), [0, 1, 2]), [0, 1, 2]))).toBe('duplicate');
  });

  it('is none for prefixes, non-words, and short words', () => {
    expect(currentWordStatus(dragging(start(), [0, 1]))).toBe('none');
    expect(currentWordStatus(dragging(start(), [0, 1, 5]))).toBe('none');
    expect(currentWordStatus(dragging(start(), [5, 4]))).toBe('none');
    expect(currentWordStatus(start())).toBe('none');
  });
});
