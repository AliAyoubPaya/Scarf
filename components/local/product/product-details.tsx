"use client";

import type { CollectionProduct } from "@/lib/catalog/collections";
import type { CatalogVariant } from "@/lib/catalog/products";
import { ProductGallery } from "@/components/local/product/product-gallery";
import { ProductInformation } from "@/components/local/product/product-information";

export function ProductDetails({ product, colors, variant, ready }: { product: CollectionProduct; colors: CollectionProduct[]; variant: CatalogVariant; ready: boolean }) {
  const selectedProduct = { ...product, color: variant.color, price: variant.price, images: variant.images, stockStatus: variant.stockStatus };
  return <section aria-label="Product details" className="grid items-start gap-8 pb-12 md:grid-cols-[1.1fr_1fr] md:gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16 lg:pb-20">
    <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
      <ProductGallery key={variant.id} product={selectedProduct} />
    </div>
    <div className="min-w-0">
      <ProductInformation product={product} variant={variant} colors={colors} ready={ready} />
    </div>
  </section>;
}
