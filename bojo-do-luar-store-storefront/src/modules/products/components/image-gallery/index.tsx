"use client"

import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images.length) return null

  return (
    <div className="flex flex-col items-center relative">
      {/* Main Image */}
      <div className="flex flex-col flex-1 small:mx-16 mb-9 mt-14">
        <Container
          className="relative aspect-[16/9] w-full max-w-xl overflow-hidden bg-ui-bg-subtle"
          id={images[selectedIndex].id}
        >
          {!!images[selectedIndex].url && (
            <Image
              src={images[selectedIndex].url}
              priority={true}
              className="absolute inset-0 rounded-rounded cursor-pointer"
              alt={`Product image ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              style={{
                objectFit: "cover",
              }}
            />
          )}
        </Container>
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`relative w-16 h-16 overflow-hidden bg-ui-bg-subtle rounded cursor-pointer border-2 ${
              index === selectedIndex ? "border-ui-fg-base" : "border-transparent"
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            {!!image.url && (
              <Image
                src={image.url}
                className="absolute inset-0"
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="64px"
                style={{
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
