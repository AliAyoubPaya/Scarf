"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Search, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { navigationMenus, primaryNavigation, type NavigationMenu } from "@/lib/navigation";

type MobileNavigationProps = { onClose: () => void };

export function MobileNavigation({ onClose }: MobileNavigationProps) {
  const [activePanel, setActivePanel] = useState<NavigationMenu["id"] | null>(null);
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeMenu = navigationMenus.find((menu) => menu.id === activePanel);
  const activeGroup = activeGroupIndex === null ? null : activeMenu?.groups[activeGroupIndex];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button type="button" className="absolute inset-0 size-full bg-black/45" onClick={onClose} aria-label="Close navigation menu" />
      <div className="relative flex h-[100dvh] w-[min(92vw,25rem)] flex-col overflow-hidden bg-[#fffefd] shadow-[18px_0_55px_rgba(20,18,15,0.2)]">
        <div className="grid h-[3.2rem] shrink-0 grid-cols-[0.85fr_1.35fr_3.4rem] border-b border-[#e5e2dc]">
          <button type="button" className="flex items-center justify-center gap-2 border-r border-[#e5e2dc] text-[0.66rem] font-medium uppercase tracking-[0.1em]" aria-label="Language: English">
            English <ChevronDown aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </button>
          <button type="button" className="flex items-center justify-center gap-2 border-r border-[#e5e2dc] text-[0.66rem] font-medium uppercase tracking-[0.09em]" aria-label="Country and currency: Pakistan, PKR">
            Pakistan · PKR <ChevronDown aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </button>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close menu" className="flex items-center justify-center">
            <X aria-hidden="true" className="size-5" strokeWidth={1.4} />
          </button>
        </div>

        <form action="/search" role="search" className="flex h-[3.2rem] shrink-0 items-center border-b border-[#e5e2dc] px-5">
          <label htmlFor="mobile-site-search" className="sr-only">Search scarves and accessories</label>
          <input id="mobile-site-search" name="q" type="search" placeholder="Search scarves and accessories…" className="min-w-0 flex-1 bg-transparent font-paragraph text-base italic outline-none placeholder:text-[#8a867f]" />
          <button type="submit" className="flex size-10 items-center justify-end" aria-label="Search">
            <Search aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </button>
        </form>

        <div className="relative min-h-0 flex-1 overflow-y-auto">
          {activeMenu ? (
            <div key={`${activeMenu.id}-${activeGroupIndex ?? "root"}`} className="animate-in slide-in-from-right-3 duration-200">
              <button
                type="button"
                onClick={() => {
                  if (activeGroup) setActiveGroupIndex(null);
                  else setActivePanel(null);
                }}
                className="grid min-h-[3.25rem] w-full grid-cols-[2.5rem_1fr_2.5rem] items-center border-b border-[#e5e2dc] px-3 text-[0.72rem] font-medium uppercase tracking-[0.12em]"
              >
                <ChevronLeft aria-hidden="true" className="size-4" strokeWidth={1.5} />
                <span className="text-center">{activeGroup?.label ?? activeMenu.label}</span><span />
              </button>

              <div className="divide-y divide-[#e7e4de]">
                {activeGroup
                  ? activeGroup.links.map((link) => (
                      <Link key={link.label} href={link.href} onClick={onClose} className="flex min-h-[3.2rem] items-center justify-center px-5 text-center text-[0.72rem] font-medium uppercase tracking-[0.11em]">
                        {link.label}
                      </Link>
                    ))
                  : activeMenu.id === "shop"
                    ? activeMenu.groups.map((group, index) => (
                        <button key={group.label} type="button" onClick={() => setActiveGroupIndex(index)} className="flex min-h-[3.2rem] w-full items-center justify-between px-5 text-left text-[0.72rem] font-medium uppercase tracking-[0.11em]">
                          {group.label}<ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
                        </button>
                      ))
                    : activeMenu.groups.flatMap((group) => group.links).map((link) => (
                        <Link key={link.label} href={link.href} onClick={onClose} className="flex min-h-[3.2rem] items-center justify-center px-5 text-center text-[0.72rem] font-medium uppercase tracking-[0.11em]">
                          {link.label}
                        </Link>
                      ))}
              </div>

              {!activeGroup ? <div className="grid grid-cols-2 gap-2 p-2">
                {activeMenu.promos.slice(0, activeMenu.id === "shop" ? 2 : 3).map((promo, index) => (
                  <Link key={promo.label} href={promo.href} onClick={onClose} className={`group relative aspect-[6/5] overflow-hidden bg-[#e9e5df] text-white ${index === 2 ? "col-span-2 aspect-[12/5]" : ""}`}>
                    <Image src={promo.image} alt={promo.imageAlt} fill sizes={index === 2 ? "92vw" : "46vw"} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-3 text-center">
                      <span className="block text-lg font-medium leading-tight">{promo.label}</span>
                      <span className="mt-2 inline-block border-b border-white text-[0.62rem] font-medium uppercase tracking-[0.13em]">Explore</span>
                    </span>
                  </Link>
                ))}
              </div> : null}
            </div>
          ) : (
            <div className="animate-in fade-in duration-150">
              <nav aria-label="Mobile navigation">
                <ul className="divide-y divide-[#e7e4de]">
                  {primaryNavigation.map((item) => (
                    <li key={item.label}>
                      {item.menuId ? (
                        <button type="button" onClick={() => {
                          setActiveGroupIndex(null);
                          setActivePanel(item.menuId ?? null);
                        }} className="flex min-h-[3.25rem] w-full items-center justify-between px-5 text-left text-[0.72rem] font-medium uppercase tracking-[0.12em]">
                          {item.label}<ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
                        </button>
                      ) : (
                        <Link href={item.href} onClick={onClose} className={`flex min-h-[3.25rem] items-center justify-between px-5 text-[0.72rem] font-medium uppercase tracking-[0.12em] ${item.accent ? "text-[#b2332d]" : ""}`}>
                          {item.label}<ChevronRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-2 border-t border-[#e7e4de] px-5 py-4">
                <Link href="/account" onClick={onClose} className="flex min-h-11 items-center gap-3 font-paragraph text-sm text-[#4e4b45]">
                  <UserRound aria-hidden="true" className="size-[1.1rem]" strokeWidth={1.4} />Sign in or create an account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
