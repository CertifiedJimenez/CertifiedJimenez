import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type DisplayMode } from './theme-context';

/**
 * Owns the mutually exclusive dark, light and alternate-artwork display modes.
 * @component
 * @param props - The application tree sharing the display controls.
 * @returns Children wrapped in the display-mode context.
 */
export function ThemeProvider(props: { children: ReactNode }) {
  const [mode, setMode] = useState<DisplayMode>('alternate');
  useEffect(() => {
    const icon = document.head.querySelector<HTMLLinkElement>(
      'link[data-dark-icon][data-light-icon]',
    );
    const href = mode === 'light' ? icon?.dataset.lightIcon : icon?.dataset.darkIcon;
    if (href && icon?.getAttribute('href') !== href) icon?.setAttribute('href', href);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleLight: () => setMode((current) => (current === 'light' ? 'dark' : 'light')),
      toggleArtwork: () => setMode((current) => (current === 'alternate' ? 'dark' : 'alternate')),
    }),
    [mode],
  );
  return <ThemeContext value={value}>{props.children}</ThemeContext>;
}
