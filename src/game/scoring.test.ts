import { describe, expect, it } from 'vitest';
import { scoreWord, scoreWords } from './scoring';

describe('scoreWord', () => {
  it('follows 100 × (length − 2)²', () => {
    expect(scoreWord('cat')).toBe(100);
    expect(scoreWord('cats')).toBe(400);
    expect(scoreWord('tacos')).toBe(900);
    expect(scoreWord('planet')).toBe(1600);
    expect(scoreWord('abcdefghijklmnop')).toBe(19_600);
  });

  it('scores words under 3 letters as 0', () => {
    expect(scoreWord('ox')).toBe(0);
    expect(scoreWord('a')).toBe(0);
    expect(scoreWord('')).toBe(0);
  });
});

describe('scoreWords', () => {
  it('adds up a list', () => {
    expect(scoreWords(['cat', 'cats', 'tacos'])).toBe(1400);
  });

  it('counts a repeated word once, ignoring case', () => {
    expect(scoreWords(['cat', 'cat', 'CAT'])).toBe(100);
  });

  it('returns 0 for an empty list', () => {
    expect(scoreWords([])).toBe(0);
  });
});
