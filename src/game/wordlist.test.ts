import { describe, expect, it } from 'vitest';
import { loadEnable } from '../../test/enable';
import { parseWordList } from './wordlist';

describe('parseWordList', () => {
  it('lowercases, trims, and handles Windows line endings', () => {
    expect(parseWordList('Cat\r\n  DOG  \nbird\n')).toEqual(['cat', 'dog', 'bird']);
  });

  it('drops words shorter than 3 letters', () => {
    expect(parseWordList('a\nan\nant')).toEqual(['ant']);
  });

  it('drops words longer than 16 letters', () => {
    expect(parseWordList('abcdefghijklmnop\nabcdefghijklmnopq')).toEqual(['abcdefghijklmnop']);
  });

  it('drops blank lines and words with non a–z characters', () => {
    expect(parseWordList("\ndon't\ncafé\nx-ray\nok3\nfine\n")).toEqual(['fine']);
  });

  it('removes duplicates', () => {
    expect(parseWordList('cat\nCAT\ncat')).toEqual(['cat']);
  });

  it('loads the real ENABLE list', () => {
    const { words } = loadEnable();
    expect(words.length).toBeGreaterThan(170_000);
    expect(words).toContain('quiz');
    expect(words).not.toContain('aa'); // in ENABLE, but too short to play
  });
});
