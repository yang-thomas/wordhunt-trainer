export const MIN_WORD_LENGTH = 3;
/** A 4x4 board can't hold a word longer than its tile count. */
export const MAX_WORD_LENGTH = 16;

const VALID_WORD = new RegExp(`^[a-z]{${MIN_WORD_LENGTH},${MAX_WORD_LENGTH}}$`);

/**
 * Turns raw word-list text (one word per line) into a clean list:
 * lowercased, trimmed, only a–z words of playable length, no duplicates.
 */
export function parseWordList(raw: string): string[] {
  const words = new Set<string>();
  for (const line of raw.split('\n')) {
    const word = line.trim().toLowerCase();
    if (VALID_WORD.test(word)) {
      words.add(word);
    }
  }
  return [...words];
}
