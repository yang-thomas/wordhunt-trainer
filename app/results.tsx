import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../src/Button';
import { getTrie } from '../src/dictionary';
import { generateBoard } from '../src/game';
import { buildResults, parseFoundParam, type ResultWord } from '../src/round/results';
import { colors } from '../src/theme';

type Tab = 'all' | 'mine';

export default function ResultsScreen() {
  // e.g. /results?seed=k3x9q2&found=cat,dog,bird
  const { seed, found } = useLocalSearchParams<{ seed?: string; found?: string }>();
  const [tab, setTab] = useState<Tab>('all');

  // The board and its word list are rebuilt from the seed, so the URL only has to carry the seed and your words.
  const results = useMemo(() => {
    if (!seed) {
      return null;
    }
    const trie = getTrie();
    return buildResults(generateBoard(seed, trie), trie, parseFoundParam(found));
  }, [seed, found]);

  if (!seed || !results) {
    return <Redirect href="/" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        <Text style={styles.score}>{results.score.toLocaleString()}</Text>
        <Text style={styles.scoreLabel}>points</Text>
        <Text style={styles.stats}>
          Found {results.foundCount} of {results.totalCount} words
        </Text>
        <Text style={styles.statsMuted}>Best possible: {results.maxScore.toLocaleString()} points</Text>
        <View style={styles.buttons}>
          <Button label="Home" onPress={() => router.replace('/')} />
        </View>
      </View>

      <View style={styles.tabs}>
        <TabButton label={`All words (${results.totalCount})`} active={tab === 'all'} onPress={() => setTab('all')} />
        <TabButton label={`Your words (${results.foundCount})`} active={tab === 'mine'} onPress={() => setTab('mine')} />
      </View>

      {tab === 'all' ? (
        results.groups.map((group) => (
          <View key={group.length} style={styles.group}>
            <Text style={styles.groupTitle}>
              {group.length} letters · {group.foundCount}/{group.words.length} found
            </Text>
            <View style={styles.chips}>
              {group.words.map((entry) => (
                <WordChip key={entry.word} entry={entry} />
              ))}
            </View>
          </View>
        ))
      ) : results.foundWords.length === 0 ? (
        <Text style={styles.empty}>You didn't find any words this round.</Text>
      ) : (
        <View style={styles.chips}>
          {results.foundWords.map((entry) => (
            <WordChip key={entry.word} entry={entry} showPoints />
          ))}
        </View>
      )}
      <Text style={styles.seed}>Board {seed}</Text>
    </ScrollView>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Text onPress={onPress} style={[styles.tab, active && styles.tabActive]} accessibilityRole="button">
      {label}
    </Text>
  );
}

function WordChip({ entry, showPoints = false }: { entry: ResultWord; showPoints?: boolean }) {
  return (
    <Text style={[styles.chip, entry.found ? styles.chipFound : styles.chipMissed]}>
      {entry.word.toUpperCase()}
      {showPoints ? ` +${entry.points}` : ''}
    </Text>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 48,
    gap: 16,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  summary: {
    alignItems: 'center',
    paddingTop: 8,
    gap: 2,
  },
  score: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.text,
  },
  scoreLabel: {
    fontSize: 16,
    color: colors.textMuted,
  },
  stats: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statsMuted: {
    fontSize: 14,
    color: colors.textMuted,
  },
  buttons: {
    marginTop: 16,
    gap: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
    cursor: 'pointer',
    userSelect: 'none',
  },
  tabActive: {
    color: colors.primaryText,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  group: {
    gap: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  chipFound: {
    color: colors.primaryText,
    backgroundColor: colors.valid,
  },
  chipMissed: {
    color: colors.textMuted,
    backgroundColor: colors.tile,
    borderWidth: 1,
    borderColor: colors.tileBorder,
  },
  empty: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
  },
  seed: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
  },
});
