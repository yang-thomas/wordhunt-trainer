import { TILE_COUNT, isAdjacent } from './board';
import { isWord, type TrieNode } from './trie';
import type { Board, Path } from './types';
import { MIN_WORD_LENGTH } from './wordlist';

export type PathResult =
  | { ok: true; word: string }
  | { ok: false; reason: 'too-short' | 'out-of-bounds' | 'not-adjacent' | 'tile-reused' | 'not-a-word' };

/** Reads the letters along a path. Assumes every index is on the board. */
export function wordFromPath(board: Board, path: Path): string {
  return path.map((index) => board[index]).join('');
}

/** Checks a swiped path: tiles on the board, each one touching the last, none reused, spelling a real word. */
export function validatePath(board: Board, path: Path, trie: TrieNode): PathResult {
  if (path.some((index) => !Number.isInteger(index) || index < 0 || index >= TILE_COUNT)) {
    return { ok: false, reason: 'out-of-bounds' };
  }
  if (new Set(path).size !== path.length) {
    return { ok: false, reason: 'tile-reused' };
  }
  for (let i = 1; i < path.length; i++) {
    if (!isAdjacent(path[i - 1], path[i])) {
      return { ok: false, reason: 'not-adjacent' };
    }
  }
  const word = wordFromPath(board, path);
  if (word.length < MIN_WORD_LENGTH) {
    return { ok: false, reason: 'too-short' };
  }
  if (!isWord(trie, word)) {
    return { ok: false, reason: 'not-a-word' };
  }
  return { ok: true, word };
}
