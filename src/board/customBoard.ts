import { TILE_COUNT } from '../game';

export type LettersCheck = { ok: true; letters: string } | { ok: false; message: string };

/**
 * Checks what the player typed for a custom board. Whitespace and case are
 * ignored, so "ABCD efgh ..." and a pasted multi-line grid both work.
 * On failure, `message` says what to fix.
 */
export function checkLetters(input: string): LettersCheck {
  const cleaned = input.replace(/\s+/g, '').toLowerCase();
  if (cleaned.length === 0) {
    return { ok: false, message: `Type the ${TILE_COUNT} letters, row by row.` };
  }

  const invalid = [...new Set(cleaned.match(/[^a-z]/gu) ?? [])];
  if (invalid.length > 0) {
    return { ok: false, message: `Only the letters A–Z are allowed. Remove: ${invalid.join(' ')}` };
  }
  if (cleaned.length < TILE_COUNT) {
    const missing = TILE_COUNT - cleaned.length;
    return { ok: false, message: `${cleaned.length} of ${TILE_COUNT} letters. ${missing} more to go.` };
  }
  if (cleaned.length > TILE_COUNT) {
    const extra = cleaned.length - TILE_COUNT;
    return { ok: false, message: `${cleaned.length} letters. Remove ${extra}.` };
  }
  return { ok: true, letters: cleaned };
}
