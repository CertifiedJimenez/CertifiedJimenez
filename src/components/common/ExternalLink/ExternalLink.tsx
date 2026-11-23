import type { ComponentPropsWithoutRef } from 'react';

/**
 * Applies safe new-tab behavior to web links while leaving email links native.
 * @component
 * @param props - Standard anchor attributes and link content.
 * @returns An accessible anchor with consistent external-link behavior.
 */
export function ExternalLink(props: ComponentPropsWithoutRef<'a'>) {
  const external = props.href?.startsWith('https://');
  return (
    <a
      {...props}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {props.children}
    </a>
  );
}
