import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SiteContainer } from "@/components/local/site-container";
import { collectionLinks, type Collection } from "@/lib/catalog/collections";

export function CollectionHero({ collection }: { collection: Collection }) {
  const label = collectionLinks.find((link) => link.slug === collection.slug)?.label ?? collection.slug.replaceAll("-", " ");
  return (
    <section aria-labelledby="collection-title" className="border-b border-brand-gold-line/60 bg-[#f4f0e8]">
      <SiteContainer width="full">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 pt-6 text-xs capitalize text-[#776e61]"><Link href="/" className="inline-flex min-h-8 items-center hover:underline">Home</Link><ChevronRight aria-hidden="true" className="size-3" /><span aria-current="page">{label}</span></nav>
        <div className="grid items-center gap-6 pb-7 pt-4 sm:grid-cols-[1fr_220px] sm:pb-8 lg:grid-cols-[1fr_320px]">
          <div className="py-3 sm:py-5">
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-brand-gold-ink">The HS by Saman collection</p>
            <h1 id="collection-title" className="mt-4 max-w-[19ch] text-[clamp(2.1rem,4.5vw,3.6rem)] font-light leading-[1.08] tracking-[-0.035em]">{collection.title}</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#71695d] sm:text-base">{collection.description}</p>
          </div>
          <div className="relative hidden aspect-[8/5] overflow-hidden rounded-t-[5rem] rounded-b-lg bg-[#e9e0d5] sm:block"><Image src="/images/footer-scarf-still-life.png" alt="A palette of soft blush, ivory and cocoa scarves" fill preload sizes="(min-width: 1024px) 320px, 220px" className="object-cover" /></div>
        </div>
        <nav aria-label="Scarf collections" className="flex gap-6 overflow-x-auto [scrollbar-width:thin] sm:gap-8 [&_a]:inline-flex [&_a]:min-h-13 [&_a]:shrink-0 [&_a]:items-center [&_a]:border-b-2 [&_a]:font-heading [&_a]:text-xs [&_a]:font-medium [&_a]:uppercase [&_a]:tracking-[0.08em]">
          {collectionLinks.map(({ slug, label }) => <Link key={slug} href={`/collections/${slug}`} aria-current={slug === collection.slug ? "page" : undefined} className={slug === collection.slug ? "border-brand-gold-ink text-brand-gold-ink" : "border-transparent text-[#71695d] hover:border-brand-gold-line hover:text-brand-gold-ink"}>{label}</Link>)}
        </nav>
      </SiteContainer>
    </section>
  );
}
