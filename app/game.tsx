import { Redirect, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Board } from '../src/board/Board';
import { getTrie } from '../src/dictionary';
import { generateBoard, wordFromPath } from '../src/game';
import { nextPath } from '../src/round/selection';
import { colors } from '../src/theme';

const MAX_BOARD_SIZE = 420;
const SIDE_PADDING = 16;

export default function GameScreen() {
  // Query-string values from the URL, e.g. /game?seed=k3x9q2
  const { seed } = useLocalSearchParams<{ seed?: string }>();
  const { width } = useWindowDimensions();
  const board = useMemo(() => (seed ? generateBoard(seed, getTrie()) : null), [seed]);
  const [path, setPath] = useState<readonly number[]>([]);

  if (!board) {
    return <Redirect href="/" />;
  }

  const boardSize = Math.min(width - SIDE_PADDING * 2, MAX_BOARD_SIZE);
  const currentWord = wordFromPath(board, path).toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.currentWord}>{currentWord || ' '}</Text>
      <Board
        board={board}
        size={boardSize}
        selected={path}
        onTileEnter={(tile) => setPath((current) => nextPath(current, tile))}
        onRelease={() => setPath([])}
      />
      <Text style={styles.seed}>Board {seed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: SIDE_PADDING,
    gap: 16,
  },
  currentWord: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.text,
    minHeight: 40,
  },
  seed: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
