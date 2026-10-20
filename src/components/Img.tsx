import type { CSSProperties } from 'react';
import manifest from '../data/image-manifest.json';

type Entry = { width: number; height: number; sources: { w: number; src: string }[]; blur: string };
const M = manifest as Record<string, Entry>;

type Props = {
  /** manifest key, e.g. "longleaf" */
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  position?: string;
  priority?: boolean;
};

/** Width over height of a manifest image, for sizing before it loads. */
export const imgRatio = (key: string) => {
  const e = M[key];
  return e ? e.width / e.height : 1;
};

/** Responsive WebP image with intrinsic size (no layout shift) and a blur placeholder. */
export function Img({ src, alt, sizes = '100vw', className, style, position, priority }: Props) {
  const e = M[src];
  if (!e) return null;
  const fallback = e.sources.find((s) => s.w >= 1000) ?? e.sources.at(-1)!;
  return (
    <img
      src={fallback.src}
      srcSet={e.sources.map((s) => `${s.src} ${s.w}w`).join(', ')}
      sizes={sizes}
      width={e.width}
      height={e.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={{
        backgroundImage: `url(${e.blur})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
        objectPosition: position,
        ...style,
      }}
    />
  );
}
