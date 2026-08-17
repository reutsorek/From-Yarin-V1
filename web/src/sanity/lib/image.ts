import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * The shape IMAGE_FRAGMENT projects. Written structurally rather than imported from
 * the generated types so every block's image, which differ only in stega wrappers,
 * satisfies it.
 */
export interface ProjectedImage {
  _type?: string
  alt?: string | null
  caption?: string | null
  hotspot?: {
    _type?: string
    x?: number
    y?: number
    width?: number
    height?: number
  } | null
  crop?: {
    _type?: string
    top?: number
    bottom?: number
    left?: number
    right?: number
  } | null
  asset?: {
    _id?: string | null
    _ref?: string | null
    url?: string | null
    metadata?: {
      lqip?: string | null
      dimensions?: { width?: number | null; height?: number | null } | null
    } | null
  } | null
}

export function urlFor(source: ProjectedImage) {
  return builder
    .image(source as Parameters<typeof builder.image>[0])
    .auto('format')
    .fit('max')
}

export function aspectRatio(image: ProjectedImage | null | undefined): number | null {
  const dimensions = image?.asset?.metadata?.dimensions
  if (!dimensions?.width || !dimensions?.height) return null
  return dimensions.width / dimensions.height
}
