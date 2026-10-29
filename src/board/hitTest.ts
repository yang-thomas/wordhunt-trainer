import { BOARD_SIZE } from '../game';

/** Space between tiles, in pixels. */
export const TILE_GAP = 8;

/**
 * How close to a tile's center the pointer must be to count as "over" it,
 * as a fraction of the tile's width. 0.35 = the inner 70% circle. The dead
 * zone at the corners stops a diagonal drag from clipping the tiles beside it.
 */
const HIT_RADIUS = 0.35;

export function tileSize(boardSize: number): number {
  return (boardSize - TILE_GAP * (BOARD_SIZE - 1)) / BOARD_SIZE;
}

/**
 * Which tile is under the point (x, y), measured in pixels from the board's
 * top-left corner? Returns null for gaps, corners, and anywhere off the board.
 */
export function tileAt(x: number, y: number, boardSize: number): number | null {
  const size = tileSize(boardSize);
  const pitch = size + TILE_GAP; // distance from one tile's start to the next

  // Each tile's cell is the tile plus half a gap on each side
  const col = Math.floor((x + TILE_GAP / 2) / pitch);
  const row = Math.floor((y + TILE_GAP / 2) / pitch);
  if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) {
    return null;
  }

  const dx = x - (col * pitch + size / 2);
  const dy = y - (row * pitch + size / 2);
  if (Math.hypot(dx, dy) > size * HIT_RADIUS) {
    return null;
  }
  return row * BOARD_SIZE + col;
}
