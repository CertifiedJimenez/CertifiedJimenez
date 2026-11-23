import { Artwork } from '../Artwork/Artwork';
import death from '../../../assets/icons/death-seal.svg?raw';
import flourish from '../../../assets/icons/flourish-cross.svg?raw';
import earth from '../../../assets/icons/earth-seal.svg?raw';
import sunMoon from '../../../assets/icons/sun-moon.svg?raw';
import { useTheme } from '../../../hooks/useTheme';

/**
 * Reuses the ornamental section rule, optionally as a light-theme control.
 * @component
 * @param props - The section whose ornament and class names should be used.
 * @returns A decorative divider or an accessible theme-toggle button.
 */
export function Divider(props: { variant: 'wordmark' | 'projects' }) {
  const { mode, toggleLight } = useTheme();
  const prefix = `${props.variant}--bottom`;
  const content = (
    <>
      <span className={`${prefix}-left`} />
      <span className={`${prefix}-right`} />
      <span className={`${prefix}-icon`}>
        <Artwork svg={props.variant === 'wordmark' ? death : earth} />
        <Artwork svg={props.variant === 'wordmark' ? flourish : sunMoon} />
      </span>
    </>
  );
  return props.variant === 'projects' ? (
    <button
      className={`${prefix} ornament-button`}
      type="button"
      onClick={toggleLight}
      aria-label="Toggle light theme"
      aria-pressed={mode === 'light'}
    >
      {content}
    </button>
  ) : (
    <div className={prefix} aria-hidden="true">
      {content}
    </div>
  );
}
