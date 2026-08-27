import { stegaClean } from 'next-sanity'
import { Section, SectionHeader } from '@/components/primitives/section'
import { SanityImage } from '@/components/sanity-image'
import { PortableTextRenderer } from '@/components/portable-text'
import { InquiryCta } from './inquiry-cta'
import type { ExpeditionProductItem, ExpeditionProductsBlockValue } from './types'

export type ExpeditionProductsBlockProps = ExpeditionProductsBlockValue & { locale: string }

export function ExpeditionProductsBlock({
  heading,
  intro,
  products,
  displayMode,
  locale,
}: ExpeditionProductsBlockProps) {
  if (!products?.length) return null

  const mode = stegaClean(displayMode) ?? 'cards'

  return (
    <Section>
      <SectionHeader level={2} heading={heading} intro={intro} />
      {mode === 'comparisonTable' ? <ComparisonTable products={products} /> : null}
      {mode === 'cards' ? (
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} locale={locale} />
          ))}
        </div>
      ) : null}
      {mode === 'detailed' ? (
        <div className="mt-14 flex flex-col gap-20">
          {products.map((product) => (
            <ProductDetail key={product._id} product={product} locale={locale} />
          ))}
        </div>
      ) : null}
    </Section>
  )
}

const COMPARISON_COLUMNS = [
  { key: 'idealFor', label: 'Ideal for' },
  { key: 'duration', label: 'Duration' },
  { key: 'recommendedGroupSize', label: 'Group size' },
  { key: 'strategicOutcome', label: 'Primary outcome' },
  { key: 'deliverables', label: 'Potential deliverables' },
  { key: 'engagementModel', label: 'Engagement model' },
] as const satisfies readonly { key: keyof ExpeditionProductItem; label: string }[]

function ComparisonTable({ products }: { products: readonly ExpeditionProductItem[] }) {
  const columns = COMPARISON_COLUMNS

  return (
    <div className="border-border mt-14 overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[720px] border-collapse text-start text-sm">
        <thead>
          <tr className="border-border bg-muted border-b">
            <th className="text-foreground p-4 text-start font-semibold">Product</th>
            {columns.map((column) => (
              <th key={column.key} className="text-foreground p-4 text-start font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-border border-b last:border-b-0">
              <th scope="row" className="text-foreground p-4 text-start font-semibold">
                {product.title}
              </th>
              {columns.map((column) => {
                const value = product[column.key]
                return (
                  <td key={column.key} className="text-muted-foreground p-4 align-top">
                    {Array.isArray(value) ? value.join(', ') : (value ?? '')}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FactList({ product }: { product: ExpeditionProductItem }) {
  const facts = [
    { label: 'Ideal for', value: product.idealFor },
    { label: 'Duration', value: product.duration },
    { label: 'Recommended group size', value: product.recommendedGroupSize },
  ].filter((fact) => fact.value)

  if (!facts.length) return null

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {facts.map((fact) => (
        <div key={fact.label} className="border-border border-s-2 ps-4">
          <dt className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {fact.label}
          </dt>
          <dd className="text-foreground mt-1 text-sm leading-relaxed">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function ProductCard({ product, locale }: { product: ExpeditionProductItem; locale: string }) {
  const image = product.images?.[0]

  return (
    <div className="border-border bg-card flex flex-col gap-6 rounded-lg border p-8">
      {image?.asset ? (
        <SanityImage
          image={image}
          width={800}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="aspect-video h-auto w-full rounded-lg object-cover"
        />
      ) : null}
      <div className="flex flex-col gap-3">
        {product.title ? (
          <h3 className="text-foreground text-xl font-semibold tracking-tight">{product.title}</h3>
        ) : null}
        {product.shortDescription ? (
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            {product.shortDescription}
          </p>
        ) : null}
      </div>
      <FactList product={product} />
      <div className="mt-2">
        <InquiryCta
          label={product.ctaLabel}
          inquiryType={product.ctaInquiryType}
          locale={locale}
          variant="secondary"
          size="default"
        />
      </div>
    </div>
  )
}

function ProductDetail({ product, locale }: { product: ExpeditionProductItem; locale: string }) {
  return (
    <article className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-start">
        {product.title ? (
          <h3 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.title}
          </h3>
        ) : null}
        {product.shortDescription ? (
          <p className="text-muted-foreground max-w-3xl text-base leading-relaxed text-pretty sm:text-lg">
            {product.shortDescription}
          </p>
        ) : null}
      </div>

      {product.images?.[0]?.asset ? (
        <SanityImage
          image={product.images[0]}
          width={1400}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="aspect-21/9 h-auto w-full rounded-lg object-cover"
        />
      ) : null}

      <FactList product={product} />

      {product.fullDescription?.length ? (
        <div className="text-foreground max-w-3xl text-base leading-relaxed">
          <PortableTextRenderer value={product.fullDescription} locale={locale} />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {product.includedItems?.length ? (
          <div className="flex flex-col gap-3">
            <h4 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              What is included
            </h4>
            <ul className="flex flex-col gap-2">
              {product.includedItems.map((item, index) => (
                <li key={index} className="text-muted-foreground text-sm leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {product.potentialOutcomes?.length ? (
          <div className="flex flex-col gap-3">
            <h4 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              Potential outcomes
            </h4>
            <ul className="flex flex-col gap-2">
              {product.potentialOutcomes.map((item, index) => (
                <li key={index} className="text-muted-foreground text-sm leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div>
        <InquiryCta
          label={product.ctaLabel}
          inquiryType={product.ctaInquiryType}
          locale={locale}
          size="lg"
        />
      </div>
    </article>
  )
}
