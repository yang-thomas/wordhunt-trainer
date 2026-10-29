import { describe, expect, it } from 'vitest';
import { TILE_GAP, tileAt, tileSize } from './hitTest';

// 4 tiles of 100px with 8px gaps: 4 * 100 + 3 * 8 = 424
const BOARD = 424;
const center = (index: number) => {
  const pitch = 100 + TILE_GAP;
  return { x: (index % 4) * pitch + 50, y: Math.floor(index / 4) * pitch + 50 };
};

describe('tileSize', () => {
  it('splits the board into 4 tiles plus 3 gaps', () => {
    expect(tileSize(BOARD)).toBe(100);
  });
});

describe('tileAt', () => {
  it('finds every tile from its center', () => {
    for (let i = 0; i < 16; i++) {
      const { x, y } = center(i);
      expect(tileAt(x, y, BOARD)).toBe(i);
    }
  });

  it('counts points inside the inner circle', () => {
    const { x, y } = center(5);
    expect(tileAt(x + 30, y, BOARD)).toBe(5);
    expect(tileAt(x, y - 30, BOARD)).toBe(5);
  });

  it('ignores the corners of a tile', () => {
    const { x, y } = center(5);
    expect(tileAt(x + 45, y + 45, BOARD)).toBeNull();
    expect(tileAt(x - 45, y - 45, BOARD)).toBeNull();
  });

  it('ignores the gaps between tiles', () => {
    expect(tileAt(104, 50, BOARD)).toBeNull();
    expect(tileAt(50, 104, BOARD)).toBeNull();
  });

  it('ignores the point where four tiles meet, so diagonal drags do not clip neighbors', () => {
    expect(tileAt(104, 104, BOARD)).toBeNull();
  });

  it('returns null off the board', () => {
    expect(tileAt(-20, 50, BOARD)).toBeNull();
    expect(tileAt(50, -20, BOARD)).toBeNull();
    expect(tileAt(BOARD + 20, 50, BOARD)).toBeNull();
    expect(tileAt(50, BOARD + 20, BOARD)).toBeNull();
  });

  it('scales with the board size', () => {
    // Phone-sized board: tiles of 80.5px
    expect(tileAt(40, 40, 346)).toBe(0);
    expect(tileAt(346 - 40, 346 - 40, 346)).toBe(15);
  });
});
