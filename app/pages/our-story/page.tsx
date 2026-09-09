import type { Metadata } from "next";

import { AboutHero } from "@/components/local/about/about-hero";
import { AboutStory } from "@/components/local/about/about-story";
import { AboutValues } from "@/components/local/about/about-values";
import { AboutFabrics } from "@/components/local/about/about-fabrics";
import { AboutCommunity } from "@/components/local/about/about-community";
import { SiteHeader } from "@/components/local/site-header";
import { SiteFooter } from "@/components/local/site-footer";

export const metadata: Metadata = {
  title: "Our Story — HS by Saman",
  description: "Meet HS by Saman: scarves and hijabs for your everyday, your special moments, and your own sense of style. Explore our perspective, fabrics and community.",
};

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf8] text-[#35291f]">
      <SiteHeader />
      <main aria-label="About HS by Saman" className="[&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_a]:focus-visible:outline-brand-gold-ink">
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutFabrics />
        <AboutCommunity />
      </main>
      <SiteFooter />
    </div>
  );
}
