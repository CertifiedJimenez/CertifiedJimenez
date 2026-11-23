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
      <h2 id="engagements-heading">Selected Engagements</h2>
      {props.engagements.map(({ company, role, period, summary }) => (
        <article className="engagements--row" key={company}>
          <div>
            <h3>{company}</h3>
            <p>{role}</p>
            <p className="engagements--period">{period}</p>
          </div>
          <p className="engagements--summary">{summary}</p>
        </article>
      ))}
      <div className="engagements--download">
        <a href={cv} download="Cristofer-Jimenez-Hernandez-CV.pdf">
          Download CV (PDF)
        </a>
      </div>
    </section>
  );
}
