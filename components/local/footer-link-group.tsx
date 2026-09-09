"use client";

import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { useId, useState } from "react";

type FooterLinkGroupProps = {
  title: string;
  links: { label: string; href: string }[];
};

export function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-[#e3ded6] md:border-0">
      <h3 className="hidden text-base font-medium md:block">{title}</h3>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((value) => !value)}
        className="flex min-h-14 w-full items-center justify-between gap-4 text-left text-base font-medium md:hidden"
      >
        {title}
        {expanded ? <Minus aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
      </button>
      <ul
        id={panelId}
        className={`${expanded ? "block" : "hidden"} pb-5 text-sm leading-relaxed text-[#686259] md:mt-5 md:block md:pb-0 [&_a]:inline-flex [&_a]:min-h-9 [&_a]:items-center [&_a]:py-1 [&_a]:transition-colors [&_a:hover]:text-brand-gold-ink [&_a:hover]:underline [&_a:hover]:underline-offset-4`}
      >
        {links.map((link) => (
          <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
