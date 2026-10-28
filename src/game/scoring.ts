import { MIN_WORD_LENGTH } from './wordlist';

/** 100 × (length − 2)²: 3 → 100, 4 → 400, 5 → 900, 6 → 1600. Too-short words score 0. */
export function scoreWord(word: string): number {
  if (word.length < MIN_WORD_LENGTH) {
    return 0;
  }
  return 100 * (word.length - 2) ** 2;
}

/** Total score for a round. A word found twice only counts once. */
export function scoreWords(words: readonly string[]): number {
  let total = 0;
  for (const word of new Set(words.map((w) => w.toLowerCase()))) {
    total += scoreWord(word);
  }
  return total;
}
