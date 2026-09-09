import { ArrowUpRight, MessageCircle, PackageCheck, Sparkles } from "lucide-react";

import { SiteContainer } from "@/components/local/site-container";
import { footerSocials } from "@/lib/footer";

const options = [
  { title: "Your order, with care", description: "Have an order question? Keep your order number handy so we can help.", label: "Ask about an order", href: "#contact-message", icon: PackageCheck },
  { title: "Find your perfect drape", description: "Choosing a fabric, a shade or a look? Let’s find what feels like you.", label: "Get styling help", href: "#contact-message", icon: Sparkles },
  { title: "A conversation away", description: "Prefer a direct message? Find our team and our community on Instagram.", label: "Say hello on Instagram", href: footerSocials.instagram, icon: MessageCircle },
];

export function ContactOptions() {
  return (
    <section aria-label="How we can help" className="border-b border-brand-gold-line/60 bg-[#f6f2eb]">
      <SiteContainer className="grid divide-y divide-brand-gold-line/70 py-3 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-10 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-normal [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-[#71695d]">
        {options.map(({ title, description, label, href, icon: Icon }) => (
          <div key={title} className="py-7 first:pl-0 last:pr-0 md:px-7 md:py-0 lg:px-10">
            <Icon aria-hidden="true" className="size-6 text-brand-gold-ink" strokeWidth={1.3} />
            <h2>{title}</h2><p>{description}</p>
            <a href={href} {...(href.startsWith("https:") ? { target: "_blank", rel: "noreferrer" } : {})} className="mt-3 inline-flex min-h-11 items-center gap-2 font-heading text-xs font-medium text-brand-gold-ink underline decoration-brand-gold-line underline-offset-4 hover:decoration-current">
              {label}<ArrowUpRight aria-hidden="true" className="size-3.5" />{href.startsWith("https:") ? <span className="sr-only">(opens in a new tab)</span> : null}
            </a>
          </div>
        ))}
      </SiteContainer>
    </section>
  );
}
