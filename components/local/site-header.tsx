"use client";

import Link from "next/link";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { SiteContainer } from "@/components/local/site-container";

type NavigationItem = {
  label: string;
  href: string;
  accent?: boolean;
  children?: Array<{ label: string; href: string }>;
};

const navigationItems: NavigationItem[] = [
  { label: "New In", href: "/collections/new-in" },
  {
    label: "Chiffon",
    href: "/collections/chiffon",
    children: [
      { label: "Everyday Chiffon", href: "/collections/everyday-chiffon" },
      { label: "Premium Chiffon", href: "/collections/premium-chiffon" },
      { label: "Printed Chiffon", href: "/collections/printed-chiffon" },
    ],
  },
  {
    label: "Silk",
    href: "/collections/silk",
    children: [
      { label: "Satin Silk", href: "/collections/satin-silk" },
      { label: "Textured Silk", href: "/collections/textured-silk" },
      { label: "Organza", href: "/collections/organza" },
    ],
  },
  {
    label: "Modal",
    href: "/collections/modal",
    children: [
      { label: "Modal Solids", href: "/collections/modal-solids" },
      { label: "Printed Modal", href: "/collections/printed-modal" },
    ],
  },
  { label: "Jersey", href: "/collections/jersey" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Our Story", href: "/pages/our-story" },
  { label: "Sale", href: "/collections/sale", accent: true },
];

const iconButtonClass =
  "inline-flex size-11 items-center justify-center text-[#262521] transition-colors hover:text-[#b52f2a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#262521] focus-visible:ring-offset-2";

function BrandMark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex w-fit flex-col items-center font-heading text-[#22211e]"
      aria-label="SCARF home"
    >
      <span className="translate-x-[0.13em] text-[1.35rem] font-medium leading-none tracking-[0.26em] sm:text-[1.55rem]">
        SCARF
      </span>
      <span className="mt-1 translate-x-[0.15em] text-[0.48rem] font-medium leading-none tracking-[0.3em] text-[#77736c]">
        PAKISTAN
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white font-heading text-[#262521] shadow-[0_1px_0_rgba(35,33,29,0.09)] [&_a]:focus-visible:outline-none [&_a]:focus-visible:ring-1 [&_a]:focus-visible:ring-[#262521] [&_a]:focus-visible:ring-offset-2 [&_button]:cursor-pointer">
      <div className="border-b border-[#e9e6e0] bg-[#f6f4f0] text-[0.72rem] font-medium tracking-[0.08em] text-[#4d4a44]">
        <SiteContainer className="flex h-8 items-center justify-center sm:h-9 sm:justify-between">
          <p className="font-paragraph text-[0.72rem] tracking-[0.035em]">
            <span className="sm:hidden">Free delivery over Rs. 5,000</span>
            <span className="hidden sm:inline">Complimentary delivery on orders over Rs. 5,000</span>
          </p>
          <p className="hidden items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.12em] sm:flex">
            Pakistan · PKR
            <ChevronDown aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </p>
        </SiteContainer>
      </div>

      <SiteContainer className="grid h-[4.65rem] grid-cols-[1fr_auto_1fr] items-center px-3 sm:h-20 sm:px-6 lg:px-10">
        <div className="flex items-center justify-start lg:hidden">
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen(true);
            }}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
          >
            <Menu aria-hidden="true" className="size-[1.3rem]" strokeWidth={1.45} />
          </button>
        </div>

        <div className="hidden justify-self-start lg:block">
          <BrandMark />
        </div>
        <div className="justify-self-center lg:hidden">
          <BrandMark />
        </div>

        <nav
          aria-label="Main navigation"
          className="hidden h-full items-stretch justify-center lg:flex [&>ul>li>a]:flex [&>ul>li>a]:h-full [&>ul>li>a]:items-center [&>ul>li>a]:px-3 [&>ul>li>a]:text-[0.71rem] [&>ul>li>a]:font-medium [&>ul>li>a]:uppercase [&>ul>li>a]:tracking-[0.12em] [&>ul>li>a]:transition-colors xl:[&>ul>li>a]:px-[1.05rem]"
        >
          <ul className="flex h-full items-stretch">
            {navigationItems.map((item) => (
              <li key={item.label} className="group relative flex h-full items-stretch">
                <Link
                  href={item.href}
                  className={item.accent ? "text-[#bd302c]" : "hover:text-[#a62d29]"}
                >
                  {item.label}
                  {item.children ? (
                    <ChevronDown
                      aria-hidden="true"
                      className="ml-1 size-3 transition-transform duration-200 group-hover:rotate-180"
                      strokeWidth={1.4}
                    />
                  ) : null}
                </Link>

                {item.children ? (
                  <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 translate-y-2 border border-[#e7e3dc] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(38,37,33,0.1)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <ul className="[&_a]:flex [&_a]:min-h-10 [&_a]:items-center [&_a]:px-3 [&_a]:font-paragraph [&_a]:text-sm [&_a]:text-[#4e4b45] [&_a]:transition-colors [&_a:hover]:bg-[#f7f5f1] [&_a:hover]:text-[#22211e]">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link href={child.href}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end lg:gap-0.5">
          <button
            type="button"
            className={iconButtonClass}
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((open) => !open);
            }}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
          >
            {searchOpen ? (
              <X aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.45} />
            ) : (
              <Search aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.45} />
            )}
          </button>
          <span className="hidden sm:block">
            <Link href="/account" className={iconButtonClass} aria-label="Account">
              <UserRound aria-hidden="true" className="size-[1.18rem]" strokeWidth={1.4} />
            </Link>
          </span>
          <Link href="/cart" className={`${iconButtonClass} relative`} aria-label="Shopping bag, 0 items">
            <ShoppingBag aria-hidden="true" className="size-[1.18rem]" strokeWidth={1.4} />
            <span className="absolute right-0.5 top-1.5 flex size-[1.05rem] items-center justify-center rounded-full bg-[#262521] font-paragraph text-[0.58rem] font-medium text-white">
              0
            </span>
          </Link>
        </div>
      </SiteContainer>

      <div
        className={`absolute inset-x-0 top-full overflow-hidden border-t border-[#ece9e4] bg-white shadow-[0_12px_30px_rgba(38,37,33,0.08)] transition-[max-height,opacity] duration-300 ${
          searchOpen ? "max-h-28 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <SiteContainer>
          <form action="/search" className="flex h-24 items-center" role="search">
            <label htmlFor="site-search" className="sr-only">
              Search scarves and accessories
            </label>
            <div className="flex w-full items-center border-b border-[#817d75] pb-2 [&_svg]:shrink-0">
              <Search
                aria-hidden="true"
                className="mr-3 size-5 text-[#625f59]"
                strokeWidth={1.35}
              />
              <input
                id="site-search"
                name="q"
                type="search"
                autoComplete="off"
                placeholder="Search scarves and accessories"
                className="h-10 min-w-0 flex-1 bg-transparent font-paragraph text-base text-[#262521] outline-none placeholder:text-[#88847d]"
              />
              <span className="hidden font-paragraph text-xs text-[#8a867f] sm:block">
                Press enter to search
              </span>
            </div>
          </form>
        </SiteContainer>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-black/25 backdrop-blur-[1px]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
          />
          <div className="relative flex h-full w-[min(90vw,25rem)] flex-col bg-[#fffefd] shadow-[18px_0_50px_rgba(32,30,26,0.14)]">
            <div className="flex min-h-[5rem] items-center justify-between border-b border-[#e8e4de] px-5">
              <BrandMark onClick={() => setMenuOpen(false)} />
              <button type="button" className={iconButtonClass} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X aria-hidden="true" className="size-5" strokeWidth={1.4} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile navigation">
              <ul className="divide-y divide-[#ece9e3] [&_a]:flex [&_a]:min-h-14 [&_a]:items-center [&_a]:text-sm [&_a]:font-medium [&_a]:uppercase [&_a]:tracking-[0.12em] [&_button]:flex [&_button]:min-h-14 [&_button]:w-full [&_button]:items-center [&_button]:justify-between [&_button]:text-left [&_button]:text-sm [&_button]:font-medium [&_button]:uppercase [&_button]:tracking-[0.12em]">
                {navigationItems.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setExpandedItem(expandedItem === item.label ? null : item.label)}
                          aria-expanded={expandedItem === item.label}
                        >
                          {item.label}
                          <ChevronDown
                            aria-hidden="true"
                            className={`size-4 transition-transform ${expandedItem === item.label ? "rotate-180" : ""}`}
                            strokeWidth={1.4}
                          />
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ${
                            expandedItem === item.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <ul className="overflow-hidden pb-1 [&_a]:min-h-11 [&_a]:pl-3 [&_a]:font-paragraph [&_a]:text-sm [&_a]:font-normal [&_a]:normal-case [&_a]:tracking-normal [&_a]:text-[#66625b]">
                            <li>
                              <Link href={item.href} onClick={() => setMenuOpen(false)}>
                                Shop all {item.label}
                              </Link>
                            </li>
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link href={child.href} onClick={() => setMenuOpen(false)}>
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={item.accent ? "text-[#bd302c]" : ""}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-[#e8e4de] bg-[#f7f5f1] px-5 py-5 font-paragraph text-sm text-[#5d5952]">
              <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-2">
                <UserRound aria-hidden="true" className="size-[1.1rem]" strokeWidth={1.4} />
                Sign in or create an account
              </Link>
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#7a766f]">Pakistan · PKR</p>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
