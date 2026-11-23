import type { Project } from '../../../types/portfolio';
import { Artwork } from '../../common/Artwork/Artwork';
import { ExternalLink } from '../../common/ExternalLink/ExternalLink';
import emblem from '../../../assets/icons/project-emblem.svg?raw';

/**
 * Renders one project and the ornamental emblem revealed on hover or focus.
 * @component
 * @param props - Project content and its position in the selected-work list.
 * @returns A linked project entry using the reference typography.
 */
export function ProjectCard(props: { project: Project; index: number }) {
  const { project, index } = props;
  const numeral = new Intl.NumberFormat('en').format(index + 1);
  return (
    <article
      className={`projects--single ${project.layout === 'wide' ? 'substance' : 'davide-baratta'}`}
      data-project
      data-cursor="skull"
    >
      <div className="projects--single-hover" aria-hidden="true">
        <span className="number">
          {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][index] ?? numeral}
        </span>
        <span className="icon">
          <Artwork svg={emblem} />
        </span>
      </div>
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
