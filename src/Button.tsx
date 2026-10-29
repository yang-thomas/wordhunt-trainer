import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from './theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ label, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 220,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: '600',
  },
});
