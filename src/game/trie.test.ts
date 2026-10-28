import { describe, expect, it } from 'vitest';
import { buildTrie, findNode, isWord } from './trie';

describe('trie', () => {
  const trie = buildTrie(['cat', 'cats', 'car', 'dog']);

  it('finds inserted words', () => {
    expect(isWord(trie, 'cat')).toBe(true);
    expect(isWord(trie, 'cats')).toBe(true);
    expect(isWord(trie, 'car')).toBe(true);
    expect(isWord(trie, 'dog')).toBe(true);
  });

  it('does not treat a prefix as a word', () => {
    expect(isWord(trie, 'ca')).toBe(false);
    expect(isWord(trie, 'do')).toBe(false);
  });

  it('rejects words that were never inserted', () => {
    expect(isWord(trie, 'cow')).toBe(false);
    expect(isWord(trie, 'catsup')).toBe(false);
    expect(isWord(trie, '')).toBe(false);
  });

  it('findNode returns a node for any valid prefix', () => {
    expect(findNode(trie, 'ca')).toBeDefined();
    expect(findNode(trie, 'ca')?.children.size).toBe(2); // t, r
  });

  it('findNode returns undefined when nothing starts with the prefix', () => {
    expect(findNode(trie, 'x')).toBeUndefined();
    expect(findNode(trie, 'cab')).toBeUndefined();
  });

  it('findNode with an empty prefix returns the root', () => {
    expect(findNode(trie, '')).toBe(trie);
  });

  it('shares nodes between words with a common prefix', () => {
    expect(trie.children.size).toBe(2); // c, d
  });

  it('handles duplicate words', () => {
    const dupes = buildTrie(['cat', 'cat']);
    expect(isWord(dupes, 'cat')).toBe(true);
    expect(dupes.children.size).toBe(1);
  });
});
