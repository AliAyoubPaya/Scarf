"use client";

import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { SiteContainer } from "@/components/local/site-container";
import type { SocialReview } from "@/lib/social-reviews";

type SocialReviewsProps = {
  reviews: SocialReview[];
};

type ReviewFrameProps = {
  review: SocialReview;
  interactive?: boolean;
  titlePrefix?: string;
};

function TikTokMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M15.6 3c.23 1.94 1.31 3.1 3.4 3.23v2.82a8.1 8.1 0 0 1-3.37-.78v5.45a5.7 5.7 0 1 1-4.93-5.65v2.87a2.87 2.87 0 1 0 2.07 2.76V3h2.83Z" />
    </svg>
  );
}

function InstagramMark({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlatformMark({ platform }: Pick<SocialReview, "platform">) {
  return platform === "Instagram" ? (
    <InstagramMark />
  ) : (
    <TikTokMark />
  );
}

function ReviewFrame({
  review,
  interactive = false,
  titlePrefix = "Preview",
}: ReviewFrameProps) {
  const [readyReviewId, setReadyReviewId] = useState<string | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const isReady = readyReviewId === review.id;

  useEffect(() => {
    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
      }
    };
  }, [review.id]);

  const revealFrame = () => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
    }

    revealTimerRef.current = window.setTimeout(
      () => setReadyReviewId(review.id),
      review.platform === "Instagram" ? 900 : 200,
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#171513]">
      <div
        aria-hidden="true"
        className={`absolute inset-0 flex items-center justify-center bg-[#171513] text-white/55 transition-opacity duration-200 ${
          isReady ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <span className="flex size-14 animate-pulse items-center justify-center rounded-full border border-white/10 bg-white/5">
          <PlatformMark platform={review.platform} />
        </span>
      </div>
      <iframe
        src={review.embedUrl}
        title={`${titlePrefix}: ${review.title} by ${review.creator}`}
        loading="lazy"
        onLoad={revealFrame}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={interactive && isReady ? 0 : -1}
        aria-hidden={interactive ? undefined : true}
        className={`absolute left-0 top-0 border-0 bg-[#171513] transition-opacity duration-200 ${
          review.platform === "Instagram"
            ? "h-[135%] w-[135%] origin-top-left scale-[0.741]"
            : "size-full"
        } ${
          isReady ? "opacity-100" : "pointer-events-none opacity-0"
        } ${interactive && isReady ? "pointer-events-auto" : "pointer-events-none"}`}
      />
    </div>
  );
}

export function SocialReviews({ reviews }: SocialReviewsProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isModalOpen = activeIndex !== null;
  const railRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = useCallback(() => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === 0 ? reviews.length - 1 : current - 1;
    });
  }, [reviews.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + 1) % reviews.length;
    });
  }, [reviews.length]);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isModalOpen, showNext, showPrevious]);

  if (!reviews.length) return null;

  const activeReview = activeIndex === null ? null : reviews[activeIndex];
  const previousIndex =
    activeIndex === null
      ? 0
      : activeIndex === 0
        ? reviews.length - 1
        : activeIndex - 1;
  const nextIndex = activeIndex === null ? 0 : (activeIndex + 1) % reviews.length;

  const scrollRail = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.72, 280),
      behavior: "smooth",
    });
  };

  const handleModalKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], iframe[tabindex="0"]',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <section
      className="overflow-hidden bg-[#fbfaf8] py-16 text-[#26251f] sm:py-20 lg:py-24"
      aria-labelledby="social-reviews-title"
    >
      <SiteContainer>
        <header className="text-center">
          <p className="font-paragraph text-[0.7rem] uppercase tracking-[0.16em] text-[#77736b]">
            Real people. Real styling.
          </p>
          <h2
            id="social-reviews-title"
            className="mt-2 font-heading text-xl font-medium uppercase tracking-[0.05em] sm:text-2xl"
          >
            Styled by our #ScarfFam
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-0.5 w-8 bg-[#d6d3cc]"
          />
        </header>

        <div className="relative mt-10 sm:mt-12">
          <div
            ref={railRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 lg:gap-5"
          >
            {reviews.map((review, index) => (
              <article
                key={review.id}
                className="group relative aspect-[9/16] w-[76vw] max-w-[255px] shrink-0 snap-start overflow-hidden rounded-[3px] bg-[#eeeae4] shadow-[0_8px_25px_rgba(43,37,29,0.08)] sm:w-[42vw] md:w-[29vw] lg:w-[calc((100%-4rem)/5)] lg:max-w-none"
              >
                <ReviewFrame review={review} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/5" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 text-white">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                    <PlatformMark platform={review.platform} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-medium">
                      {review.title}
                    </p>
                    <p className="mt-0.5 truncate font-paragraph text-[0.72rem] text-white/80">
                      {review.creator} · {review.platform}
                    </p>
                  </div>
                </div>
                <span className="pointer-events-none absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-[#272620] opacity-100 shadow-lg transition duration-300 group-hover:scale-105 sm:opacity-0 sm:group-hover:opacity-100">
                  <Play aria-hidden="true" className="ml-0.5 size-4" fill="currentColor" />
                </span>
                <button
                  type="button"
                  ref={(node) => {
                    if (activeIndex === index && node) lastTriggerRef.current = node;
                  }}
                  aria-label={`Open ${review.title} by ${review.creator}`}
                  onClick={(event) => {
                    lastTriggerRef.current = event.currentTarget;
                    setActiveIndex(index);
                  }}
                  className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                />
              </article>
            ))}
          </div>

          <button
            type="button"
            aria-label="Scroll reviews left"
            onClick={() => scrollRail(-1)}
            className="absolute left-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#292823] shadow-[0_6px_22px_rgba(31,28,23,0.15)] transition hover:bg-[#292823] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#3f4937] sm:flex"
          >
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Scroll reviews right"
            onClick={() => scrollRail(1)}
            className="absolute right-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#292823] shadow-[0_6px_22px_rgba(31,28,23,0.15)] transition hover:bg-[#292823] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#3f4937] sm:flex"
          >
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <p className="mt-5 text-center font-paragraph text-xs text-[#77736b]">
          Videos shared publicly by the HS by Saman community on Instagram and TikTok.
        </p>
      </SiteContainer>

      {activeReview ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
          onKeyDown={handleModalKeyDown}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#171513]/95 px-3 py-5 text-white backdrop-blur-sm sm:px-6"
        >
          <h2 id="review-modal-title" className="sr-only">
            Customer review video slider
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close review slider"
            onClick={closeModal}
            className="absolute right-4 top-4 z-30 flex size-11 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/22 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:right-8 sm:top-7"
          >
            <X aria-hidden="true" className="size-6" strokeWidth={1.4} />
          </button>

          <button
            type="button"
            aria-label="Show previous review"
            onClick={showPrevious}
            className="absolute bottom-5 left-4 z-30 flex size-12 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/22 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:bottom-auto sm:left-7 sm:top-1/2 sm:-translate-y-1/2 lg:size-14"
          >
            <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.4} />
          </button>
          <button
            type="button"
            aria-label="Show next review"
            onClick={showNext}
            className="absolute bottom-5 right-4 z-30 flex size-12 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/22 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white sm:bottom-auto sm:right-7 sm:top-1/2 sm:-translate-y-1/2 lg:size-14"
          >
            <ChevronRight aria-hidden="true" className="size-6" strokeWidth={1.4} />
          </button>

          <button
            type="button"
            aria-label={`Show previous review: ${reviews[previousIndex].title}`}
            onClick={showPrevious}
            className="absolute left-[9%] top-1/2 hidden aspect-[9/16] h-[43vh] -translate-y-1/2 overflow-hidden rounded-lg bg-black/30 opacity-55 shadow-2xl transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white xl:block"
          >
            <ReviewFrame review={reviews[previousIndex]} />
            <span className="absolute inset-0 bg-black/10" />
          </button>

          <div className="relative flex w-[min(87vw,430px,calc((100dvh-7rem)*9/16))] flex-col overflow-hidden rounded-xl bg-black shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-[9/16] w-full shrink-0 overflow-hidden bg-black">
              <ReviewFrame
                key={activeReview.id}
                review={activeReview}
                interactive
                titlePrefix="Playing"
              />
            </div>
            <div className="flex shrink-0 items-center gap-3 bg-white p-3 text-[#272620]">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#efede9]">
                <PlatformMark platform={activeReview.platform} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-medium">
                  {activeReview.title}
                </p>
                <p className="truncate font-paragraph text-xs text-[#77736b]">
                  {activeReview.creator} · {activeReview.platform}
                </p>
              </div>
              <a
                href={activeReview.postUrl}
                target="_blank"
                rel="noreferrer"
                className="flex size-10 shrink-0 items-center justify-center border border-[#d8d5ce] transition hover:bg-[#272620] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3f4937]"
                aria-label={`View original post on ${activeReview.platform}`}
              >
                <ExternalLink aria-hidden="true" className="size-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <button
            type="button"
            aria-label={`Show next review: ${reviews[nextIndex].title}`}
            onClick={showNext}
            className="absolute right-[9%] top-1/2 hidden aspect-[9/16] h-[43vh] -translate-y-1/2 overflow-hidden rounded-lg bg-black/30 opacity-55 shadow-2xl transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white xl:block"
          >
            <ReviewFrame review={reviews[nextIndex]} />
            <span className="absolute inset-0 bg-black/10" />
          </button>

          <p className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 font-paragraph text-xs text-white/55 sm:block">
            {(activeIndex ?? 0) + 1} / {reviews.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}
