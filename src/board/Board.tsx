import { StyleSheet, Text, View } from 'react-native';
import { BOARD_SIZE, type Board as BoardTiles } from '../game';
import { colors } from '../theme';

const GAP = 8;

interface BoardProps {
  board: BoardTiles;
  /** Width and height of the whole board in pixels. */
  size: number;
}

export function Board({ board, size }: BoardProps) {
  const tileSize = (size - GAP * (BOARD_SIZE - 1)) / BOARD_SIZE;

  return (
    <View style={[styles.board, { width: size, height: size, gap: GAP }]}>
      {board.map((letter, index) => (
        <View key={index} style={[styles.tile, { width: tileSize, height: tileSize }]}>
          <Text style={[styles.letter, { fontSize: tileSize * 0.5 }]}>{letter.toUpperCase()}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tile: {
    backgroundColor: colors.tile,
    borderColor: colors.tileBorder,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: colors.tileText,
    fontWeight: '700',
  },
});
