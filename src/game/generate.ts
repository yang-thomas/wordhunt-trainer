import { TILE_COUNT } from './board';
import { createRng, type Rng } from './rng';
import { solveBoard } from './solver';
import type { TrieNode } from './trie';
import type { Board } from './types';

// Roughly English letter frequency, so random boards have enough vowels and
// common consonants. Rare letters get the minimum weight.
const LETTER_WEIGHTS: Record<string, number> = {
  e: 12, a: 9, t: 9, i: 8, o: 8, n: 7, s: 7, r: 7, l: 5, h: 4,
  d: 4, u: 4, c: 3, m: 3, p: 3, g: 3, f: 2, w: 2, y: 2, b: 2,
  v: 1, k: 1, x: 1, j: 1, q: 1, z: 1,
};
const LETTERS = Object.keys(LETTER_WEIGHTS);
const TOTAL_WEIGHT = LETTERS.reduce((sum, letter) => sum + LETTER_WEIGHTS[letter], 0);

function randomLetter(rng: Rng): string {
  let roll = rng() * TOTAL_WEIGHT;
  for (const letter of LETTERS) {
    roll -= LETTER_WEIGHTS[letter];
    if (roll < 0) {
      return letter;
    }
  }
  return LETTERS[LETTERS.length - 1];
}

export interface GenerateOptions {
  /** Reject boards with fewer valid words than this. */
  minWords?: number;
  /** Give up (throw) after this many rejected boards. */
  maxAttempts?: number;
}

export const DEFAULT_MIN_WORDS = 50;

/**
 * Generates a board from a seed. Rejected boards keep drawing from the same
 * seeded RNG, so the same seed always lands on the same final board.
 */
export function generateBoard(
  seed: string | number,
  trie: TrieNode,
  { minWords = DEFAULT_MIN_WORDS, maxAttempts = 1000 }: GenerateOptions = {},
): Board {
  const rng = createRng(seed);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const board = Array.from({ length: TILE_COUNT }, () => randomLetter(rng));
    if (solveBoard(board, trie).length >= minWords) {
      return board;
    }
  }
  throw new Error(`No board with ${minWords}+ words after ${maxAttempts} attempts (seed ${seed})`);
}
