import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { getCategoryByHandle } from "@lib/data/categories"
import ProductSection from "../components/product-section"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: string
  page?: string
  countryCode: string
}) => {
  const wineSections = [
    { handle: "branco", title: "Vinhos Brancos" },
    { handle: "tinto", title: "Vinhos Tintos" },
    { handle: "frisante", title: "Vinhos Frisantes" },
    { handle: "rose", title: "Vinhos Rosé" },
    { handle: "skin-contact", title: "Skin Contact" },
  ]

  const sections = await Promise.all(
    wineSections.map(async ({ handle, title }) => {
      try {
        const category = await getCategoryByHandle([handle])
        return { title, categoryId: category?.id, handle }
      } catch {
        return { title, categoryId: undefined, handle }
      }
    })
  )

  return (
    <div className="flex flex-col py-6 content-container" data-testid="store-container">
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">Nossos Vinhos</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          {sections.map((section, index) => (
            <ProductSection
              key={index}
              title={section.title}
              categoryId={section.categoryId}
              categoryHandle={section.handle}
              countryCode={countryCode}
            />
          ))}
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
