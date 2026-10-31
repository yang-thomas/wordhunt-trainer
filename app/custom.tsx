import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Board } from '../src/board/Board';
import { customBoardId } from '../src/board/boardId';
import { checkLetters } from '../src/board/customBoard';
import { Button } from '../src/Button';
import { getTrie } from '../src/dictionary';
import { boardFromLetters, TILE_COUNT } from '../src/game';
import { buildResults } from '../src/round/results';
import { colors } from '../src/theme';

const MAX_PREVIEW_SIZE = 240;
const SIDE_PADDING = 16;

const noop = () => {};

export default function CustomBoardScreen() {
  const { width } = useWindowDimensions();
  const [input, setInput] = useState('');

  const check = checkLetters(input);

  // Once there are 16 valid letters, solve the board to count its words.
  const summary = useMemo(() => {
    if (!check.ok) {
      return null;
    }
    const board = boardFromLetters(check.letters);
    return { board, ...buildResults(board, getTrie(), []) };
  }, [check.ok, check.ok ? check.letters : '']);

  const noWords = summary !== null && summary.totalCount === 0;
  const canPlay = check.ok && !noWords;
  const previewSize = Math.min(width - SIDE_PADDING * 2, MAX_PREVIEW_SIZE);

  function play() {
    if (check.ok && !noWords) {
      router.push({ pathname: '/game', params: { seed: customBoardId(check.letters) } });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Enter {TILE_COUNT} letters, row by row</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        onSubmitEditing={play}
        placeholder="abcd efgh ijkl mnop"
        placeholderTextColor={colors.disabled}
        autoCapitalize="characters"
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        returnKeyType="go"
        style={styles.input}
      />
      <Text style={[styles.status, check.ok && styles.statusOk]}>
        {check.ok ? `${TILE_COUNT} letters ✓` : check.message}
      </Text>

      {summary && (
        <View style={styles.preview}>
          <Board
            board={summary.board}
            size={previewSize}
            selected={[]}
            highlight="selected"
            onTileEnter={noop}
            onRelease={noop}
          />
          {noWords ? (
            <Text style={styles.noWords}>No words can be made on this board. Try different letters.</Text>
          ) : (
            <>
              <Text style={styles.wordCount}>
                {summary.totalCount} {summary.totalCount === 1 ? 'word' : 'words'} on this board
              </Text>
              <Text style={styles.maxScore}>Best possible: {summary.maxScore.toLocaleString()} points</Text>
            </>
          )}
        </View>
      )}

      <View style={styles.buttons}>
        <Button label="Play this board" onPress={play} disabled={!canPlay} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SIDE_PADDING,
    paddingTop: 24,
    paddingBottom: 48,
    gap: 12,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.tileBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: colors.text,
  },
  status: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    minHeight: 20,
  },
  statusOk: {
    color: colors.valid,
    fontWeight: '600',
  },
  preview: {
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  wordCount: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  maxScore: {
    fontSize: 14,
    color: colors.textMuted,
  },
  noWords: {
    marginTop: 4,
    fontSize: 16,
    color: colors.invalid,
    textAlign: 'center',
  },
  buttons: {
    marginTop: 16,
  },
});
