import { useState } from 'react';
import type { PortfolioContent } from '../../../types/portfolio';
import { Artwork } from '../../common/Artwork/Artwork';
import { ExternalLink } from '../../common/ExternalLink/ExternalLink';
import symbol from '../../../assets/icons/about-symbol.svg?raw';
import './About.css';

/**
 * Presents biography, skills and contact copy from the shared content model.
 * @component
 * @param props - Profile and about-section content.
 * @returns The three-column biography with an accessible stack reveal.
 */
export function About(props: { content: PortfolioContent }) {
  const [showStack, setShowStack] = useState(false);
  const { about, footer, ...profile } = props.content;
  return (
    <section className="about" aria-label="About me" data-cursor="hand">
      <div className="container">
        <div className="about--left c-col-8 c-offset-2">
          <div className="about--left-top">
            <div className="about--left-icon">
              <Artwork svg={symbol} />
            </div>
            <h2>
              {about.heading.map((line) => (
                <span className="text-line" key={line}>
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <div className="about--left-bottom">
            {about.skills.map((groups, index) => (
              <div key={index}>
                {groups.map((group) => (
                  <p key={group.title}>
                    <strong>{group.title}:</strong>
                    {group.items.map((item) => (
                      <span className="text-line" key={item}>
                        {item}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="about--center c-col-5 c-offset-2">
          <p>
            {about.introduction} <ExternalLink href={profile.linkedIn}>{about.focus}</ExternalLink>.
          </p>
        </div>
        <div className="about--right c-col-5 c-offset-1">
          <p>
            Based in {profile.location}.<br />
            {about.background} Explore my <ExternalLink href={profile.github}>GitHub</ExternalLink>{' '}
            or reveal my{' '}
            <button
              type="button"
              className="text-button"
              aria-expanded={showStack}
              onClick={() => setShowStack(!showStack)}
            >
              {showStack ? about.stack.join(' / ') : 'stack'}
            </button>
            .
          </p>
          <p>
            {about.invitation}
            <br />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <p>
            {footer.credit}
            <br />
            Adapted for {profile.name}.
          </p>
        </div>
      </div>
    </section>
  );
}
