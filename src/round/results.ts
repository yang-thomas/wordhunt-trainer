import { scoreWord, solveBoard, type Board, type TrieNode } from '../game';

export interface ResultWord {
  word: string;
  found: boolean;
  points: number;
}

/** All the words of one length on the board. */
export interface LengthGroup {
  length: number;
  words: ResultWord[];
  foundCount: number;
}

export interface RoundResults {
  score: number;
  /** What a perfect round (every word on the board) would have scored. */
  maxScore: number;
  foundCount: number;
  totalCount: number;
  /** The player's words, in the order they were found. */
  foundWords: ResultWord[];
  /** Every word on the board, grouped by length, longest first. Found words are marked. */
  groups: LengthGroup[];
}

/** Reads the `found` URL parameter ("cat,dog,bird") into a list of words. */
export function parseFoundParam(param: string | undefined): string[] {
  return (param ?? '')
    .split(',')
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 0);
}

/**
 * Solves the board and compares it with the words the player found.
 * Anything in `foundWords` that isn't actually on the board is ignored, so the
 * score is always computed from words that really exist (the list arrives via
 * the URL, which anyone can edit).
 */
export function buildResults(board: Board, trie: TrieNode, foundWords: readonly string[]): RoundResults {
  const foundSet = new Set(foundWords);
  const all: ResultWord[] = solveBoard(board, trie).map(({ word }) => ({
    word,
    found: foundSet.has(word),
    points: scoreWord(word),
  }));
  const byWord = new Map(all.map((entry) => [entry.word, entry]));

  // Longest words first, alphabetical within a length
  all.sort((a, b) => b.word.length - a.word.length || a.word.localeCompare(b.word));
  const groups: LengthGroup[] = [];
  for (const entry of all) {
    let group = groups[groups.length - 1];
    if (!group || group.length !== entry.word.length) {
      group = { length: entry.word.length, words: [], foundCount: 0 };
      groups.push(group);
    }
    group.words.push(entry);
    if (entry.found) {
      group.foundCount++;
    }
  }

  const verifiedFound: ResultWord[] = [];
  for (const word of new Set(foundWords)) {
    const entry = byWord.get(word);
    if (entry) {
      verifiedFound.push(entry);
    }
  }

  return {
    score: verifiedFound.reduce((sum, entry) => sum + entry.points, 0),
    maxScore: all.reduce((sum, entry) => sum + entry.points, 0),
    foundCount: verifiedFound.length,
    totalCount: all.length,
    foundWords: verifiedFound,
    groups,
  };
}
