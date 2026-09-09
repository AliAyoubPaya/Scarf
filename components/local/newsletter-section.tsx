import Image from "next/image";
import { ArrowUpRight, Mail, Heart, Sparkles } from "lucide-react";

import { SiteContainer } from "@/components/local/site-container";
import { footerSocials } from "@/lib/footer";
import { getNewsletterSignupUrl } from "@/lib/newsletter";

export function NewsletterSection() {
  const signupUrl = getNewsletterSignupUrl();
  return (
    <section aria-labelledby="newsletter-title" className="bg-[#fbfaf8] pb-12 pt-4 sm:pb-16 [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-brand-gold-ink">
      <SiteContainer>
        <div className="grid overflow-hidden rounded-2xl border border-[#e6e0d7] bg-[#f2ede6] lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#79695f]">
              <span aria-hidden="true" className="h-px w-7 bg-brand-gold" />
              A note from HS by Saman
            </p>
            <h2 id="newsletter-title" className="mt-5 max-w-[14ch] text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.08] tracking-[-0.035em]">
              Good things.<br />Softly delivered.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-[#6e655c]">
              New shades, thoughtful edits and a little inspiration for your everyday.
            </p>
            {signupUrl ? (
              <a href={signupUrl} target="_blank" rel="noreferrer" className="mt-7 flex min-h-14 items-center gap-3 rounded-full bg-brand-gold-ink px-5 text-white transition-colors hover:bg-[#604c22]">
                <Mail aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.4} />
                <span className="flex-1 font-heading text-sm font-medium">Join the list</span>
                <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
                <span className="sr-only">(opens signup form in a new tab)</span>
              </a>
            ) : <div className="mt-7 flex min-h-14 items-center gap-3 rounded-full border border-[#d7cec3] bg-[#fbfaf8]/80 px-5">
              <Mail aria-hidden="true" className="size-5 shrink-0 text-brand-gold-ink" strokeWidth={1.4} />
              <span className="flex-1 text-sm text-[#756b60]">Email updates</span>
              <span className="rounded-full bg-[#e9e1d7] px-3 py-2 text-xs font-medium text-[#705c4c]">Coming soon</span>
            </div>}
            <a href={footerSocials.instagram} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 w-fit items-center gap-2 text-sm underline decoration-brand-gold underline-offset-4 hover:decoration-current">
              {signupUrl ? "Follow along on Instagram" : "Until then, follow along on Instagram"}
              <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
            </a>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#ded5ca] pt-5 text-xs text-[#7b6d61] [&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_svg]:size-4 [&_svg]:shrink-0">
              <span><Sparkles aria-hidden="true" strokeWidth={1.4} />First look at new arrivals</span>
              <span><Heart aria-hidden="true" strokeWidth={1.4} />Everyday styling inspiration</span>
            </div>
          </div>
          <div className="relative aspect-[3/2] min-w-0 bg-[#e9e0d5] lg:aspect-auto lg:min-h-[480px]">
            <Image
              src="/images/footer-scarf-still-life.png"
              alt="Soft blush, ivory, taupe and cocoa scarves draped beside a ceramic vase"
              fill
              sizes="(min-width: 1440px) 640px, (min-width: 1024px) 46vw, (min-width: 640px) 90vw, 100vw"
              className="object-cover object-[65%_center]"
            />
            <span className="absolute bottom-5 right-5 rounded-full border border-white/40 bg-white/70 px-4 py-2 font-heading text-xs uppercase tracking-[0.16em] text-[#6b5849] backdrop-blur-sm">Softness, in every layer.</span>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
