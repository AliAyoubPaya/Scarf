import Image from "next/image";
import { SiteContainer } from "@/components/local/site-container";

export function AboutStory() {
  return (
    <section id="our-perspective" aria-labelledby="about-story-title" className="scroll-mt-36 pb-16 sm:pb-24">
      <SiteContainer>
        <div className="grid items-center gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-[#e9e0d5]">
            <Image src="/images/footer-scarf-still-life.png" alt="Blush, ivory and cocoa scarves, folded and draped to show their texture" fill sizes="(min-width: 1440px) 580px, (min-width: 1024px) 45vw, 100vw" className="object-cover object-[65%_center]" />
          </div>
          <div className="max-w-xl [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-[#75685c]">
            <span className="text-xs uppercase tracking-[0.18em] text-brand-gold-ink">Our perspective</span>
            <h2 id="about-story-title" className="mb-6 mt-4 text-3xl font-normal leading-tight tracking-[-0.025em] sm:text-4xl">Modest style.<br />Personal expression.</h2>
            <p>We see a scarf as more than the finishing touch. It can be the familiar shade you reach for every morning, a new way to wear an old favourite, or a little confidence on a big day.</p>
            <p className="mt-4">HS by Saman is a space for women and girls to explore that feeling. From quiet neutrals to expressive prints, our focus is simple: helping you find a look that feels like you.</p>
            <p className="mt-6 border-l-2 border-brand-gold pl-5 font-heading !text-xl !text-[#564132]">Your style. Your rhythm. Your story.</p>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
