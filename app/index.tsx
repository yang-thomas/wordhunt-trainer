import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../src/Button';
import { newSeed } from '../src/seeds';
import { colors } from '../src/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word Hunt Trainer</Text>
      <Text style={styles.subtitle}>Find as many words as you can in 90 seconds.</Text>
      <View style={styles.buttons}>
        <Button label="New game" onPress={() => router.push({ pathname: '/game', params: { seed: newSeed() } })} />
        <Button label="Custom board" onPress={() => {}} disabled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
});
