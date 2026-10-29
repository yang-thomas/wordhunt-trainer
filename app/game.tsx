import { Redirect, useLocalSearchParams } from 'expo-router';
import { useMemo, useReducer } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Board } from '../src/board/Board';
import { getTrie } from '../src/dictionary';
import { generateBoard, wordFromPath, type Board as BoardTiles } from '../src/game';
import { createRound, currentWordStatus, roundReducer, type Feedback } from '../src/round/roundReducer';
import { colors } from '../src/theme';

const MAX_BOARD_SIZE = 420;
const SIDE_PADDING = 16;
/** Board size as a fraction of the space available. Smaller = less finger travel on a phone. */
const BOARD_SCALE = 0.75;
/** Extra space above the board, in pixels. */
const BOARD_TOP_OFFSET = 100;

export default function GameScreen() {
  // Query-string values from the URL, e.g. /game?seed=k3x9q2
  const { seed } = useLocalSearchParams<{ seed?: string }>();
  const board = useMemo(() => (seed ? generateBoard(seed, getTrie()) : null), [seed]);

  if (!seed || !board) {
    return <Redirect href="/" />;
  }
  // `key` gives each board a fresh round: when the seed changes, React starts over.
  return <Round key={seed} board={board} seed={seed} />;
}

function Round({ board, seed }: { board: BoardTiles; seed: string }) {
  const { width } = useWindowDimensions();
  const [state, dispatch] = useReducer(roundReducer, undefined, () => createRound(board, getTrie()));

  const boardSize = Math.round(Math.min(width - SIDE_PADDING * 2, MAX_BOARD_SIZE) * BOARD_SCALE);
  const status = currentWordStatus(state);
  const dragging = state.path.length > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.statusBar, { width: boardSize }]}>
        <Text style={styles.score}>{state.score.toLocaleString()}</Text>
        <Text style={styles.wordCount}>
          {state.found.length} {state.found.length === 1 ? 'word' : 'words'}
        </Text>
      </View>

      <View style={styles.wordSlot}>
        {dragging ? (
          <Text style={[styles.currentWord, { color: STATUS_COLORS[status] }]}>
            {wordFromPath(board, state.path).toUpperCase()}
          </Text>
        ) : (
          state.feedback && <FeedbackText feedback={state.feedback} />
        )}
      </View>

      <View style={styles.boardArea}>
        <Board
          board={board}
          size={boardSize}
          selected={state.path}
          highlight={status === 'none' ? 'selected' : status}
          onTileEnter={(tile) => dispatch({ type: 'enterTile', tile })}
          onRelease={() => dispatch({ type: 'release' })}
        />
      </View>
      <Text style={styles.seed}>Board {seed}</Text>
    </View>
  );
}

const STATUS_COLORS = { valid: colors.valid, duplicate: colors.duplicate, none: colors.text };

function FeedbackText({ feedback }: { feedback: Feedback }) {
  const word = feedback.word.toUpperCase();
  switch (feedback.kind) {
    case 'valid':
      return <Text style={[styles.feedback, { color: colors.valid }]}>{word} +{feedback.points}</Text>;
    case 'duplicate':
      return <Text style={[styles.feedback, { color: colors.duplicate }]}>{word} · already found</Text>;
    case 'not-a-word':
      return <Text style={[styles.feedback, { color: colors.invalid }]}>{word} · not a word</Text>;
    case 'too-short':
      return <Text style={[styles.feedback, { color: colors.invalid }]}>{word} · too short</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: SIDE_PADDING,
    gap: 12,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  wordCount: {
    fontSize: 16,
    color: colors.textMuted,
  },
  boardArea: {
    // Pushes the board down toward the thumb; the score and word stay at the top
    marginTop: BOARD_TOP_OFFSET,
  },
  wordSlot: {
    height: 44,
    justifyContent: 'center',
  },
  currentWord: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
  },
  feedback: {
    fontSize: 22,
    fontWeight: '700',
  },
  seed: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
