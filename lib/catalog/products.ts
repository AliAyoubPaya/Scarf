export type ProductTabId = "new-in" | "best-sellers" | "occasion";

export type CatalogTab = {
  id: ProductTabId;
  label: string;
};

export type CatalogProduct = {
  /** Explicit sibling-product family, never inferred from fabric or title. */
  colorGroup?: string;
  variants?: CatalogVariant[];
  commerce?: { synced: boolean; purchasable: boolean; type: "simple" | "variable" };
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

export type CatalogVariant = {
  backorder?: boolean;
  id: string;
  wooId: number | null;
  color: string;
  label: string;
  swatch?: string;
  price: number;
  images: CatalogProduct["images"];
  stockStatus: CatalogProduct["stockStatus"];
  purchasable: boolean;
  attributes: { name: string; option: string }[];
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
  {
    id: "catalog-07",
    source: { provider: "woocommerce", externalId: 2107 },
    slug: "terracotta-botanical-silk-hijab",
    name: "Terracotta Botanical Silk Hijab",
    color: "Burnished Clay",
    price: 3650,
    currency: "PKR",
    images: [
      {
        src: "/images/products/terracotta-botanical-silk.png",
        alt: "Woman wearing a terracotta botanical silk hijab",
      },
      {
        src: "/images/products/terracotta-botanical-silk-alt.png",
        alt: "Alternate view of a terracotta botanical silk hijab",
      },
    ],
    stockStatus: "in-stock",
    colorCount: 4,
    tabs: ["best-sellers", "occasion"],
  },
  {
    id: "catalog-08",
    source: { provider: "woocommerce", externalId: 2108 },
    slug: "cocoa-cloud-modal-hijab",
    name: "Cocoa Cloud Modal Hijab",
    color: "Cocoa Brown",
    price: 2950,
    currency: "PKR",
    images: [
      {
        src: "/images/products/cocoa-modal-hijab.png",
        alt: "Woman wearing a cocoa brown modal hijab",
      },
      {
        src: "/images/products/cocoa-modal-hijab-alt.png",
        alt: "Alternate view of a cocoa brown modal hijab",
      },
    ],
    stockStatus: "in-stock",
    colorCount: 11,
    tabs: ["best-sellers"],
  },
  {
    id: "catalog-09",
    source: { provider: "woocommerce", externalId: 2109 },
    slug: "noir-crinkle-chiffon-hijab",
    name: "Noir Crinkle Chiffon Hijab",
    color: "Deep Black",
    price: 2550,
    currency: "PKR",
    images: [
      {
        src: "/images/products/black-crinkle-chiffon.png",
        alt: "Woman wearing a black crinkle chiffon hijab",
      },
      {
        src: "/images/products/black-crinkle-chiffon-alt.png",
        alt: "Alternate view of a black crinkle chiffon hijab",
      },
    ],
    stockStatus: "sold-out",
    colorCount: 7,
    tabs: ["best-sellers", "occasion"],
  },
  {
    id: "catalog-10",
    source: { provider: "woocommerce", externalId: 2110 },
    slug: "marble-ink-georgette-hijab",
    name: "Marble Ink Georgette Hijab",
    color: "Ivory Charcoal",
    price: 3350,
    currency: "PKR",
    images: [
      {
        src: "/images/products/ivory-charcoal-georgette.png",
        alt: "Woman wearing an ivory and charcoal georgette hijab",
      },
      {
        src: "/images/products/ivory-charcoal-georgette-alt.png",
        alt: "Alternate view of an ivory and charcoal georgette hijab",
      },
    ],
    stockStatus: "in-stock",
    colorCount: 3,
    tabs: ["best-sellers", "occasion"],
  },
];
