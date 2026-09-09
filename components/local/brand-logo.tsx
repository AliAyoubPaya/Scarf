import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "header" | "footer";
};

export function BrandLogo({ variant = "header" }: BrandLogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link href="/" aria-label="HS by Saman home" className="inline-flex w-fit shrink-0 items-center gap-2 sm:gap-3">
      <Image
        src="/images/hs-by-saman-logo.png"
        alt=""
        width={1254}
        height={1254}
        sizes={isFooter ? "112px" : "64px"}
        preload={!isFooter}
        className={cn("shrink-0 object-contain mix-blend-multiply", isFooter ? "size-28" : "size-11 min-[22rem]:size-16")}
      />
      <span className="flex flex-col gap-1.5 font-heading">
        <span className={cn("font-medium leading-none tracking-[0.03em] text-foreground", isFooter ? "text-2xl sm:text-3xl" : "text-[0.9rem] sm:text-base")}>HS by Saman</span>
        <span className={cn("uppercase tracking-[0.19em] text-brand-gold-ink", isFooter ? "text-[0.58rem]" : "text-[0.47rem]")}>Modesty is the new bold</span>
      </span>
    </Link>
  );
}
