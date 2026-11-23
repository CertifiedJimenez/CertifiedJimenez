import type { Engagement } from '../../../types/portfolio';
import cv from '../../../assets/documents/Cristofer-Jimenez-Hernandez-CV.pdf';
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
            {props.engagements.map(({ company, role, period, summary }) => (
              <article className="engagements--row" key={company}>
                <p className="engagements--period">{period}</p>
                <h3>{company}</h3>
                <p className="engagements--role">{role}</p>
                <p className="engagements--summary">{summary}</p>
              </article>
            ))}
          </div>
          <div className="engagements--download">
            <a href={cv} download="Cristofer-Jimenez-Hernandez-CV.pdf">
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
