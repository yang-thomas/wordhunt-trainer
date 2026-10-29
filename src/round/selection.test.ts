import { describe, expect, it } from 'vitest';
import { nextPath } from './selection';

// Index layout:
//  0  1  2  3
//  4  5  6  7
//  8  9 10 11
// 12 13 14 15

describe('nextPath', () => {
  it('starts a path on the first tile', () => {
    expect(nextPath([], 5)).toEqual([5]);
  });

  it('adds an adjacent tile, including diagonals', () => {
    expect(nextPath([5], 6)).toEqual([5, 6]);
    expect(nextPath([5], 10)).toEqual([5, 10]);
    expect(nextPath([5], 0)).toEqual([5, 0]);
  });

  it('ignores a tile that is not adjacent', () => {
    expect(nextPath([0], 2)).toEqual([0]);
    expect(nextPath([3], 4)).toEqual([3]); // no wrapping across rows
  });

  it('undoes the last step when moving back onto the previous tile', () => {
    expect(nextPath([0, 1, 2], 1)).toEqual([0, 1]);
    expect(nextPath([0, 1], 0)).toEqual([0]);
  });

  it('can undo all the way back to the first tile', () => {
    let path = nextPath(nextPath(nextPath([], 0), 1), 2);
    path = nextPath(path, 1);
    path = nextPath(path, 0);
    expect(path).toEqual([0]);
  });

  it('ignores staying on the same tile', () => {
    expect(nextPath([0, 1], 1)).toEqual([0, 1]);
    expect(nextPath([0], 0)).toEqual([0]);
  });

  it('ignores a used tile that is not the previous one', () => {
    // 0 → 1 → 5 → 4, then back onto 0 (adjacent to 4 but already used)
    expect(nextPath([0, 1, 5, 4], 0)).toEqual([0, 1, 5, 4]);
  });

  it('returns the same array when nothing changes', () => {
    const path = [0, 1];
    expect(nextPath(path, 15)).toBe(path);
  });
});
