import { Artwork } from '../../common/Artwork/Artwork';
import words from '../../../assets/icons/hero-words.svg?raw';
import triangles from '../../../assets/icons/hero-triangles.svg?raw';
import circles from '../../../assets/icons/hero-circles.svg?raw';
import alternateWords from '../../../assets/icons/alternate-words.svg?raw';
import angel from '../../../assets/images/angel2.png';
import './Hero.css';

/**
 * Composes the original layered SVG hero and its alternate illustration.
 * @component
 * @returns The animated opening artwork with a semantic section heading.
 */
export function Hero() {
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
            <img src={angel} alt="" width="1086" height="1448" />
            <div className="hero--alternate-text">
              <Artwork svg={alternateWords} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
