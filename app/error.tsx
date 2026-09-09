"use client";

import Link from "next/link";
export default function StorefrontError({ reset }: { reset: () => void }) {
  return <main className="flex min-h-[70dvh] items-center justify-center bg-[#fbfaf8] px-5 text-center text-[#302a23]"><div className="max-w-md"><p className="text-xs uppercase tracking-widest text-brand-gold-ink">HS by Saman</p><h1 className="mt-4 font-heading text-3xl font-light">A little pause.</h1><p className="mt-4 text-sm leading-6 text-[#71695d]">We couldn’t load the latest store details. Please try again in a moment.</p><button type="button" onClick={reset} className="mt-6 min-h-12 rounded bg-brand-gold-ink px-7 text-sm text-white">Try again</button><Link href="/pages/contact" className="ml-5 text-sm underline underline-offset-4">Contact us</Link></div></main>;
}
