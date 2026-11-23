import { useTheme } from '../../../hooks/useTheme';
import type { Project } from '../../../types/portfolio';
import { Divider } from '../../common/Divider/Divider';
import { ProjectCard } from './ProjectCard';
import './Projects.css';

/**
 * Maps the editable project list into the selected-work section.
 * @component
 * @param props - Ordered public projects to display.
 * @returns The project list and its light-theme control.
 */
export function Projects(props: { projects: Project[] }) {
  const { mode, toggleLight } = useTheme();
  return (
    <section className="projects" aria-labelledby="personal-projects-heading" id="projects">
      <div className="container">
        <div className="c-col-20 c-offset-2">
          <div className="projects--wrapper">
            <h2 className="work-heading" id="personal-projects-heading">
              Personal Projects
            </h2>
            {props.projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
          <Divider variant="projects" light={mode === 'light'} onToggle={toggleLight} />
        </div>
      </div>
    </section>
  );
}
