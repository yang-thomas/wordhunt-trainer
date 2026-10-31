import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from './theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** 'secondary' is an outlined button for less important actions. */
  variant?: 'primary' | 'secondary';
  /** Smaller, for buttons that sit side by side. */
  compact?: boolean;
}

export function Button({ label, onPress, disabled = false, variant = 'primary', compact = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        compact && styles.compact,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel, compact && styles.compactLabel]}>
        {label}
      </Text>
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
  compact: {
    minWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
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
  secondaryLabel: {
    color: colors.primary,
  },
  compactLabel: {
    fontSize: 16,
  },
});
