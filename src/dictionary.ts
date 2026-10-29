import { WORDS_TEXT } from './data/words.generated';
import { buildTrie, parseWordList, type TrieNode } from './game';

let trie: TrieNode | undefined;

/** The ENABLE trie, built the first time it's needed and reused after that. */
export function getTrie(): TrieNode {
  if (!trie) {
    trie = buildTrie(parseWordList(WORDS_TEXT));
  }
  return trie;
}
