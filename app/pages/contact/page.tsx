import type { Metadata } from "next";

import { ContactHero } from "@/components/local/contact/contact-hero";
import { ContactOptions } from "@/components/local/contact/contact-options";
import { ContactSection } from "@/components/local/contact/contact-section";
import { ContactFaq } from "@/components/local/contact/contact-faq";
import { SiteHeader } from "@/components/local/site-header";
import { SiteFooter } from "@/components/local/site-footer";
import { getContactEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Us — HS by Saman",
  description: "Need a little help choosing your hijab? Contact HS by Saman for scarf styling, fabric questions and order enquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#302a23]">
      <SiteHeader />
      <main aria-label="Contact HS by Saman" className="[&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-brand-gold-ink [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-4 [&_button]:focus-visible:outline-brand-gold-ink">
        <ContactHero />
        <ContactOptions />
        <ContactSection email={getContactEmail()} />
        <ContactFaq />
      </main>
      <SiteFooter />
    </div>
  );
}
