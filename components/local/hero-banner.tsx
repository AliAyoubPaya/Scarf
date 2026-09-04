import { ArrowUpRight } from "lucide-react";
import { getImageProps } from "next/image";
import Link from "next/link";

const heroAlt =
  "Woman wearing an ivory and soft pistachio printed scarf in a sunlit stone courtyard";

export function HeroBanner() {
  const common = {
    alt: heroAlt,
    sizes: "100vw",
    quality: 85,
  } as const;

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: "/images/scarf-hero-desktop.png",
    width: 1810,
    height: 869,
  });

  const {
    props: { srcSet: mobileSrcSet, ...mobileImageProps },
  } = getImageProps({
    ...common,
    src: "/images/scarf-hero-mobile.png",
    width: 864,
    height: 1821,
  });

  return (
    <section
      className="relative isolate h-[calc(100svh-6.65rem)] min-h-[36rem] overflow-hidden bg-[#d8d4c7] sm:h-[calc(100svh-7.25rem)] sm:min-h-[38rem] sm:max-h-[56rem]"
      aria-labelledby="hero-title"
    >
      <picture className="absolute inset-0 block size-full">
        <source media="(min-width: 640px)" srcSet={desktopSrcSet} />
        <source media="(max-width: 639px)" srcSet={mobileSrcSet} />
        <img
          {...mobileImageProps}
          alt={heroAlt}
          fetchPriority="high"
          className="size-full object-cover object-[52%_center] sm:object-center"
        />
      </picture>

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(249,247,242,0.99)_0%,rgba(249,247,242,0.94)_32%,rgba(249,247,242,0.76)_52%,rgba(249,247,242,0.08)_78%)] sm:bg-[linear-gradient(90deg,rgba(246,243,237,0.92)_0%,rgba(246,243,237,0.72)_28%,rgba(246,243,237,0.12)_56%,transparent_72%)]" />

      <div className="relative mx-auto flex h-full max-w-[1480px] items-end px-5 pb-10 sm:items-center sm:px-8 sm:pb-0 lg:px-10 xl:px-12">
        <div className="max-w-[21rem] text-[#24231f] sm:max-w-[31rem] [&_a]:inline-flex [&_a]:min-h-12 [&_a]:items-center [&_a]:justify-center [&_a]:gap-3 [&_a]:px-6 [&_a]:font-heading [&_a]:text-[0.72rem] [&_a]:font-medium [&_a]:uppercase [&_a]:tracking-[0.14em] [&_a]:transition-colors">
          <p className="mb-3 font-heading text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#5d6250] sm:mb-5 sm:text-xs">
            The Botanical Edit · 2026
          </p>
          <h1
            id="hero-title"
            className="text-[2.45rem] font-light leading-[0.96] tracking-[-0.035em] text-balance sm:text-[4.25rem] lg:text-[4.75rem]"
          >
            Light as air.
            <span className="block">Made to be yours.</span>
          </h1>
          <p className="mt-5 hidden max-w-md font-paragraph text-base leading-7 text-[#55534d] sm:block">
            Graceful drapes, considered prints, and effortless softness for every day.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <Link
              href="/collections/new-in"
              className="group bg-[#272620] text-white hover:bg-[#aa302b]"
            >
              Shop new arrivals
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
            <Link
              href="/collections/modal"
              className="border border-[#393832] bg-white/15 text-[#292822] backdrop-blur-sm hover:bg-white/60"
            >
              Explore modal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
