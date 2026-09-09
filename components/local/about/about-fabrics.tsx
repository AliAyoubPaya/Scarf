import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteContainer } from "@/components/local/site-container";

const fabrics = [
  { name: "Chiffon", note: "A light, flowing look", image: "/images/products/ivory-chiffon-hijab.png", alt: "An ivory chiffon scarf draped around the face" },
  { name: "Modal", note: "Relaxed, easy layers", image: "/images/products/pistachio-modal-hijab.png", alt: "A softly draped pistachio modal scarf" },
  { name: "Satin", note: "A little everyday shine", image: "/images/products/rose-satin-hijab.png", alt: "A muted rose satin scarf with a lustrous finish" },
];

export function AboutFabrics() {
  return (
    <section aria-labelledby="about-fabrics-title" className="py-16 sm:py-24">
      <SiteContainer>
        <header className="mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-gold-ink">Find your feeling</p>
            <h2 id="about-fabrics-title" className="mt-4 text-3xl font-normal tracking-[-0.025em] sm:text-4xl">A texture for your every day.</h2>
          </div>
          <Link href="/#signature-scarves-title" className="inline-flex min-h-11 w-fit items-center gap-3 font-heading text-sm underline decoration-brand-gold underline-offset-4">Explore the collection <ArrowUpRight aria-hidden="true" className="size-4" /></Link>
        </header>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-5 [&_h3]:text-xl [&_h3]:font-normal [&_p]:mt-1 [&_p]:text-sm [&_p]:text-[#82705f]">
          {fabrics.map((fabric) => (
            <article key={fabric.name}>
              <div className="relative mb-5 aspect-[5/4] overflow-hidden rounded-2xl bg-[#ece3d8] sm:aspect-[4/5]">
                <Image src={fabric.image} alt={fabric.alt} fill sizes="(min-width: 1440px) 440px, (min-width: 640px) 32vw, 100vw" className="object-cover object-top" />
              </div>
              <h3>{fabric.name}</h3><p>{fabric.note}</p>
            </article>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}
