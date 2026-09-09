import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { SiteContainer } from "@/components/local/site-container";
import { navigationMenus, primaryNavigation, type NavigationMenu } from "@/lib/navigation";

type DesktopNavigationProps = {
  activeMenu: NavigationMenu["id"] | null;
  onActiveMenuChange: (menu: NavigationMenu["id"] | null) => void;
};

export function DesktopNavigation({ activeMenu, onActiveMenuChange }: DesktopNavigationProps) {
  const selectedMenu = navigationMenus.find((menu) => menu.id === activeMenu);

  return (
    <>
      <nav aria-label="Main navigation" className="hidden h-full items-stretch justify-center lg:flex">
        <ul className="flex h-full items-stretch gap-1 xl:gap-3">
          {primaryNavigation.map((item) => (
            <li
              key={item.label}
              className="relative flex h-full items-stretch"
              onMouseEnter={() => onActiveMenuChange(item.menuId ?? null)}
            >
              {item.menuId ? (
                <button
                  type="button"
                  aria-expanded={activeMenu === item.menuId}
                  aria-controls={`desktop-menu-${item.menuId}`}
                  onFocus={() => onActiveMenuChange(item.menuId ?? null)}
                  onClick={() => onActiveMenuChange(item.menuId ?? null)}
                  className={`relative flex h-full items-center px-2.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] transition-colors after:absolute after:inset-x-2.5 after:bottom-4 after:h-px after:origin-left after:bg-brand-gold after:transition-transform xl:px-3.5 xl:after:inset-x-3.5 ${activeMenu === item.menuId ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}
                >
                  {item.label}
                  <ChevronDown aria-hidden="true" className={`ml-1 size-3 transition-transform duration-200 ${activeMenu === item.menuId ? "rotate-180" : ""}`} strokeWidth={1.4} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onFocus={() => onActiveMenuChange(null)}
                  className={`relative flex h-full items-center px-2.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] after:absolute after:inset-x-2.5 after:bottom-4 after:h-px after:origin-left after:scale-x-0 after:bg-brand-gold after:transition-transform hover:after:scale-x-100 xl:px-3.5 xl:after:inset-x-3.5 ${item.accent ? "text-[#b2332d]" : "text-[#37352f]"}`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {selectedMenu ? (
        <div id={`desktop-menu-${selectedMenu.id}`} className="absolute inset-x-0 top-full hidden border-t border-[#e9e6e0] bg-white shadow-[0_18px_45px_rgba(38,37,33,0.1)] lg:block">
          <SiteContainer width="full" className="grid max-h-[calc(100dvh-7.25rem)] grid-cols-[minmax(250px,0.85fr)_minmax(0,2.15fr)] gap-9 overflow-y-auto py-7 xl:gap-14 xl:py-8">
            <div className="grid content-start gap-8 border-r border-[#ebe8e2] pr-8 xl:grid-cols-2 xl:gap-10 xl:pr-12">
              {selectedMenu.groups.map((group) => (
                <div key={group.label}>
                  <p className="text-[0.67rem] font-medium uppercase tracking-[0.15em] text-[#817d75]">{group.label}</p>
                  <ul className="mt-4 space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} onClick={() => onActiveMenuChange(null)} className="inline-flex font-paragraph text-[0.95rem] text-[#2f2d28] transition-colors hover:text-brand-gold-ink">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3.5 xl:gap-5">
              {selectedMenu.promos.map((promo) => (
                <Link key={promo.label} href={promo.href} onClick={() => onActiveMenuChange(null)} className="group relative aspect-[6/5] max-h-96 overflow-hidden bg-[#e9e5df] text-white">
                  <Image src={promo.image} alt={promo.imageAlt} fill sizes="24vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 xl:p-5">
                    {promo.eyebrow ? <span className="block text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/80">{promo.eyebrow}</span> : null}
                    <span className="mt-1 block text-lg font-medium leading-tight xl:text-xl">{promo.label}</span>
                    <span className="mt-3 inline-block border-b border-white pb-0.5 text-[0.64rem] font-medium uppercase tracking-[0.14em]">Explore</span>
                  </span>
                </Link>
              ))}
            </div>
          </SiteContainer>
        </div>
      ) : null}
    </>
  );
}
