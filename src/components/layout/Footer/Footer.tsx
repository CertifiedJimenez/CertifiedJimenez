import type { PortfolioContent } from '../../../types/portfolio';
import { useTheme } from '../../../hooks/useTheme';
import { Artwork } from '../../common/Artwork/Artwork';
import { ExternalLink } from '../../common/ExternalLink/ExternalLink';
import cross from '../../../assets/icons/cross.svg?raw';
import burst from '../../../assets/icons/burst.svg?raw';
import eye from '../../../assets/icons/eye.svg?raw';
import './Footer.css';

/**
 * Displays profile links and the reference's alternate-artwork control.
 * @component
 * @param props - Profile details, footer copy and social destinations.
 * @returns The portfolio footer with a keyboard-operable artwork toggle.
 */
export function Footer(props: { content: PortfolioContent }) {
  const { mode, toggleArtwork } = useTheme();
  const { footer, ...profile } = props.content;
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__left">
          <ul>
            <li className="hide-mobile">{footer.year}</li>
            <li className="hide-mobile">{profile.name}</li>
            <li className="hide-mobile">{profile.location}</li>
            <li className="hide-desktop">Availability: {profile.availability}</li>
          </ul>
        </div>
        <div className="footer__center">
          <div className="footer__center--1 hide-mobile">
            <p>{footer.motto[0]}</p>
          </div>
          <div className="footer__center--2">
            <button
              type="button"
              className={`footer__center--wrap ornament-button ${mode === 'alternate' ? 'satan' : ''}`}
              onClick={toggleArtwork}
              aria-label="Toggle alternate artwork"
              aria-pressed={mode === 'alternate'}
            >
              <Artwork svg={cross} />
              <Artwork svg={burst} />
              <Artwork svg={eye} />
            </button>
          </div>
          <div className="footer__center--3 hide-mobile">
            <p>{footer.motto[1]}</p>
          </div>
        </div>
        <div className="footer__right">
          <ul>
            {footer.socials.map((social) => (
              <li key={social.label}>
                <ExternalLink href={social.href}>{social.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
