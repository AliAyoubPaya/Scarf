import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SiteContainer } from "@/components/local/site-container";

export function CollectionHelp() {
  return <section aria-labelledby="collection-help-title" className="pb-14 sm:pb-20"><SiteContainer width="full"><div className="flex flex-col gap-5 rounded-xl border border-brand-gold-line/70 bg-brand-gold-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div className="flex items-start gap-4"><Sparkles aria-hidden="true" className="mt-1 size-6 shrink-0 text-brand-gold-ink" strokeWidth={1.4} /><div><h2 id="collection-help-title" className="text-xl font-normal">Not sure which scarf is yours?</h2><p className="mt-2 text-sm leading-relaxed text-[#71695d]">Tell us your colours, your occasion, your everyday. Let’s find your drape.</p></div></div><Link href="/pages/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-full border border-brand-gold-ink px-5 font-heading text-sm text-brand-gold-ink transition-colors hover:bg-brand-gold-ink hover:text-white">Ask for styling help<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div></SiteContainer></section>;
}
