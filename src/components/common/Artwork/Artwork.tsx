import { useId } from 'react';

interface ArtworkProps {
  svg: string;
  className?: string;
}

/**
 * Renders trusted, repository-owned SVG artwork inline for path animation.
 * Namespaces definition IDs so repeated project emblems cannot collide.
 * @component
 * @param props - SVG source imported with Vite's `?raw` suffix and optional wrapper class.
 * @returns Decorative SVG artwork hidden from assistive technology.
 */
export function Artwork(props: ArtworkProps) {
  const prefix = useId().replaceAll(':', '');
  let svg = props.svg;
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  for (const id of ids) {
    if (!id) continue;
    // Keep animation selectors on visible elements; namespace only definitions.
    if (!svg.includes(`<path id="${id}"`) && !svg.includes(`<clipPath id="${id}"`)) continue;
    svg = svg
      .replaceAll(`id="${id}"`, `id="${prefix}-${id}"`)
      .replaceAll(`href="#${id}"`, `href="#${prefix}-${id}"`)
      .replaceAll(`url(#${id})`, `url(#${prefix}-${id})`);
  }
  return (
    <span
      className={`artwork ${props.className ?? ''}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
