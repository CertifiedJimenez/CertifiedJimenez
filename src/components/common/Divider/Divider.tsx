import { Artwork } from '../Artwork/Artwork';
import death from '../../../assets/icons/death-seal.svg?raw';
import flourish from '../../../assets/icons/flourish-cross.svg?raw';
import earth from '../../../assets/icons/earth-seal.svg?raw';
import sunMoon from '../../../assets/icons/sun-moon.svg?raw';
import cvLettering from '../../../assets/icons/cv-lettering.svg?raw';
import './Divider.css';

type DividerProps =
  | { variant: 'wordmark' }
  | { variant: 'projects'; light: boolean; onToggle: () => void }
  | { variant: 'cv'; href: string; filename: string };

const lettering = { wordmark: death, projects: earth, cv: cvLettering };

/**
 * Pairs the section rules with stationary lettering and a separate central symbol.
 * @component
 * @param props - The artwork variant and its optional theme or download action.
 * @returns A decorative divider, theme button or labelled CV download.
 */
export function Divider(props: DividerProps) {
  const prefix = props.variant === 'cv' ? 'engagements--download' : `${props.variant}--bottom`;
  const seal = (
    <span className={`divider__seal ${prefix}-icon`} aria-hidden="true">
      <Artwork svg={lettering[props.variant]} />
      <span className="divider__symbol">
        {props.variant === 'cv' ? (
          <span className="divider__scroll" />
        ) : (
          <Artwork svg={props.variant === 'wordmark' ? flourish : sunMoon} />
        )}
      </span>
    </span>
  );
  const content = (
    <>
      <span className={`divider__rule divider__rule--left ${prefix}-left`} aria-hidden="true" />
      {props.variant === 'cv' ? (
        <a
          className="divider__link"
          href={props.href}
          download={props.filename}
          aria-label="Download CV"
          title="Download CV"
        >
          {seal}
        </a>
      ) : (
        seal
      )}
      <span className={`divider__rule divider__rule--right ${prefix}-right`} aria-hidden="true" />
    </>
  );
  if (props.variant === 'projects') {
    return (
      <button
        className={`divider ${prefix} ornament-button`}
        type="button"
        onClick={props.onToggle}
        aria-label="Toggle light theme"
        aria-pressed={props.light}
      >
        {content}
      </button>
    );
  }
  return (
    <div
      className={`divider ${prefix}`}
      id={props.variant === 'cv' ? 'download-cv' : undefined}
      aria-hidden={props.variant === 'wordmark' || undefined}
    >
      {content}
    </div>
  );
}
