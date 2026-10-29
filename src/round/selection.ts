import { isAdjacent } from '../game';

/**
 * The selected path after the pointer moves onto `tile`:
 * - empty path: start at this tile
 * - back onto the previous tile: undo the last step
 * - an unused tile touching the last one: add it
 * - anything else (same tile, used tile, too far away): no change
 */
export function nextPath(path: readonly number[], tile: number): readonly number[] {
  if (path.length === 0) {
    return [tile];
  }
  const last = path[path.length - 1];
  if (path.length >= 2 && tile === path[path.length - 2]) {
    return path.slice(0, -1);
  }
  if (path.includes(tile) || !isAdjacent(last, tile)) {
    return path;
  }
  return [...path, tile];
}
