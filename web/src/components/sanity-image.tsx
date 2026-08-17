import Image from 'next/image'
import { aspectRatio, urlFor, type ProjectedImage } from '@/sanity/lib/image'

export interface SanityImageProps {
  image: ProjectedImage | null | undefined
  width: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
}

export function SanityImage({
  image,
  width,
  height,
  sizes,
  priority,
  className,
}: SanityImageProps) {
  if (!image?.asset) return null

  const ratio = aspectRatio(image)
  const resolvedHeight = height ?? (ratio ? Math.round(width / ratio) : width)
  const lqip = image.asset.metadata?.lqip ?? null

  const src = urlFor(image).width(width).height(resolvedHeight).url()

  return (
    <Image
      src={src}
      alt={image.alt ?? ''}
      width={width}
      height={resolvedHeight}
      sizes={sizes}
      priority={priority}
      className={className}
      {...(lqip ? { placeholder: 'blur' as const, blurDataURL: lqip } : {})}
    />
  )
}
