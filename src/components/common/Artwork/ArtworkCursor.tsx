import { Artwork } from './Artwork';
import skull from '../../../assets/icons/skull.svg?raw';
import hand from '../../../assets/icons/hand.svg?raw';

/**
 * Supplies decorative pointer-following layers for alternate-artwork mode.
 * @component
 * @returns The three noninteractive cursor illustrations.
 */
export function ArtworkCursor() {
  return (
    <div aria-hidden="true">
      <div className="cursor-art cursor-art--logo" />
      <div className="cursor-art cursor-art--skull">
        <Artwork svg={skull} />
      </div>
      <div className="cursor-art cursor-art--hand">
        <Artwork svg={hand} />
      </div>
    </div>
  );
}
