export type NavigationLink = { label: string; href: string };

export type NavigationPromo = NavigationLink & {
  image: string;
  imageAlt: string;
  eyebrow?: string;
};

export type NavigationMenu = {
  id: "shop" | "lookbooks";
  label: string;
  href: string;
  groups: Array<{ label: string; links: NavigationLink[] }>;
  promos: NavigationPromo[];
};

export type PrimaryNavigationItem = NavigationLink & {
  accent?: boolean;
  menuId?: NavigationMenu["id"];
};

export const navigationMenus: NavigationMenu[] = [
  {
    id: "shop",
    label: "Shop",
    href: "/collections/all",
    groups: [
      {
        label: "Discover",
        links: [
          { label: "Shop all", href: "/collections/all" },
          { label: "New in", href: "/collections/new-in" },
          { label: "Best sellers", href: "/collections/best-sellers" },
          { label: "Sale", href: "/collections/sale" },
        ],
      },
      {
        label: "Shop by fabric",
        links: [
          { label: "Chiffon", href: "/collections/chiffon" },
          { label: "Modal", href: "/collections/modal" },
          { label: "Silk", href: "/collections/silk" },
          { label: "Jersey", href: "/collections/jersey" },
        ],
      },
      {
        label: "Accessories",
        links: [
          { label: "Hijab magnets", href: "/collections/hijab-magnets" },
          { label: "Undercaps", href: "/collections/undercaps" },
          { label: "Gift sets", href: "/collections/gift-sets" },
        ],
      },
    ],
    promos: [
      {
        label: "New arrivals",
        href: "/collections/new-in",
        image: "/images/products/rose-satin-hijab.png",
        imageAlt: "Woman wearing a muted rose satin hijab",
        eyebrow: "Freshly added",
      },
      {
        label: "Best sellers",
        href: "/collections/best-sellers",
        image: "/images/products/pistachio-modal-hijab.png",
        imageAlt: "Woman wearing a pistachio modal hijab",
        eyebrow: "Most loved",
      },
      {
        label: "Occasion edit",
        href: "/collections/occasion",
        image: "/images/products/terracotta-botanical-silk.png",
        imageAlt: "Woman wearing a terracotta botanical silk hijab",
        eyebrow: "Dress-up moments",
      },
    ],
  },
  {
    id: "lookbooks",
    label: "Lookbooks",
    href: "/pages/lookbooks",
    groups: [
      {
        label: "Curated edits",
        links: [
          { label: "The botanical edit", href: "/pages/the-botanical-edit" },
          { label: "Everyday ease", href: "/pages/everyday-ease" },
          { label: "Evening glow", href: "/pages/evening-glow" },
        ],
      },
    ],
    promos: [
      {
        label: "Botanical",
        href: "/pages/the-botanical-edit",
        image: "/images/scarf-hero-desktop.png",
        imageAlt: "Woman in a printed scarf in a sunlit stone courtyard",
      },
      {
        label: "Everyday ease",
        href: "/pages/everyday-ease",
        image: "/images/shop-the-look-cocoa-modal.png",
        imageAlt: "Woman styling a cocoa modal hijab",
      },
      {
        label: "Evening glow",
        href: "/pages/evening-glow",
        image: "/images/products/ivory-charcoal-georgette.png",
        imageAlt: "Woman wearing an ivory and charcoal georgette hijab",
      },
    ],
  },
];

export const primaryNavigation: PrimaryNavigationItem[] = [
  { label: "Shop", href: "/collections/all", menuId: "shop" },
  { label: "Lookbooks", href: "/pages/lookbooks", menuId: "lookbooks" },
  { label: "Our story", href: "/pages/our-story" },
  { label: "Contact", href: "/pages/contact" },
  { label: "Sale", href: "/collections/sale", accent: true },
];
