import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "header" | "footer";
};

export function BrandLogo({ variant = "header" }: BrandLogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      aria-label="HS by Saman home"
      className={cn(
        "relative block shrink-0 overflow-hidden leading-none",
        isFooter
          ? "h-18 w-54 sm:h-23 sm:w-68"
          : "h-16 w-40 min-[22rem]:h-16 min-[22rem]:w-40 lg:h-21 lg:w-62",
      )}
    >
      <Image
        src={isFooter ? "/images/logo-transparent.png" : "/images/logo-bg-white.png"}
        alt=""
        fill
        sizes={isFooter ? "(min-width: 640px) 240px, 216px" : "(min-width: 1024px) 168px, (min-width: 352px) 144px, 132px"}
        preload={!isFooter}
        className="scale-[1.11] object-contain"
      />
    </Link>
  );
}
