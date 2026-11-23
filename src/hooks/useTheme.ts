import { useContext } from 'react';
import { ThemeContext } from '../context/theme-context';

/**
 * Reads the shared portfolio display mode and its controls.
 * @returns The theme state supplied by ThemeProvider.
 * @throws When called outside ThemeProvider.
 */
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider.');
  return value;
}
