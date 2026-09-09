"use client";

import type { CollectionProduct } from "@/lib/catalog/collections";
import type { CatalogVariant } from "@/lib/catalog/products";
import { ProductGallery } from "@/components/local/product/product-gallery";
import { ProductInformation } from "@/components/local/product/product-information";

export function ProductDetails({ product, colors, variant, ready }: { product: CollectionProduct; colors: CollectionProduct[]; variant: CatalogVariant; ready: boolean }) {
  const selectedProduct = { ...product, color: variant.color, price: variant.price, images: variant.images, stockStatus: variant.stockStatus };
  return <section aria-label="Product details" className="grid items-start gap-8 pb-12 md:grid-cols-[1.1fr_1fr] md:gap-8 lg:gap-16 lg:pb-20">
    <ProductGallery key={variant.id} product={selectedProduct} />
    <ProductInformation product={product} variant={variant} colors={colors} ready={ready} />
  </section>;
}
