import Image from 'next/image'
import { aspectRatio, urlFor, type ProjectedImage } from '@/sanity/lib/image'

export interface SanityImageProps {
  image: ProjectedImage | null | undefined
  width: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
  /**
   * CSS object-position used when the image is cropped by object-cover. Defaults to
   * the Sanity hotspot when the editor has set one, otherwise an upper-center bias so
   * a person's head is the last thing to be cropped. Pass an explicit value to override.
   */
  objectPosition?: string
}

/** Upper-center: keeps heads in frame when no hotspot is set. */
const DEFAULT_OBJECT_POSITION = '50% 30%'

function hotspotPosition(image: ProjectedImage): string | null {
  const { x, y } = image.hotspot ?? {}
  if (typeof x !== 'number' || typeof y !== 'number') return null
  return `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`
}

export function SanityImage({
  image,
  width,
  height,
  sizes,
  priority,
  className,
  objectPosition,
}: SanityImageProps) {
  if (!image?.asset) return null

  const ratio = aspectRatio(image)
  const resolvedHeight = height ?? (ratio ? Math.round(width / ratio) : width)
  const lqip = image.asset.metadata?.lqip ?? null

  const src = urlFor(image).width(width).height(resolvedHeight).url()
  const position = objectPosition ?? hotspotPosition(image) ?? DEFAULT_OBJECT_POSITION

  return (
    <Image
      src={src}
      alt={image.alt ?? ''}
      width={width}
      height={resolvedHeight}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectPosition: position }}
      {...(lqip ? { placeholder: 'blur' as const, blurDataURL: lqip } : {})}
    />
  )
}
