import { describe, expect, it } from 'vitest';
import { createRng } from './rng';

function take(rng: () => number, n: number): number[] {
  return Array.from({ length: n }, () => rng());
}

describe('createRng', () => {
  it('produces the same sequence for the same seed', () => {
    expect(take(createRng('hello'), 20)).toEqual(take(createRng('hello'), 20));
    expect(take(createRng(42), 20)).toEqual(take(createRng(42), 20));
  });

  it('produces different sequences for different seeds', () => {
    expect(take(createRng('hello'), 5)).not.toEqual(take(createRng('hellp'), 5));
    expect(take(createRng(1), 5)).not.toEqual(take(createRng(2), 5));
  });

  it('stays in [0, 1)', () => {
    for (const n of take(createRng('range'), 10_000)) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });

  it('accepts an empty string seed', () => {
    expect(take(createRng(''), 3)).toEqual(take(createRng(''), 3));
  });
});
