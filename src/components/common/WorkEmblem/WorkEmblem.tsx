import { Artwork } from '../Artwork/Artwork';
import emblem from '../../../assets/icons/project-emblem.svg?raw';
import './WorkEmblem.css';

const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/**
 * Pairs a work entry's position with the portfolio's engraved project ornament.
 * @component
 * @param props - Zero-based position in the section and its placement class.
 * @returns A decorative seal shared by project and experience entries.
 */
export function WorkEmblem(props: { index: number; className: string }) {
  return (
    <span className={`work-emblem ${props.className}`} aria-hidden="true">
      <span className="work-emblem__numeral">{numerals[props.index] ?? props.index + 1}</span>
      <Artwork svg={emblem} />
    </span>
  );
}
