import Link from "next/link";
import { ArrowUpRight, MessageCircle, MapPin } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, TiktokIcon } from "@hugeicons/core-free-icons";

import { BrandLogo } from "@/components/local/brand-logo";
import { FooterLinkGroup } from "@/components/local/footer-link-group";
import { SiteContainer } from "@/components/local/site-container";
import { footerGroups, footerSocials } from "@/lib/footer";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e5e0d8] bg-[#f5f2ed] text-[#302a23] [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-brand-gold-ink [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-4 [&_button]:focus-visible:outline-brand-gold-ink">
      <SiteContainer width="full">
        <div className="flex flex-col items-start justify-between gap-7 border-b border-[#e2dbd2] py-10 sm:flex-row sm:items-center sm:py-12">
          <div>
            <BrandLogo variant="footer" />
            <p className="mt-3 text-sm text-[#756a5e]">For every shade of you.</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="mr-2 text-xs uppercase leading-relaxed tracking-[0.12em] text-[#847566]">A little closer.<br />A little more inspired.</p>
            <div className="flex gap-2 [&_a]:flex [&_a]:size-11 [&_a]:items-center [&_a]:justify-center [&_a]:rounded-full [&_a]:border [&_a]:border-brand-gold-line [&_a]:text-brand-gold-ink [&_a]:bg-[#fbfaf8] [&_a]:transition-colors [&_a:hover]:bg-brand-gold-soft">
              <a href={footerSocials.instagram} target="_blank" rel="noreferrer" aria-label="HS by Saman on Instagram (opens in a new tab)"><HugeiconsIcon icon={InstagramIcon} size={19} strokeWidth={1.5} aria-hidden="true" /></a>
              <a href={footerSocials.tiktok} target="_blank" rel="noreferrer" aria-label="HS by Saman on TikTok (opens in a new tab)"><HugeiconsIcon icon={TiktokIcon} size={19} strokeWidth={1.5} aria-hidden="true" /></a>
            </div>
          </div>
        </div>

        <div className="grid pb-10 pt-3 md:grid-cols-3 md:gap-x-8 md:gap-y-10 md:py-12 lg:grid-cols-[1fr_1fr_1fr_1.25fr]">
          {footerGroups.map((group) => <FooterLinkGroup key={group.title} {...group} />)}
          <div className="mt-7 rounded-xl border border-brand-gold-line bg-brand-gold-soft p-6 md:col-span-3 md:mt-0 lg:col-span-1">
            <MessageCircle aria-hidden="true" className="size-6 text-brand-gold-ink" strokeWidth={1.3} />
            <h3 className="mt-4 text-xl font-normal">Let’s find your shade.</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#736658]">Choosing a fabric or styling a new look? Send us a message. We’d love to help.</p>
            <a href={footerSocials.instagram} target="_blank" rel="noreferrer" className="mt-4 flex min-h-11 w-fit items-center gap-3 font-heading text-sm font-medium underline decoration-brand-gold underline-offset-4">
              Talk to us on Instagram <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-[#e2dbd2] py-6 text-xs leading-relaxed text-[#827466] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} HS by Saman. All rights reserved.</p>
          <p className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-3.5" strokeWidth={1.5} />Pakistan · PKR</p>
          <nav aria-label="Footer legal" className="flex flex-wrap gap-x-5 gap-y-2 [&_a]:inline-flex [&_a]:min-h-9 [&_a]:items-center [&_a:hover]:underline [&_a:hover]:underline-offset-4">
            <Link href="/pages/privacy-policy">Privacy policy</Link>
            <Link href="/pages/terms-of-service">Terms of service</Link>
          </nav>
        </div>
      </SiteContainer>
    </footer>
  );
}
