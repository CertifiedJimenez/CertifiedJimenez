import type { Engagement } from '../../../types/portfolio';
import cv from '../../../assets/documents/Cristofer-Jimenez-Hernandez-CV.pdf';
import cvLettering from '../../../assets/icons/cv-lettering.svg?raw';
import { Artwork } from '../../common/Artwork/Artwork';
import { WorkEmblem } from '../../common/WorkEmblem/WorkEmblem';
import './Engagements.css';

/**
 * Presents selected professional work ahead of the personal projects.
 * @component
 * @param props - Professional engagements in editorial display order.
 * @returns The selected engagements section.
 */
export function Engagements(props: { engagements: Engagement[] }) {
  return (
    <section className="engagements" id="engagements" aria-labelledby="engagements-heading">
      <div className="container">
        <div className="c-col-20 c-offset-2">
          <h2 id="engagements-heading" className="work-heading">
            Selected Engagements
          </h2>
          <div className="engagements--list">
            {props.engagements.map(({ company, role, year, period, summary }, index) => (
              <article className="engagements--row" key={company}>
                <details className="engagements--dates">
                  <summary>
                    <h3>
                      <span className="engagements--period">/ {year}</span>
                      {company}
                      <WorkEmblem className="engagements--emblem" index={index} />
                    </h3>
                  </summary>
                  <p className="engagements--tenure">{period}</p>
                </details>
                <p className="engagements--role">{role}</p>
                <p className="engagements--summary">{summary}</p>
              </article>
            ))}
          </div>
          <div className="engagements--download" id="download-cv">
            <a
              href={cv}
              download="Cristofer-Jimenez-Hernandez-CV.pdf"
              aria-label="Download CV"
              title="Download CV"
            >
              <span className="engagements--download-seal" aria-hidden="true">
                <Artwork svg={cvLettering} />
                <span className="engagements--download-mark" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
