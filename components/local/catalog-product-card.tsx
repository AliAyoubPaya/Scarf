"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { CatalogProduct } from "@/lib/catalog/products";

type CatalogProductCardProps = {
  product: CatalogProduct;
  compact?: boolean;
  imageSizes?: string;
};

function formatPrice(price: number) {
  return `Rs. ${new Intl.NumberFormat("en-PK").format(price)}`;
}

export function CatalogProductCard({
  product,
  compact = false,
  imageSizes = "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw",
}: CatalogProductCardProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const quickAddTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (quickAddTimerRef.current) clearTimeout(quickAddTimerRef.current);
    },
    [],
  );

  const stopPreview = () => {
    setIsPreviewing(false);
    setCurrentImage(0);
  };

  const handleQuickAdd = () => {
    setIsAdded(true);
    if (quickAddTimerRef.current) clearTimeout(quickAddTimerRef.current);

    window.dispatchEvent(
      new CustomEvent("scarf:quick-add", {
        detail: {
          productId: product.id,
          wooCommerceId: product.source.externalId,
        },
      }),
    );

    quickAddTimerRef.current = setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <article
      className="group min-w-0"
      onMouseEnter={() => setIsPreviewing(true)}
      onMouseLeave={stopPreview}
      onFocusCapture={() => setIsPreviewing(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) stopPreview();
      }}
    >
      <div
        className={`relative overflow-hidden bg-[#f3f1ec] ${
          compact ? "aspect-[9/10]" : "aspect-[4/5]"
        }`}
      >
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#3f4937]"
          aria-label={`View ${product.name}`}
        >
          {product.images.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={index === currentImage ? image.alt : ""}
              fill
              sizes={imageSizes}
              className={`object-cover transition-[opacity,transform] duration-500 ease-out ${
                index === currentImage
                  ? "scale-100 opacity-100"
                  : "scale-[1.015] opacity-0"
              }`}
            />
          ))}
        </Link>

        <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:hidden sm:inset-x-4 sm:top-4">
          {product.images.map((image, index) => (
            <span
              key={image.src}
              className="h-px flex-1 overflow-hidden bg-white/45 shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
            >
              {isPreviewing && index === currentImage ? (
                <span
                  key={`${product.id}-${currentImage}`}
                  className="block size-full origin-left animate-[catalog-preview-progress_3200ms_linear_forwards] bg-white"
                  onAnimationEnd={() =>
                    setCurrentImage((current) =>
                      current === product.images.length - 1 ? 0 : current + 1,
                    )
                  }
                />
              ) : index < currentImage ? (
                <span className="block size-full bg-white" />
              ) : null}
            </span>
          ))}
        </div>

        {product.stockStatus === "sold-out" ? (
          <span className="absolute right-3 top-3 z-30 bg-white px-3 py-2 font-heading text-[0.66rem] font-medium uppercase tracking-[0.12em] text-[#292823] sm:right-4 sm:top-4">
            Sold out
          </span>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`absolute inset-x-3 bottom-3 z-30 flex translate-y-0 items-center justify-center bg-white px-4 font-heading font-medium uppercase tracking-[0.13em] text-[#292823] shadow-[0_6px_24px_rgba(35,32,25,0.12)] transition duration-300 hover:bg-[#272620] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4937] md:translate-y-[calc(100%+0.75rem)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 ${
              compact
                ? "min-h-10 text-[0.62rem] sm:min-h-11 sm:text-[0.66rem]"
                : "min-h-12 text-[0.7rem]"
            }`}
            aria-label={`Quick add ${product.name} to bag`}
          >
            {isAdded ? "Added to bag" : "Quick add"}
          </button>
        )}
      </div>

      <Link
        href={`/products/${product.slug}`}
        className={`block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3f4937] [&_p]:font-paragraph ${
          compact ? "pt-3 sm:pt-3.5" : "pt-4 sm:pt-[1.1rem]"
        }`}
      >
        <h3
          className={`font-heading font-medium leading-snug tracking-[-0.01em] ${
            compact
              ? "text-[0.78rem] sm:text-[0.86rem]"
              : "text-[0.95rem] sm:text-base"
          }`}
        >
          {product.name}
        </h3>
        <p
          className={`mt-1 text-[#4d4b45] ${
            compact
              ? "text-[0.7rem] leading-4 sm:text-[0.78rem] sm:leading-5"
              : "text-sm leading-5 sm:mt-1.5 sm:text-[0.93rem]"
          }`}
        >
          {product.color} <span aria-hidden="true">|</span>{" "}
          {formatPrice(product.price)}
        </p>
        {product.stockStatus === "sold-out" ? (
          <p
            className={`mt-1 italic text-[#7a3430] ${
              compact ? "text-[0.7rem] sm:text-xs" : "text-sm"
            }`}
          >
            Sold out
          </p>
        ) : null}
        <p
          className={`font-medium uppercase tracking-[0.1em] text-[#66635c] ${
            compact
              ? "mt-1.5 text-[0.58rem] leading-4 sm:text-[0.65rem]"
              : "mt-2 text-[0.7rem] sm:text-xs"
          }`}
        >
          {product.colorCount} colors available
        </p>
      </Link>
    </article>
  );
}
