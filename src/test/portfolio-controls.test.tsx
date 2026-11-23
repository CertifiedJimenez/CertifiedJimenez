import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../context/ThemeProvider';
import { Divider } from '../components/common/Divider/Divider';
import { Footer } from '../components/layout/Footer/Footer';
import { About } from '../components/sections/About/About';
import { Projects } from '../components/sections/Projects/Projects';
import { Engagements } from '../components/sections/Engagements/Engagements';
import { portfolio } from '../content/portfolio';

describe('portfolio interactions', () => {
  it('shows the engagement year, expands its dates and exposes a named CV download', async () => {
    const user = userEvent.setup();
    render(<Engagements engagements={portfolio.engagements} />);
    const company = screen.getByRole('heading', { name: '/ 2024 Artera' });
    const dates = screen.getByText('Aug 2023 – Dec 2024');
    expect(dates).not.toBeVisible();
    await user.click(company);
    expect(dates).toBeVisible();
    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute(
      'download',
      'Cristofer-Jimenez-Hernandez-CV.pdf',
    );
  });
  it('starts with the angel and keeps the artwork and light controls mutually exclusive', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Divider variant="projects" />
        <Footer content={portfolio} />
      </ThemeProvider>,
    );
    const light = screen.getByRole('button', { name: 'Toggle light theme' });
    const artwork = screen.getByRole('button', { name: 'Toggle alternate artwork' });
    expect(artwork).toHaveAttribute('aria-pressed', 'true');
    expect(light).toHaveAttribute('aria-pressed', 'false');
    await user.click(light);
    expect(light).toHaveAttribute('aria-pressed', 'true');
    expect(artwork).toHaveAttribute('aria-pressed', 'false');
    await user.click(artwork);
    expect(light).toHaveAttribute('aria-pressed', 'false');
    expect(artwork).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Enter}');
    expect(artwork).toHaveAttribute('aria-pressed', 'false');
  });
  it('reveals the editable stack and restores its collapsed state', async () => {
    const user = userEvent.setup();
    const content = { ...portfolio, about: { ...portfolio.about, stack: ['Rust', 'React'] } };
    render(<About content={content} />);
    const button = screen.getByRole('button', { name: 'stack' });
    await user.click(button);
    expect(button).toHaveTextContent('Rust / React');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    await user.click(button);
    expect(button).toHaveTextContent('stack');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
  it('renders a changed project title, destination and year from content', () => {
    const projects = [
      {
        id: 'new-project',
        title: ['A new', 'project'],
        technologies: 'TypeScript',
        year: 2027,
        href: 'https://example.com/project',
        layout: 'stacked' as const,
      },
    ];
    render(
      <ThemeProvider>
        <Projects projects={projects} />
      </ThemeProvider>,
    );
    const link = screen.getByRole('link', { name: 'A new project' });
    expect(link).toHaveAttribute('href', 'https://example.com/project');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('/ 2027')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
