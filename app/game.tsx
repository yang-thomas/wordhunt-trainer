import { Redirect, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Board } from '../src/board/Board';
import { getTrie } from '../src/dictionary';
import { generateBoard } from '../src/game';
import { colors } from '../src/theme';

const MAX_BOARD_SIZE = 420;
const SIDE_PADDING = 16;

export default function GameScreen() {
  // Query-string values from the URL, e.g. /game?seed=k3x9q2
  const { seed } = useLocalSearchParams<{ seed?: string }>();
  const { width } = useWindowDimensions();
  const board = useMemo(() => (seed ? generateBoard(seed, getTrie()) : null), [seed]);

  if (!board) {
    return <Redirect href="/" />;
  }

  const boardSize = Math.min(width - SIDE_PADDING * 2, MAX_BOARD_SIZE);

  return (
    <View style={styles.container}>
      <Board board={board} size={boardSize} />
      <Text style={styles.seed}>Board {seed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: SIDE_PADDING,
    gap: 16,
  },
  seed: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
