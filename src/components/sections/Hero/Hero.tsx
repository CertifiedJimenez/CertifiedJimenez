import { Artwork } from '../../common/Artwork/Artwork';
import { ExternalLink } from '../../common/ExternalLink/ExternalLink';
import type { PortfolioContent } from '../../../types/portfolio';
import words from '../../../assets/icons/hero-words.svg?raw';
import triangles from '../../../assets/icons/hero-triangles.svg?raw';
import circles from '../../../assets/icons/hero-circles.svg?raw';
import alternateWords from '../../../assets/icons/alternate-words.svg?raw';
import angel from '../../../assets/images/angel2.png';
import './Hero.css';

/**
 * Composes the original layered SVG hero and its alternate illustration.
 * @component
 * @param props - The two-line motto and its source on the angel artwork.
 * @returns The opening artwork with a link to the reading behind the motto.
 */
export function Hero(props: { motto: PortfolioContent['hero'] }) {
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
          <div className="hero--alternate">
            <img src={angel} alt="" width="1086" height="1448" fetchPriority="high" />
            <div className="hero--alternate-text">
              <Artwork svg={alternateWords} />
              <ExternalLink className="hero--motto" href={props.motto.href}>
                <strong>{props.motto.title}</strong>
                <span>{props.motto.subtitle}</span>
              </ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
