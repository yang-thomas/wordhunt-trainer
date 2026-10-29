import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useReducer } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Board } from '../src/board/Board';
import { getTrie } from '../src/dictionary';
import { generateBoard, wordFromPath, type Board as BoardTiles } from '../src/game';
import {
  createRound,
  currentWordStatus,
  roundReducer,
  secondsLeft,
  type Feedback,
} from '../src/round/roundReducer';
import { colors } from '../src/theme';

const MAX_BOARD_SIZE = 420;
const SIDE_PADDING = 16;
/** Board size as a fraction of the space available. Smaller = less finger travel on a phone. */
const BOARD_SCALE = 0.75;
/** Extra space above the score bar, word, and board together, in pixels. Pushes the board down toward the thumb. */
const CONTENT_TOP_OFFSET = 100;
/** How often the clock is checked, in ms. The deadline itself is a timestamp, so this only sets how fresh the display is. */
const TICK_MS = 200;
/** How long "Time's up!" shows before moving to the results, in ms. */
const RESULTS_DELAY_MS = 1500;
/** The timer turns red when this many seconds or fewer remain. */
const LOW_TIME_SECONDS = 10;

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
  const [state, dispatch] = useReducer(roundReducer, undefined, () =>
    createRound(board, getTrie(), Date.now()),
  );

  const boardSize = Math.round(Math.min(width - SIDE_PADDING * 2, MAX_BOARD_SIZE) * BOARD_SCALE);
  const status = currentWordStatus(state);
  const dragging = state.path.length > 0;
  const finished = state.status === 'finished';
  const remaining = secondsLeft(state);

  // Check the clock regularly until the round ends. A timer that just subtracts 1 each
  // second drifts when the page is throttled; comparing against the end time does not.
  useEffect(() => {
    if (finished) {
      return;
    }
    const id = setInterval(() => dispatch({ type: 'tick', now: Date.now() }), TICK_MS);
    return () => clearInterval(id);
  }, [finished]);

  // Once time is up, show "Time's up!" for a moment, then move to the results.
  // `replace` swaps this screen out, so Back from the results goes Home, not into a finished round.
  useEffect(() => {
    if (!finished) {
      return;
    }
    const id = setTimeout(
      () => router.replace({ pathname: '/results', params: { seed, found: state.found.join(',') } }),
      RESULTS_DELAY_MS,
    );
    return () => clearTimeout(id);
  }, [finished, seed, state.found]);

  return (
    <View style={styles.container}>
      <View style={[styles.statusBar, { width: boardSize }]}>
        <Text style={styles.score}>{state.score.toLocaleString()}</Text>
        <Text style={[styles.timer, remaining <= LOW_TIME_SECONDS && styles.timerLow]}>{formatClock(remaining)}</Text>
        <Text style={styles.wordCount}>
          {state.found.length} {state.found.length === 1 ? 'word' : 'words'}
        </Text>
      </View>

      <View style={styles.wordSlot}>
        {finished ? (
          <Text style={[styles.feedback, { color: colors.text }]}>Time's up!</Text>
        ) : dragging ? (
          <Text style={[styles.currentWord, { color: STATUS_COLORS[status] }]}>
            {wordFromPath(board, state.path).toUpperCase()}
          </Text>
        ) : (
          state.feedback && <FeedbackText feedback={state.feedback} />
        )}
      </View>

      <View style={finished && styles.boardFinished}>
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

/** 90 → "1:30", 5 → "0:05" */
function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
    paddingTop: 16 + CONTENT_TOP_OFFSET,
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
  timer: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    fontVariant: ['tabular-nums'], // equal-width digits, so the clock doesn't jiggle
  },
  timerLow: {
    color: colors.invalid,
  },
  wordCount: {
    fontSize: 16,
    color: colors.textMuted,
  },
  boardFinished: {
    opacity: 0.45,
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
