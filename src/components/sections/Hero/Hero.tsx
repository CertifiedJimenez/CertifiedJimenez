import { Artwork } from '../../common/Artwork/Artwork';
import { ExternalLink } from '../../common/ExternalLink/ExternalLink';
import type { PortfolioContent } from '../../../types/portfolio';
import words from '../../../assets/icons/hero-words.svg?raw';
import triangles from '../../../assets/icons/hero-triangles.svg?raw';
import circles from '../../../assets/icons/hero-circles.svg?raw';
import alternateWords from '../../../assets/icons/alternate-words.svg?raw';
import { AngelReveal } from './AngelReveal';
import { useTheme } from '../../../hooks/useTheme';
import './Hero.css';

/**
 * Composes the original layered SVG hero and its alternate illustration.
 * @component
 * @param props - The two-line motto and its source on the angel artwork.
 * @returns The opening artwork with a link to the reading behind the motto.
 */
export function Hero(props: {
  motto: PortfolioContent['hero'];
  onBrushDragChange?: (active: boolean) => void;
}) {
  const { mode } = useTheme();
  return (
    <section className="hero" aria-label="Introduction">
      <div className="container">
        <div className="c-col-16 c-offset-4 hero--wrapper">
          <div className="hero--words">
            <Artwork svg={words} />
          </div>
          <div className="hero--666" aria-hidden="true">
            <span>3</span>
            <span>3</span>
            <span>3</span>
          </div>
          <div className="hero--111" aria-hidden="true">
            <span>11.1</span>
            <span>11.1</span>
            <span>11.1</span>
            <span>33.3</span>
          </div>
          <div className="hero--33">
            <Artwork svg={triangles} />
          </div>
          <div className="hero--triquetra">
            <Artwork svg={circles} />
          </div>
          <div key={mode} className="hero--alternate">
            {mode !== 'dark' && (
              <AngelReveal
                hoverStrength={0.66}
                splatDetail={0.82}
                onDragChange={props.onBrushDragChange}
              />
            )}
            <div className="hero--alternate-text">
              <Artwork svg={alternateWords} />
              <ExternalLink
                className="hero--motto"
                href={props.motto.href}
                aria-label={`${props.motto.title} ${props.motto.subtitle}`}
              >
                <svg viewBox="0 0 400 64" aria-hidden="true" focusable="false" textAnchor="middle">
                  <text className="hero--motto-title" x="200" y="40.42">
                    {props.motto.title}
                  </text>
                  <text className="hero--motto-caption" x="200" y="57.18">
                    {props.motto.subtitle}
                  </text>
                </svg>
              </ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
