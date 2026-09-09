import type { CollectionProduct, Fabric } from "@/lib/catalog/collections";

const fabricStories: Record<Fabric, string> = {
  Other: "Find your own way to wear it. Pair this scarf with your favourite layers, and ask our team if you would like more details about the fabric and finish.",
  Modal: "An understated finish for your everyday wardrobe. Style it in relaxed folds, pair it with your favourite neutrals, and make the look your own.",
  Chiffon: "A beautifully understated accent for everyday dressing and special plans alike. Let the folds frame your look, from tonal layers to a contrasting outfit.",
  "Silk & satin": "A polished touch for your scarf collection. Pair this shade with a simple silhouette for an evening look, or make it the finishing detail of your everyday outfit.",
  Jersey: "A simple, versatile starting point for your everyday styling. Wear it with relaxed layers or a tailored outfit for a look that feels like you.",
  Georgette: "Give your outfit a little more expression. Style with a pared-back palette to let the scarf take centre stage, or layer with complementary tones.",
};

export function productStory(product: CollectionProduct) { return product.description || product.shortDescription || fabricStories[product.fabric]; }
export function relatedProducts(product: CollectionProduct, catalog: CollectionProduct[]) {
  return catalog.filter((item) => item.id !== product.id)
    .sort((a, b) => Number(b.fabric === product.fabric) - Number(a.fabric === product.fabric))
    .slice(0, 4);
}
export function productEnquiry(product: CollectionProduct, quantity: number, url: string) {
  return `Hello HS by Saman! I'd like to ask about ${product.name}.\nShade: ${product.color}\nQuantity: ${quantity}\n${url}\nPlease confirm availability, dimensions and delivery details. Thank you!`;
}
