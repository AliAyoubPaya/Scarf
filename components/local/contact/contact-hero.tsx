import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ChevronRight } from "lucide-react";

import { SiteContainer } from "@/components/local/site-container";

export function ContactHero() {
  return (
    <section aria-labelledby="contact-title" className="relative isolate overflow-hidden bg-[#e9e0d5]">
      <Image src="/images/footer-scarf-still-life.png" alt="Blush and warm neutral scarves beside delicate dried flowers" fill preload sizes="100vw" className="object-cover object-[65%_55%]" />
      <div className="absolute inset-0 bg-[#241b13]/55" />
      <SiteContainer className="relative flex min-h-[360px] flex-col text-white sm:min-h-[430px] lg:min-h-[460px]">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 py-6 text-xs text-white/85 [&_a]:min-h-8 [&_a]:content-center [&_a:hover]:underline">
          <Link href="/">Home</Link><ChevronRight aria-hidden="true" className="size-3" /><span aria-current="page">Contact us</span>
        </nav>
        <div className="flex flex-1 flex-col items-center justify-center pb-12 text-center sm:pb-16">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.24em] sm:text-xs">A little help. A personal touch.</p>
          <h1 id="contact-title" className="mt-4 text-5xl font-light leading-tight tracking-[-0.035em] sm:text-6xl lg:text-7xl">Let’s talk.</h1>
          <span aria-hidden="true" className="mt-5 h-px w-12 bg-brand-gold-line" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">From finding your shade to caring for your favourite scarf, we’re here to help.</p>
          <a href="#contact-message" className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-white/60 font-heading text-xs font-medium uppercase tracking-[0.13em]">Get in touch <ArrowDown aria-hidden="true" className="size-4" /></a>
        </div>
      </SiteContainer>
    </section>
  );
}
