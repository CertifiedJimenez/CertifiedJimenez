import type { Project } from '../../../types/portfolio';
import { WorkEmblem } from '../../common/WorkEmblem/WorkEmblem';
import { ExternalLink } from '../../common/ExternalLink/ExternalLink';

/**
 * Renders one project and the ornamental emblem revealed on hover or focus.
 * @component
 * @param props - Project content and its position in the selected-work list.
 * @returns A linked project entry using the reference typography.
 */
export function ProjectCard(props: { project: Project; index: number }) {
  const { project, index } = props;
  return (
    <article
      className={`projects--single ${project.layout === 'wide' ? 'substance' : 'davide-baratta'}`}
      data-project
      data-work-entry
      data-cursor="skull"
    >
      <WorkEmblem className="projects--single-hover" index={index} />
      <div className="projects--info">
        <div className="projects--client">
          <p>{project.technologies}</p>
        </div>
      </div>
      <div className="projects--title">
        <span className="projects--year hide-mobile">/ {project.year}</span>
        <h3>
          <ExternalLink href={project.href}>
            {project.title.map((line) => (
              <span className="text-line" key={line}>
                {line}
              </span>
            ))}
          </ExternalLink>
        </h3>
      </div>
    </article>
  );
}
