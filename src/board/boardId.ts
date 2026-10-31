import { boardFromLetters, generateBoard, type Board, type TrieNode } from '../game';
import { checkLetters } from './customBoard';

// A board is identified by a single string, the `seed` in the URL:
//   "k3x9q2"                    a random seed; the board is generated from it
//   "custom-abcdefghijklmnop"   a custom board; the 16 letters are right in the id
// Replay, results, and saved games only ever pass this one string around.
// (Phase 3 adds a proper place to store saved boards; until then the id carries everything.)
const CUSTOM_PREFIX = 'custom-';

export function isCustomBoardId(id: string): boolean {
  return id.startsWith(CUSTOM_PREFIX);
}

/** The id for a custom board. `letters` must already have passed checkLetters. */
export function customBoardId(letters: string): string {
  return CUSTOM_PREFIX + letters;
}

/**
 * Turns a board id into a board, or null if it's a custom id with bad letters
 * (the id comes from the URL, so it can be anything).
 */
export function resolveBoard(id: string, trie: TrieNode): Board | null {
  if (isCustomBoardId(id)) {
    const check = checkLetters(id.slice(CUSTOM_PREFIX.length));
    return check.ok ? boardFromLetters(check.letters) : null;
  }
  return generateBoard(id, trie);
}

/** Short name to show on screen. */
export function boardLabel(id: string): string {
  return isCustomBoardId(id) ? 'Custom board' : `Board ${id}`;
}
