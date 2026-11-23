import type { PortfolioContent } from '../../../types/portfolio';
import { Artwork } from '../../common/Artwork/Artwork';
import { ExternalLink } from '../../common/ExternalLink/ExternalLink';
import saturn from '../../../assets/icons/saturn.svg?raw';
import './Header.css';

/**
 * Shows the portfolio identity, location and primary contact destinations.
 * @component
 * @param props - Editable profile content.
 * @returns The fixed reference-style masthead.
 */
export function Header(props: { content: PortfolioContent }) {
  const profile = props.content;
  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <h1>
            <a href="#top" aria-label={`${profile.name} — back to top`}>
              {profile.monogram.map((line) => (
                <span className="text-line" key={line}>
                  {line}
                </span>
              ))}
            </a>
          </h1>
        </div>
        <div className="header__where">
          <p>
            {profile.name}
            <br />
            <ExternalLink href={profile.locationUrl}>{profile.location}</ExternalLink>
          </p>
        </div>
        <div className="header__mail">
          <p>
            Contact:
            <br />
            <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}>
              Get in touch
            </a>
          </p>
        </div>
        <div className="header__availability hide-mobile">
          <p>
            Availability:
            <br />
            {profile.availability}
          </p>
        </div>
        <div className="header__jury hide-mobile">
          <p>
            Find me:
            <br />
            <ExternalLink href={profile.linkedIn}>LinkedIn</ExternalLink>
          </p>
        </div>
        <div className="header__role hide-mobile">
          <p>
            {profile.role.map((line) => (
              <span className="text-line" key={line}>
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="header__right">
        <p>
          <span>
            <Artwork svg={saturn} />
          </span>
          33°
        </p>
      </div>
    </header>
  );
}
