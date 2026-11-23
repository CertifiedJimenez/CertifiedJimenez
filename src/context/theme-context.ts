import { createContext } from 'react';

export type DisplayMode = 'dark' | 'light' | 'alternate';

export interface ThemeState {
  mode: DisplayMode;
  toggleLight: () => void;
  toggleArtwork: () => void;
}

/** Shares display-mode controls without coupling consumers to the provider component. */
export const ThemeContext = createContext<ThemeState | null>(null);
