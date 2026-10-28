/** One tile's letter, lowercase. A string (not a char) so a "qu" tile could be added later. */
export type Tile = string;

/** 16 tiles in row-major order: index = row * 4 + col. */
export type Board = readonly Tile[];

/** Tile indices in the order they were swiped. Indices (not letters) keep repeated letters unambiguous. */
export type Path = readonly number[];

export interface FoundWord {
  word: string;
  path: Path;
}
