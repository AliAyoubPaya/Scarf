"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search, UserRound, X } from "lucide-react";
import { CartBagLink } from "@/components/local/cart/cart-bag-link";
import { useCallback, useEffect, useState } from "react";

import { BrandLogo } from "@/components/local/brand-logo";
import { DesktopNavigation } from "@/components/local/desktop-navigation";
import { MobileNavigation } from "@/components/local/mobile-navigation";
import { SiteContainer } from "@/components/local/site-container";
import type { NavigationMenu } from "@/lib/navigation";

const iconButtonClass =
  "inline-flex size-11 shrink-0 items-center justify-center text-[#262521] transition-colors hover:text-brand-gold-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold-ink focus-visible:ring-offset-2";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<NavigationMenu["id"] | null>(null);

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!desktopMenu) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDesktopMenu(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [desktopMenu]);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white font-heading text-[#262521] shadow-[0_1px_0_rgba(35,33,29,0.09)] [&_a]:focus-visible:outline-none [&_a]:focus-visible:ring-1 [&_a]:focus-visible:ring-brand-gold-ink [&_a]:focus-visible:ring-offset-2 [&_button]:cursor-pointer"
      onMouseLeave={() => setDesktopMenu(null)}
    >
      <div className="border-b border-brand-gold-line bg-brand-gold-soft text-[0.72rem] font-medium tracking-[0.08em] text-[#4d4a44]">
        <SiteContainer width="full" className="flex h-8 items-center justify-center sm:h-9 sm:justify-between">
          <p className="font-paragraph text-[0.72rem] tracking-[0.035em]">
            <span className="sm:hidden">Free delivery over Rs. 5,000</span>
            <span className="hidden sm:inline">Complimentary delivery on orders over Rs. 5,000</span>
          </p>
          <div className="hidden items-center gap-6 text-[0.64rem] uppercase tracking-[0.11em] sm:flex">
            <button type="button" className="flex items-center gap-1.5">
              Pakistan · PKR
              <ChevronDown aria-hidden="true" className="size-3" strokeWidth={1.5} />
            </button>
            <button type="button" className="flex items-center gap-1.5">
              English
              <ChevronDown aria-hidden="true" className="size-3" strokeWidth={1.5} />
            </button>
          </div>
        </SiteContainer>
      </div>

      <SiteContainer width="full" className="grid h-[4.65rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center sm:h-20">
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

        <div className="hidden justify-self-start lg:block"><BrandLogo /></div>
        <div className="justify-self-center lg:hidden"><BrandLogo /></div>

        <DesktopNavigation activeMenu={desktopMenu} onActiveMenuChange={setDesktopMenu} />

        <div className="flex items-center justify-end lg:gap-0.5" onFocus={() => setDesktopMenu(null)}>
          <span className="hidden lg:block">
            <button
              type="button"
              className={iconButtonClass}
              onClick={() => {
                setDesktopMenu(null);
                setSearchOpen((open) => !open);
              }}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.45} /> : <Search aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.45} />}
            </button>
          </span>
          <span className="hidden lg:block">
            <Link href="/account" className={iconButtonClass} aria-label="Account">
              <UserRound aria-hidden="true" className="size-[1.18rem]" strokeWidth={1.4} />
            </Link>
          </span>
          <CartBagLink className={iconButtonClass} />
        </div>
      </SiteContainer>

      <div className={`absolute inset-x-0 top-full overflow-hidden border-t border-[#ece9e4] bg-white shadow-[0_12px_30px_rgba(38,37,33,0.08)] transition-[max-height,opacity] duration-300 ${searchOpen ? "max-h-28 opacity-100" : "pointer-events-none max-h-0 opacity-0"}`}>
        <SiteContainer>
          <form action="/search" className="flex h-24 items-center" role="search">
            <label htmlFor="site-search" className="sr-only">Search scarves and accessories</label>
            <div className="flex w-full items-center border-b border-[#817d75] pb-2">
              <Search aria-hidden="true" className="mr-3 size-5 shrink-0 text-[#625f59]" strokeWidth={1.35} />
              <input id="site-search" name="q" type="search" autoComplete="off" placeholder="Search scarves and accessories" className="h-10 min-w-0 flex-1 bg-transparent font-paragraph text-base text-[#262521] outline-none placeholder:text-[#88847d]" />
              <span className="hidden font-paragraph text-xs text-[#8a867f] sm:block">Press enter to search</span>
            </div>
          </form>
        </SiteContainer>
      </div>

      {menuOpen ? <MobileNavigation onClose={closeMobileMenu} /> : null}
    </header>
  );
}
