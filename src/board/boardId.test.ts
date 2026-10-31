import { describe, expect, it } from 'vitest';
import { loadEnable } from '../../test/enable';
import { boardLabel, customBoardId, isCustomBoardId, resolveBoard } from './boardId';

describe('board ids', () => {
  const { trie } = loadEnable();

  it('builds a custom id that round-trips back to the same board', () => {
    const id = customBoardId('abcdefghijklmnop');
    expect(id).toBe('custom-abcdefghijklmnop');
    expect(resolveBoard(id, trie)).toEqual('abcdefghijklmnop'.split(''));
  });

  it('keeps repeated letters on a custom board', () => {
    expect(resolveBoard(customBoardId('eeeeeeeeeeeeeeee'), trie)).toEqual(Array(16).fill('e'));
  });

  it('generates a random-seed board, the same one every time', () => {
    const first = resolveBoard('apdv4i', trie);
    expect(first).toHaveLength(16);
    expect(resolveBoard('apdv4i', trie)).toEqual(first);
  });

  it('gives random-seed boards different letters for different seeds', () => {
    expect(resolveBoard('apdv4i', trie)).not.toEqual(resolveBoard('n8j9z5', trie));
  });

  it('returns null for a custom id with bad letters, since ids come from the URL', () => {
    expect(resolveBoard('custom-', trie)).toBeNull();
    expect(resolveBoard('custom-abc', trie)).toBeNull();
    expect(resolveBoard('custom-abcdefghijklmno1', trie)).toBeNull();
    expect(resolveBoard('custom-abcdefghijklmnopq', trie)).toBeNull();
  });

  it('tells custom ids from seeds', () => {
    expect(isCustomBoardId('custom-abcdefghijklmnop')).toBe(true);
    expect(isCustomBoardId('apdv4i')).toBe(false);
    expect(isCustomBoardId('abcdefghijklmnop')).toBe(false); // letters alone are just a seed
  });

  it('labels boards for the screen', () => {
    expect(boardLabel('apdv4i')).toBe('Board apdv4i');
    expect(boardLabel('custom-abcdefghijklmnop')).toBe('Custom board');
  });
});
