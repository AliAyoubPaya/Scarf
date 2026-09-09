import type { CatalogProduct, CatalogVariant, ProductTabId } from "../catalog/products";
import type { CollectionProduct, Fabric } from "../catalog/collections";

type WooImage = { src: string; alt?: string };
type Attribute = { name: string; option?: string; options?: string[] };
export type WooProduct = {
  id: number; name: string; slug: string; type: string; status: string;
  catalog_visibility?: string; price: string; stock_status: string; purchasable?: boolean;
  images: WooImage[]; attributes: Attribute[]; categories: { slug: string }[];
  tags: { slug: string }[]; date_modified_gmt: string;
  meta_data?: { key: string; value: unknown }[];
};
export type WooVariation = {
  id: number; status: string; price: string; stock_status: string; purchasable?: boolean;
  image?: WooImage; attributes: { name: string; option: string }[];
};
export function plainText(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#0*39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
}
function images(entries: WooImage[], name: string): CatalogProduct["images"] {
  return entries.filter((image) => { try { return new URL(image.src).protocol === "https:"; } catch { return false; } })
    .map((image) => ({ src: image.src, alt: plainText(image.alt || name) }));
}
export const isColorAttribute = (name: string) => /^(pa[_-])?(colou?r|shade)$/i.test(name);
const swatchColors: Record<string, string> = { black: "#282724", ivory: "#eee5d3", white: "#f7f4ed", navy: "#283047", blue: "#637994", pink: "#c39e95", rose: "#c39e95", green: "#99a285", sage: "#99a285", pistachio: "#99a285", brown: "#896951", cocoa: "#896951", beige: "#c7b397" };
export function swatchFor(color: string) { return Object.entries(swatchColors).find(([name]) => color.toLowerCase().includes(name))?.[1]; }
export function normalizeProduct(product: WooProduct, variations: WooVariation[]): CollectionProduct | null {
  if (product.status !== "publish" || product.catalog_visibility === "hidden" || !["simple", "variable"].includes(product.type)) return null;
  const name = plainText(product.name);
  const placeholder = [{ src: "/images/product-placeholder.svg", alt: `Photo not yet available for ${name}` }];
  const parentImages = images(product.images || [], name);
  const colors = [...(product.attributes || []).filter((a) => isColorAttribute(a.name)).flatMap((a) => a.options || []),
    ...variations.filter((v) => v.status === "publish").flatMap((v) => v.attributes.filter((a) => isColorAttribute(a.name)).map((a) => a.option))]
    .map(plainText).filter(Boolean);
  if (new Set(colors.map((color) => color.toLowerCase())).size > 1) {
    throw new Error(`Product ${product.id}: create a separate WooCommerce product for each colour and link them with _hs_color_group.`);
  }
  const parentColor = colors[0] || "Original";
  const groupValue = product.meta_data?.find((entry) => entry.key === "_hs_color_group")?.value;
  const colorGroup = typeof groupValue === "string" && /^[a-z0-9][a-z0-9_-]{0,79}$/i.test(groupValue.trim()) ? groupValue.trim().toLowerCase() : undefined;
  const variant = (source: WooVariation): CatalogVariant => {
    const attributes = source.attributes.map((a) => ({ name: plainText(a.name), option: plainText(a.option) }));
    const color = parentColor;
    // Every parent is one colour; size options can safely share its full gallery.
    const ownImages = source.image ? images([source.image], name) : [];
    const validPrice = source.price !== "" && Number.isFinite(Number(source.price)) && Number(source.price) >= 0;
    return {
      id: `woo-variant-${source.id}`, wooId: source.id, color,
      label: attributes.filter((a) => !isColorAttribute(a.name)).map((a) => a.option).join(" / ") || color,
      swatch: swatchFor(color), attributes, price: validPrice ? Number(source.price) : 0,
      images: ownImages.length ? [...ownImages, ...parentImages.filter((image) => image.src !== ownImages[0].src)] : parentImages.length ? parentImages : placeholder,
      stockStatus: source.stock_status === "outofstock" ? "sold-out" : "in-stock",
      backorder: source.stock_status === "onbackorder",
      purchasable: source.purchasable !== false && validPrice && source.stock_status !== "outofstock" && attributes.every((a) => a.option !== ""),
    };
  };
  const simpleColor = product.attributes?.find((a) => isColorAttribute(a.name))?.options?.[0] || "Original";
  const variants = product.type === "variable" ? variations.filter((v) => v.status === "publish").map(variant) : [variant({ id: product.id, status: product.status, price: product.price, stock_status: product.stock_status, purchasable: product.purchasable, attributes: [{ name: "Color", option: simpleColor }] })];
  if (!variants.length) return null;
  const selected = variants.find((v) => v.purchasable) || variants[0];
  const slugs = [...(product.categories || []), ...(product.tags || [])].map((c) => c.slug);
  const fabricMap: Record<string, Fabric> = { modal: "Modal", chiffon: "Chiffon", silk: "Silk & satin", satin: "Silk & satin", jersey: "Jersey", georgette: "Georgette" };
  const fabric = slugs.map((slug) => fabricMap[slug]).find(Boolean) || "Other";
  const tabs = (["new-in", "best-sellers", "occasion"] as ProductTabId[]).filter((tab) => slugs.includes(tab));
  const shadeNames: Record<string, string> = { black: "Black", ivory: "Ivory", white: "Ivory", navy: "Blue", blue: "Blue", pink: "Pink", rose: "Pink", green: "Green", sage: "Green", pistachio: "Green", brown: "Brown", cocoa: "Brown", beige: "Brown" };
  const shadeKey = Object.keys(swatchColors).find((shade) => selected.color.toLowerCase().includes(shade));
  return { id: `woo-${product.id}`, source: { provider: "woocommerce", externalId: product.id }, slug: product.slug, name, colorGroup, color: selected.color, price: selected.price, currency: "PKR", images: parentImages.length ? parentImages : selected.images, stockStatus: variants.some((v) => v.purchasable) ? "in-stock" : "sold-out", colorCount: new Set(variants.map((v) => v.color)).size, tabs, fabric, shade: shadeKey ? shadeNames[shadeKey] : "Printed", variants, commerce: { synced: true, purchasable: variants.some((v) => v.purchasable), type: product.type as "simple" | "variable" } };
}
