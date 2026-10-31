import { useEffect, useState } from 'react';
import { Button } from './Button';

/** How long the button stays "armed" waiting for the second tap, in ms. */
const CONFIRM_WINDOW_MS = 3000;

interface ConfirmButtonProps {
  label: string;
  onConfirm: () => void;
}

/**
 * For actions that can't be undone. The first tap arms the button ("Tap to confirm"),
 * the second tap does the action. If you wait, it goes back to normal.
 */
export function ConfirmButton({ label, onConfirm }: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) {
      return;
    }
    const id = setTimeout(() => setArmed(false), CONFIRM_WINDOW_MS);
    return () => clearTimeout(id);
  }, [armed]);

  return (
    <Button
      compact
      variant={armed ? 'primary' : 'secondary'}
      label={armed ? 'Tap to confirm' : label}
      onPress={() => (armed ? onConfirm() : setArmed(true))}
    />
  );
}
