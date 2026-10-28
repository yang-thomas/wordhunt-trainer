import { describe, expect, it } from 'vitest';
import { boardFromLetters, isAdjacent, neighbors } from './board';

// Index layout:
//  0  1  2  3
//  4  5  6  7
//  8  9 10 11
// 12 13 14 15

describe('neighbors', () => {
  it('gives a corner 3 neighbors', () => {
    expect([...neighbors(0)].sort((a, b) => a - b)).toEqual([1, 4, 5]);
    expect([...neighbors(15)].sort((a, b) => a - b)).toEqual([10, 11, 14]);
  });

  it('gives an edge tile 5 neighbors', () => {
    expect([...neighbors(1)].sort((a, b) => a - b)).toEqual([0, 2, 4, 5, 6]);
  });

  it('gives a middle tile 8 neighbors, including diagonals', () => {
    expect([...neighbors(5)].sort((a, b) => a - b)).toEqual([0, 1, 2, 4, 6, 8, 9, 10]);
  });

  it('does not wrap around row ends', () => {
    expect(neighbors(3)).not.toContain(4);
    expect(neighbors(4)).not.toContain(3);
    expect(neighbors(7)).not.toContain(8);
  });

  it('is symmetric', () => {
    for (let a = 0; a < 16; a++) {
      for (const b of neighbors(a)) {
        expect(neighbors(b)).toContain(a);
      }
    }
  });

  it('returns nothing for an off-board index', () => {
    expect(neighbors(-1)).toEqual([]);
    expect(neighbors(16)).toEqual([]);
  });
});

describe('isAdjacent', () => {
  it('accepts straight and diagonal steps', () => {
    expect(isAdjacent(5, 6)).toBe(true);
    expect(isAdjacent(5, 9)).toBe(true);
    expect(isAdjacent(5, 10)).toBe(true);
    expect(isAdjacent(5, 0)).toBe(true);
  });

  it('rejects far tiles and the tile itself', () => {
    expect(isAdjacent(0, 2)).toBe(false);
    expect(isAdjacent(0, 10)).toBe(false);
    expect(isAdjacent(5, 5)).toBe(false);
  });
});

describe('boardFromLetters', () => {
  it('builds a 16-tile board, ignoring whitespace and case', () => {
    expect(boardFromLetters('ABCD efgh ijkl mnop')).toEqual('abcdefghijklmnop'.split(''));
  });

  it('allows repeated letters', () => {
    expect(boardFromLetters('eeeeeeeeeeeeeeee')).toHaveLength(16);
  });

  it('rejects the wrong number of letters', () => {
    expect(() => boardFromLetters('abc')).toThrow();
    expect(() => boardFromLetters('abcdefghijklmnopq')).toThrow();
    expect(() => boardFromLetters('')).toThrow();
  });

  it('rejects non-letters', () => {
    expect(() => boardFromLetters('abcdefghijklmno1')).toThrow();
  });
});
