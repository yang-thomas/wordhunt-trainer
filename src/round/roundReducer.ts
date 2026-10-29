import { isWord, MIN_WORD_LENGTH, scoreWord, validatePath, wordFromPath, type Board, type TrieNode } from '../game';
import { nextPath } from './selection';

/** What to tell the player after they release a word. */
export type Feedback =
  | { kind: 'valid'; word: string; points: number }
  | { kind: 'duplicate' | 'not-a-word' | 'too-short'; word: string };

/** How long a round lasts. */
export const ROUND_SECONDS = 90;

export interface RoundState {
  board: Board;
  trie: TrieNode;
  status: 'playing' | 'finished';
  /** Timestamp (ms) when time runs out. Storing the end time, not a countdown, keeps it
   *  correct even when a phone throttles the page's timers in the background. */
  endsAt: number;
  /** The most recent clock reading (ms), updated by 'tick'. */
  now: number;
  /** Tiles selected in the current drag. */
  path: readonly number[];
  /** Words found so far, in the order they were found. */
  found: readonly string[];
  score: number;
  feedback: Feedback | null;
}

export type RoundAction =
  | { type: 'enterTile'; tile: number }
  | { type: 'release' }
  | { type: 'tick'; now: number };

/** `startedAt` is a clock reading in ms (Date.now()). It's a parameter so the reducer stays pure. */
export function createRound(board: Board, trie: TrieNode, startedAt: number): RoundState {
  return {
    board,
    trie,
    status: 'playing',
    endsAt: startedAt + ROUND_SECONDS * 1000,
    now: startedAt,
    path: [],
    found: [],
    score: 0,
    feedback: null,
  };
}

/** Whole seconds left, rounded up so the display reads 0 only once time is really up. */
export function secondsLeft(state: RoundState): number {
  return Math.max(0, Math.ceil((state.endsAt - state.now) / 1000));
}

/** Every change to a round goes through here: (current state, action) → next state. */
export function roundReducer(state: RoundState, action: RoundAction): RoundState {
  if (action.type === 'tick') {
    if (state.status === 'finished') {
      return state;
    }
    if (action.now >= state.endsAt) {
      // Time's up: a word still being dragged is thrown away, not scored
      return { ...state, now: state.endsAt, status: 'finished', path: [], feedback: null };
    }
    return { ...state, now: action.now };
  }
  if (state.status === 'finished') {
    return state;
  }
  switch (action.type) {
    case 'enterTile': {
      const path = nextPath(state.path, action.tile);
      if (path === state.path) {
        return state;
      }
      // Starting a new word clears the feedback from the last one
      const feedback = state.path.length === 0 ? null : state.feedback;
      return { ...state, path, feedback };
    }
    case 'release':
      return submitWord(state);
  }
}

function submitWord(state: RoundState): RoundState {
  const { board, path, trie } = state;
  if (path.length === 0) {
    return state;
  }
  const cleared = { ...state, path: [] };
  if (path.length === 1) {
    return cleared; // a single tap, not a word attempt
  }

  const word = wordFromPath(board, path);
  const result = validatePath(board, path, trie);
  if (!result.ok) {
    // Paths built with nextPath are always adjacent and never reuse a tile,
    // so the only failures left are too-short and not-a-word.
    const kind = result.reason === 'too-short' ? 'too-short' : 'not-a-word';
    return { ...cleared, feedback: { kind, word } };
  }
  if (state.found.includes(word)) {
    return { ...cleared, feedback: { kind: 'duplicate', word } };
  }

  const points = scoreWord(word);
  return {
    ...cleared,
    found: [...state.found, word],
    score: state.score + points,
    feedback: { kind: 'valid', word, points },
  };
}

export type WordStatus = 'valid' | 'duplicate' | 'none';

/** Live status of the word being dragged, for coloring the tiles before release. */
export function currentWordStatus(state: RoundState): WordStatus {
  if (state.path.length < MIN_WORD_LENGTH) {
    return 'none';
  }
  const word = wordFromPath(state.board, state.path);
  if (!isWord(state.trie, word)) {
    return 'none';
  }
  return state.found.includes(word) ? 'duplicate' : 'valid';
}
