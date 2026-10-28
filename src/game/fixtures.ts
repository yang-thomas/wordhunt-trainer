import { boardFromLetters } from './board';
import { buildTrie } from './trie';

// A hand-made board and tiny dictionary used by the path and solver tests,
// so expected results can be checked by eye.
//
//  c  a  t  s      0  1  2  3
//  x  o  g  e      4  5  6  7
//  x  x  e  x      8  9 10 11
//  x  x  x  x     12 13 14 15
export const TEST_BOARD = boardFromLetters('cats xoge xxex xxxx');

export const TEST_WORDS = [
  'cat', // 0-1-2
  'cats', // 0-1-2-3
  'taco', // 2-1-0-5: last step is diagonal
  'gee', // 6-7-10: uses both e tiles
  'sex', // 3-7-11
  'act', // a-c is adjacent but c-t is not: unreachable
  'tot', // needs the single t twice: unreachable
  'ox', // real word, but under 3 letters
  'zebra', // no z on the board
];

export const TEST_TRIE = buildTrie(TEST_WORDS);
