import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { SiteContainer } from "@/components/local/site-container";

export function AboutHero() {
  return (
    <section aria-labelledby="about-title" className="pb-14 pt-6 sm:pb-20 sm:pt-8">
      <SiteContainer>
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#87776a]">
          <ol className="flex items-center gap-3">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Our story</li>
          </ol>
        </nav>
        <div className="grid overflow-hidden rounded-[1.75rem] bg-[#f1e9e1] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-12">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gold-ink">Meet HS by Saman</p>
            <h1 id="about-title" className="mt-6 max-w-[12ch] text-[clamp(2.8rem,5.4vw,4.5rem)] font-normal leading-[1.04] tracking-[-0.045em]">
              A little fabric.<br />A lot of you.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#756458] sm:text-lg">
              Your scarf is part of how you move through the world. We’re here for the everyday rituals, the special moments, and all the ways you make it your own.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-heading text-sm">
              <Link href="/#signature-scarves-title" className="inline-flex min-h-12 items-center gap-4 rounded-full bg-brand-gold-ink px-6 text-white transition-colors hover:bg-[#604c22]">
                Find your scarf <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
              <a href="#our-perspective" className="inline-flex min-h-12 items-center gap-2 underline decoration-brand-gold underline-offset-4">
                Get to know us <ArrowDown aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-[#e3d7c7] sm:aspect-[6/5] lg:aspect-auto lg:min-h-[580px]">
            <Image src="/images/shop-the-look-cocoa-modal.png" alt="A woman styling a soft cocoa scarf in a warm, sunlit interior" fill sizes="(min-width: 1440px) 680px, (min-width: 1024px) 50vw, 100vw" preload className="object-cover object-[58%_40%]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2e2118]/55 to-transparent px-6 pb-6 pt-20 text-white sm:px-8">
              <p className="text-xs uppercase tracking-[0.18em]">For every shade of you.</p>
            </div>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
