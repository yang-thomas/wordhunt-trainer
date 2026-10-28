import type { Board } from './types';

export const BOARD_SIZE = 4;
export const TILE_COUNT = BOARD_SIZE * BOARD_SIZE;

function computeNeighbors(index: number): number[] {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const result: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr;
      const c = col + dc;
      if ((dr !== 0 || dc !== 0) && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
        result.push(r * BOARD_SIZE + c);
      }
    }
  }
  return result;
}

// Computed once; the solver looks these up constantly.
const NEIGHBORS: readonly (readonly number[])[] = Array.from({ length: TILE_COUNT }, (_, i) =>
  computeNeighbors(i),
);

/** Indices of the up-to-8 tiles touching `index`, diagonals included. */
export function neighbors(index: number): readonly number[] {
  return NEIGHBORS[index] ?? [];
}

export function isAdjacent(a: number, b: number): boolean {
  return neighbors(a).includes(b);
}

/** Builds a custom board from 16 letters, e.g. "abcd efgh ijkl mnop" (whitespace ignored). */
export function boardFromLetters(letters: string): Board {
  const cleaned = letters.replace(/\s+/g, '').toLowerCase();
  if (!/^[a-z]+$/.test(cleaned) || cleaned.length !== TILE_COUNT) {
    throw new Error(`A board needs exactly ${TILE_COUNT} letters a–z, got "${letters}"`);
  }
  return cleaned.split('');
}
