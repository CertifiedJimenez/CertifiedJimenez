import { Artwork } from '../../common/Artwork/Artwork';
import { Divider } from '../../common/Divider/Divider';
import wordmark from '../../../assets/icons/wordmark.svg?raw';
import key from '../../../assets/icons/key.svg?raw';
import './Wordmark.css';

/**
 * Displays the original outlined surname, or editable live type for another name.
 * @component
 * @param props - The surname edited in the portfolio content file.
 * @returns A large animated name followed by its ornamental section divider.
 */
export function Wordmark(props: { surname: string }) {
  const letters = [...props.surname.toUpperCase()];
  return (
    <section className="wordmark" aria-label={props.surname}>
      <div className="container">
        <div className="c-col-20 c-offset-2">
          <div className="wordmark--wrap" data-cursor="logo">
            {props.surname.toUpperCase() === 'JIMENEZ' ? (
              <Artwork svg={wordmark.replaceAll('c-crrtt__logo', 'wordmark')} />
            ) : (
              <svg
                className="wordmark--wrap-svg wordmark--live"
                viewBox="0 0 1184.79 282"
                role="img"
                aria-label={props.surname}
              >
                <text x="0" y="230" textLength="1184.79" lengthAdjust="spacingAndGlyphs">
                  {letters.map((letter, index) => (
                    <tspan key={`${index}-${letter}`}>{letter}</tspan>
                  ))}
                </text>
              </svg>
            )}
            <div className="wordmark--numbers" aria-hidden="true">
              {letters.map((letter, index) => (
                <span
                  key={`${index}-${letter}`}
                  style={{ left: `${6 + (index * 90) / Math.max(letters.length - 1, 1)}%` }}
                >
                  {letter.charCodeAt(0) - 64}
                </span>
              ))}
            </div>
            <div className="wordmark--key">
              <Artwork svg={key} />
            </div>
            <p className="wordmark--hidden" aria-hidden="true">
              {letters.map((letter) => letter.charCodeAt(0) - 64).join(' : ')}
            </p>
          </div>
          <Divider variant="wordmark" />
        </div>
      </div>
    </section>
  );
}
