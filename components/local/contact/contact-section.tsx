import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon } from "@hugeicons/core-free-icons";

import { ContactForm } from "@/components/local/contact/contact-form";
import { SiteContainer } from "@/components/local/site-container";
import { footerSocials } from "@/lib/footer";

export function ContactSection({ email }: { email: string | null }) {
  return (
    <section id="contact-message" aria-labelledby="contact-message-title" className="scroll-mt-36 py-14 sm:py-20 lg:py-24">
      <SiteContainer className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="text-xs uppercase tracking-[0.19em] text-brand-gold-ink">Get in touch</p>
          <h2 id="contact-message-title" className="mt-4 text-4xl font-light leading-[1.1] tracking-[-0.025em] sm:text-5xl">Good conversations<br />start here.</h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-[#71695d]">A question, a little feedback, or something you’d love to see next. We’d love to hear from you.</p>
          <div className="mt-8 space-y-4 border-t border-brand-gold-line pt-6 [&_a]:flex [&_a]:min-h-12 [&_a]:items-center [&_a]:gap-3 [&_a]:text-sm [&_a]:transition-colors [&_a:hover]:text-brand-gold-ink">
            <a href={footerSocials.instagram} target="_blank" rel="noreferrer"><HugeiconsIcon icon={InstagramIcon} size={21} strokeWidth={1.5} aria-hidden="true" /><span className="flex-1">@hsbysaman <span className="block text-xs text-[#71695d]">Instagram · message our team</span></span><ArrowUpRight aria-hidden="true" className="size-4" /><span className="sr-only">(opens in a new tab)</span></a>
            {email ? <a href={`mailto:${email}`}><Mail aria-hidden="true" className="size-5 shrink-0" /><span className="min-w-0 break-all">{email}</span></a> : null}
          </div>
          <div className="mt-8 rounded-xl border border-brand-gold-line/70 bg-brand-gold-soft p-5">
            <MessageCircle aria-hidden="true" className="size-5 text-brand-gold-ink" strokeWidth={1.5} />
            <h3 className="mt-3 font-medium">A little detail goes a long way.</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#71695d]">For order enquiries, include your order number. For styling advice, tell us the occasion and colours you love. Please don’t share passwords or payment details.</p>
          </div>
        </div>
        <ContactForm email={email} />
      </SiteContainer>
    </section>
  );
}
