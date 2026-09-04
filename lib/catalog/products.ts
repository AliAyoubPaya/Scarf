export type ProductTabId = "new-in" | "best-sellers" | "occasion";

export type CatalogTab = {
  id: ProductTabId;
  label: string;
};

export type CatalogProduct = {
  id: string;
  source: {
    provider: "woocommerce";
    externalId: number;
  };
  slug: string;
  name: string;
  color: string;
  price: number;
  currency: "PKR";
  images: {
    src: string;
    alt: string;
  }[];
  stockStatus: "in-stock" | "sold-out";
  colorCount: number;
  tabs: ProductTabId[];
};

export const catalogTabs: CatalogTab[] = [
  { id: "new-in", label: "New in" },
  { id: "best-sellers", label: "Best sellers" },
  { id: "occasion", label: "Occasion" },
];

export const featuredProducts: CatalogProduct[] = [
  {
    id: "catalog-01",
    source: { provider: "woocommerce", externalId: 2101 },
    slug: "olive-mist-modal-hijab",
    name: "Olive Mist Modal Hijab",
    color: "Pistachio",
    price: 2850,
    currency: "PKR",
    images: [
      {
        src: "/images/products/pistachio-modal-hijab.png",
        alt: "Woman wearing a pistachio green modal hijab",
      },
      {
        src: "/images/products/pistachio-modal-hijab-alt.png",
        alt: "Alternate view of a pistachio green modal hijab",
      },
    ],
    stockStatus: "in-stock",
    colorCount: 8,
    tabs: ["new-in", "best-sellers"],
  },
  {
    id: "catalog-02",
    source: { provider: "woocommerce", externalId: 2102 },
    slug: "rose-dust-satin-hijab",
    name: "Rose Dust Satin Hijab",
    color: "Muted Rose",
    price: 3200,
    currency: "PKR",
    images: [
      {
        src: "/images/products/rose-satin-hijab.png",
        alt: "Woman wearing a muted rose satin hijab",
      },
      {
        src: "/images/products/rose-satin-hijab-alt.png",
        alt: "Alternate view of a muted rose satin hijab",
      },
    ],
    stockStatus: "in-stock",
    colorCount: 6,
    tabs: ["new-in", "occasion"],
  },
  {
    id: "catalog-03",
    source: { provider: "woocommerce", externalId: 2103 },
    slug: "soft-pearl-chiffon-hijab",
    name: "Soft Pearl Chiffon Hijab",
    color: "Warm Ivory",
    price: 2450,
    currency: "PKR",
    images: [
      {
        src: "/images/products/ivory-chiffon-hijab.png",
        alt: "Woman wearing an airy ivory chiffon hijab",
      },
      {
        src: "/images/products/ivory-chiffon-hijab-alt.png",
        alt: "Alternate view of an airy ivory chiffon hijab",
      },
    ],
    stockStatus: "in-stock",
    colorCount: 12,
    tabs: ["new-in", "best-sellers", "occasion"],
  },
  {
    id: "catalog-04",
    source: { provider: "woocommerce", externalId: 2104 },
    slug: "midnight-flow-jersey-hijab",
    name: "Midnight Flow Jersey Hijab",
    color: "Midnight Navy",
    price: 2650,
    currency: "PKR",
    images: [
      {
        src: "/images/products/midnight-jersey-hijab.png",
        alt: "Woman wearing a midnight navy jersey hijab",
      },
      {
        src: "/images/products/midnight-jersey-hijab-alt.png",
        alt: "Alternate view of a midnight navy jersey hijab",
      },
    ],
    stockStatus: "sold-out",
    colorCount: 9,
    tabs: ["new-in", "best-sellers"],
  },
  {
    id: "catalog-05",
    source: { provider: "woocommerce", externalId: 2105 },
    slug: "sage-everyday-modal-hijab",
    name: "Sage Everyday Modal Hijab",
    color: "Soft Sage",
    price: 2750,
    currency: "PKR",
    images: [
      {
        src: "/images/products/pistachio-modal-hijab.png",
        alt: "Woman wearing a soft sage modal hijab",
      },
      {
        src: "/images/products/pistachio-modal-hijab-alt.png",
        alt: "Alternate view of a soft sage modal hijab",
      },
    ],
    stockStatus: "in-stock",
    colorCount: 10,
    tabs: ["best-sellers"],
  },
  {
    id: "catalog-06",
    source: { provider: "woocommerce", externalId: 2106 },
    slug: "blush-evening-silk-hijab",
    name: "Blush Evening Silk Hijab",
    color: "Antique Blush",
    price: 3450,
    currency: "PKR",
    images: [
      {
        src: "/images/products/rose-satin-hijab.png",
        alt: "Woman wearing an antique blush silk hijab",
      },
      {
        src: "/images/products/rose-satin-hijab-alt.png",
        alt: "Alternate view of an antique blush silk hijab",
      },
    ],
    stockStatus: "in-stock",
    colorCount: 5,
    tabs: ["occasion"],
  },
];
