import { ThemeProvider } from './context/ThemeProvider';
import { Home } from './pages/Home/Home';

/**
 * Connects application providers to the portfolio page.
 * @component
 * @returns The application root with shared theme state.
 */
export function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}
