import { describe, expect, it } from 'vitest';
import { checkLetters } from './customBoard';

describe('checkLetters', () => {
  it('accepts exactly 16 letters', () => {
    expect(checkLetters('abcdefghijklmnop')).toEqual({ ok: true, letters: 'abcdefghijklmnop' });
  });

  it('lowercases the letters', () => {
    expect(checkLetters('ABCDEFGHIJKLMNOP')).toEqual({ ok: true, letters: 'abcdefghijklmnop' });
  });

  it('ignores spaces and line breaks, so a pasted grid works', () => {
    expect(checkLetters('ABCD efgh\nijkl\r\nmnop')).toEqual({ ok: true, letters: 'abcdefghijklmnop' });
  });

  it('allows the same letter many times', () => {
    expect(checkLetters('eeeeeeeeeeeeeeee')).toEqual({ ok: true, letters: 'eeeeeeeeeeeeeeee' });
  });

  it('asks for letters when empty or only whitespace', () => {
    expect(checkLetters('')).toMatchObject({ ok: false });
    expect(checkLetters('   \n ')).toMatchObject({ ok: false });
  });

  it('says how many letters are missing', () => {
    expect(checkLetters('abcde')).toEqual({ ok: false, message: '5 of 16 letters. 11 more to go.' });
    expect(checkLetters('abcdefghijklmno')).toEqual({ ok: false, message: '15 of 16 letters. 1 more to go.' });
  });

  it('says how many letters to remove', () => {
    expect(checkLetters('abcdefghijklmnopq')).toEqual({ ok: false, message: '17 letters. Remove 1.' });
  });

  it('names the characters that are not allowed, each once', () => {
    expect(checkLetters('abc1def1!ghijklmnop')).toEqual({
      ok: false,
      message: 'Only the letters A–Z are allowed. Remove: 1 !',
    });
  });

  it('rejects accented letters and emoji', () => {
    expect(checkLetters('abcdefghijklmnoé')).toMatchObject({ ok: false });
    expect(checkLetters('abcdefghijklmno😀')).toEqual({
      ok: false,
      message: 'Only the letters A–Z are allowed. Remove: 😀',
    });
  });

  it('reports bad characters before the length', () => {
    expect(checkLetters('1')).toMatchObject({ message: expect.stringContaining('Only the letters') });
  });
});
