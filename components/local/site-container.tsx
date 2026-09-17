import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SiteContainerProps = ComponentPropsWithoutRef<"div"> & {
  width?: "contained" | "full";
};

export function SiteContainer({ width = "contained", className, ...props }: SiteContainerProps) {
  return (
    <div
      data-site-width={width}
      className={cn(
        "mx-auto w-full min-w-0 px-(--site-gutter)",
        width === "contained" ? "max-w-(--site-content-max)" : "max-w-none",
        className,
      )}
      {...props}
    />
  );
}
