import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildTrie, type TrieNode } from '../src/game/trie';
import { parseWordList } from '../src/game/wordlist';

const WORDS_PATH = fileURLToPath(new URL('../data/words.txt', import.meta.url));

let cached: { words: string[]; trie: TrieNode } | undefined;

/** Loads the ENABLE word list and its trie once per test file. */
export function loadEnable(): { words: string[]; trie: TrieNode } {
  if (!cached) {
    const words = parseWordList(readFileSync(WORDS_PATH, 'utf8'));
    cached = { words, trie: buildTrie(words) };
  }
  return cached;
}
