import { Heart, Layers, MessageCircle } from "lucide-react";
import { SiteContainer } from "@/components/local/site-container";

const values = [
  { icon: Heart, title: "Room to be yourself", description: "A soft neutral or a statement print. An everyday wrap or an occasion look. There’s no single way to make it yours." },
  { icon: Layers, title: "The little details", description: "Texture, colour and drape all shape how a scarf feels. We make them part of the conversation, so you can explore what suits you." },
  { icon: MessageCircle, title: "A conversation away", description: "Not sure where to start? Ask us about styling, shades or fabrics. Finding your scarf should feel personal." },
];

export function AboutValues() {
  return (
    <section aria-labelledby="about-values-title" className="bg-[#f3ede6] py-14 sm:py-20">
      <SiteContainer>
        <div className="mb-9 max-w-xl sm:mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-gold-ink">What matters to us</p>
          <h2 id="about-values-title" className="mt-4 text-3xl font-normal leading-tight tracking-[-0.025em] sm:text-4xl">Thoughtful in the little things.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:gap-6 [&_article]:rounded-2xl [&_article]:border [&_article]:border-[#e7ddd2] [&_article]:bg-[#fcfaf7] [&_article]:p-7 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-normal [&_p]:mt-3 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-[#7c6d5e]">
          {values.map(({ icon: Icon, title, description }) => (
            <article key={title}>
              <span className="flex size-12 items-center justify-center rounded-full bg-brand-gold-soft text-brand-gold-ink"><Icon aria-hidden="true" className="size-6" strokeWidth={1.4} /></span>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}
