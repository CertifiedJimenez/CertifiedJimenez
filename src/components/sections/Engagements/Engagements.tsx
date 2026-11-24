import type { Engagement } from '../../../types/portfolio';
import cv from '../../../assets/documents/Cristofer-Jimenez-Hernandez-CV.pdf';
import { Divider } from '../../common/Divider/Divider';
import { WorkEmblem } from '../../common/WorkEmblem/WorkEmblem';
import './Engagements.css';

const cvFilename = 'Cristofer-Jimenez-Hernandez-CV.pdf';

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
              <article
                className="engagements--row"
                key={company}
                data-work-entry
                data-cursor="skull"
              >
                <a
                  className="engagements--link"
                  href={cv}
                  download={cvFilename}
                  aria-label={`${company} — Download CV`}
                >
                  <div data-work-reveal>
                    <div className="engagements--title">
                      <h3>{company}</h3>
                      <span className="engagements--period" title={period}>
                        / {year}
                      </span>
                    </div>
                    <p className="engagements--role">{role}</p>
                  </div>
                  <p className="engagements--summary" data-work-reveal>
                    {summary}
                  </p>
                  <WorkEmblem className="engagements--emblem" index={index} />
                </a>
              </article>
            ))}
          </div>
          <Divider variant="cv" href={cv} filename={cvFilename} />
        </div>
      </div>
    </section>
  );
}
