import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SiteContainerProps = ComponentPropsWithoutRef<"div">;

export function SiteContainer({ className, ...props }: SiteContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1280px] px-4 sm:px-7 lg:px-10",
        className,
      )}
      {...props}
    />
  );
}
