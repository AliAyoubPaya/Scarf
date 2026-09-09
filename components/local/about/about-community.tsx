import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/local/site-container";
import { footerSocials } from "@/lib/footer";

export function AboutCommunity() {
  return (
    <section aria-labelledby="about-community-title" className="pb-16 sm:pb-20">
      <SiteContainer>
        <div className="flex flex-col justify-between gap-8 rounded-[1.75rem] bg-[#eae0d5] px-6 py-10 sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-gold-ink">Let’s keep in touch</p>
            <h2 id="about-community-title" className="mt-4 text-3xl font-normal leading-tight tracking-[-0.025em] sm:text-4xl">We’re here for you.<br />And your next favourite scarf.</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#786655]">See how others style theirs, share your own look, or send us a question. Come say hello.</p>
          </div>
          <a href={footerSocials.instagram} target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-fit shrink-0 items-center gap-4 rounded-full bg-brand-gold-ink px-7 font-heading text-sm text-white transition-colors hover:bg-[#604c22]">Find us on Instagram <ArrowUpRight aria-hidden="true" className="size-4" /><span className="sr-only">(opens in a new tab)</span></a>
        </div>
      </SiteContainer>
    </section>
  );
}
