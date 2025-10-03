import React from "react"
import PaginatedProducts from "../templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductSectionProps = {
  title: string
  categoryId?: string
  categoryHandle?: string
  countryCode: string
}

const ProductSection: React.FC<ProductSectionProps> = async ({
  title,
  categoryId,
  categoryHandle,
  countryCode,
}) => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-semibold mb-6">{title}</h2>
      <PaginatedProducts
        page={1}
        categoryId={categoryId}
        countryCode={countryCode}
        limit={8}
      />
      {categoryHandle && (
        <div className="mt-4 text-right">
          <LocalizedClientLink
            href={`/categories/${categoryHandle}`}
            className="text-primary-600 hover:underline"
          >
            Ver mais &rarr;
          </LocalizedClientLink>
        </div>
      )}
    </section>
  )
}

export default ProductSection
