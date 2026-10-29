import { useRef } from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type ViewStyle,
} from 'react-native';
import type { Board as BoardTiles } from '../game';
import { colors } from '../theme';
import { TILE_GAP, tileAt, tileSize } from './hitTest';

interface BoardProps {
  board: BoardTiles;
  /** Width and height of the whole board in pixels. */
  size: number;
  /** Tiles currently selected, highlighted on the board. */
  selected: readonly number[];
  /** Color of the selected tiles: neutral, a valid new word, or a word already found. */
  highlight: 'selected' | 'valid' | 'duplicate';
  /** Called each time the pointer moves onto a different tile. */
  onTileEnter: (tile: number) => void;
  /** Called when the finger lifts or the mouse button is released. */
  onRelease: () => void;
}

// Web-only CSS: stop the page from scrolling under a swipe and stop
// mouse drags from selecting the letters as text.
const noBrowserGestures = { touchAction: 'none', userSelect: 'none' } as ViewStyle;

export function Board({ board, size, selected, highlight, onTileEnter, onRelease }: BoardProps) {
  // The PanResponder is created once, so it reads the latest props through a ref.
  const latest = useRef({ size, onTileEnter, onRelease });
  latest.current = { size, onTileEnter, onRelease };
  const lastTile = useRef<number | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // keep the gesture until release
      onPanResponderGrant: (event) => {
        lastTile.current = null;
        handlePointer(event);
      },
      onPanResponderMove: (event) => handlePointer(event),
      onPanResponderRelease: () => latest.current.onRelease(),
      onPanResponderTerminate: () => latest.current.onRelease(),
    }),
  ).current;

  function handlePointer(event: GestureResponderEvent) {
    // Tiles ignore pointer events, so the board is always the target and
    // locationX/Y are measured from the board's top-left corner.
    const { locationX, locationY } = event.nativeEvent;
    const tile = tileAt(locationX, locationY, latest.current.size);
    if (tile !== null && tile !== lastTile.current) {
      lastTile.current = tile;
      latest.current.onTileEnter(tile);
    }
  }

  const tilePx = tileSize(size);

  return (
    <View
      style={[styles.board, noBrowserGestures, { width: size, height: size, gap: TILE_GAP }]}
      {...panResponder.panHandlers}
    >
      {board.map((letter, index) => {
        const isSelected = selected.includes(index);
        return (
          <View
            key={index}
            style={[styles.tile, isSelected && styles[highlight], { width: tilePx, height: tilePx }]}
          >
            <Text style={[styles.letter, isSelected && styles.letterSelected, { fontSize: tilePx * 0.5 }]}>
              {letter.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    pointerEvents: 'none', // the board, not the tile, receives the drag
    backgroundColor: colors.tile,
    borderColor: colors.tileBorder,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: colors.tileSelected,
    borderColor: colors.tileSelected,
  },
  valid: {
    backgroundColor: colors.tileValid,
    borderColor: colors.tileValid,
  },
  duplicate: {
    backgroundColor: colors.tileDuplicate,
    borderColor: colors.tileDuplicate,
  },
  letter: {
    color: colors.tileText,
    fontWeight: '700',
  },
  letterSelected: {
    color: colors.tileSelectedText,
  },
});
