import { neighbors } from './board';
import { findNode, type TrieNode } from './trie';
import type { Board, FoundWord } from './types';
import { MIN_WORD_LENGTH } from './wordlist';

/**
 * Finds every dictionary word on the board. Depth-first search from each
 * tile, walking the trie alongside the path; as soon as the letters so far
 * aren't the start of any word, that whole branch is skipped.
 * Returns one entry per unique word (the first path found for it).
 */
export function solveBoard(board: Board, trie: TrieNode): FoundWord[] {
  const found = new Map<string, number[]>();
  const used = new Array<boolean>(board.length).fill(false);
  const path: number[] = [];

  function visit(index: number, parent: TrieNode, word: string): void {
    const tile = board[index];
    const node = findNode(parent, tile);
    if (!node) {
      return; // no word starts with these letters: prune
    }

    used[index] = true;
    path.push(index);
    const nextWord = word + tile;

    if (node.isWord && nextWord.length >= MIN_WORD_LENGTH && !found.has(nextWord)) {
      found.set(nextWord, [...path]);
    }
    for (const next of neighbors(index)) {
      if (!used[next]) {
        visit(next, node, nextWord);
      }
    }

    path.pop();
    used[index] = false;
  }

  for (let start = 0; start < board.length; start++) {
    visit(start, trie, '');
  }

  return [...found].map(([word, wordPath]) => ({ word, path: wordPath }));
}
