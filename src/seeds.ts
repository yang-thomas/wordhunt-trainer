const SEED_CHARS = 'abcdefghijkmnpqrstuvwxyz23456789'; // no l/1/o/0, so seeds are easy to read

/** A random seed for a new board. Not seeded itself: every call should differ. */
export function newSeed(length = 6): string {
  let seed = '';
  for (let i = 0; i < length; i++) {
    seed += SEED_CHARS[Math.floor(Math.random() * SEED_CHARS.length)];
  }
  return seed;
}
