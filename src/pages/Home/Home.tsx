import { useRef } from 'react';
import { portfolio } from '../../content/portfolio';
import { Header } from '../../components/layout/Header/Header';
import { Footer } from '../../components/layout/Footer/Footer';
import { Hero } from '../../components/sections/Hero/Hero';
import { Wordmark } from '../../components/sections/Wordmark/Wordmark';
import { Engagements } from '../../components/sections/Engagements/Engagements';
import { Projects } from '../../components/sections/Projects/Projects';
import { About } from '../../components/sections/About/About';
import { ArtworkCursor } from '../../components/common/Artwork/ArtworkCursor';
import { useTheme } from '../../hooks/useTheme';
import { usePortfolioMotion } from '../../hooks/usePortfolioMotion';
import { useArtworkTransition } from '../../hooks/useArtworkTransition';

/**
 * Composes the single portfolio page from content-driven sections.
 * @component
 * @returns The complete portfolio, its metadata and decorative motion layers.
 */
export function Home() {
  const root = useRef<HTMLDivElement>(null);
  const { mode } = useTheme();
  usePortfolioMotion(root);
  useArtworkTransition(root, mode);
  return (
    <div
      ref={root}
      id="top"
      className={`site ${mode === 'light' ? 'theme-light' : ''} ${mode === 'alternate' ? 'alternate-artwork' : ''}`}
    >
      <a className="skip-link" href="#engagements">
        Skip to selected work
      </a>
      <Header content={portfolio} />
      <main className="portfolio">
        <Hero />
        <Wordmark surname={portfolio.surname} />
        <Engagements engagements={portfolio.engagements} />
        <Projects projects={portfolio.projects} />
        <About content={portfolio} />
      </main>
      <Footer content={portfolio} />
      <ArtworkCursor />
    </div>
  );
}
