"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function ShopDialog({ title, onClose, children, drawer = false }: { title: string; onClose: () => void; children: ReactNode; drawer?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; previousFocus?.focus(); };
  }, []);
  return <dialog ref={ref} aria-label={title} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }} className={`${drawer ? "fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-[min(92vw,400px)] max-w-none" : "fixed inset-0 m-auto max-h-[90dvh] w-[min(92vw,820px)] max-w-none rounded-xl"} overflow-y-auto overscroll-contain border-0 bg-[#fbfaf8] p-0 text-[#302a23] shadow-xl backdrop:bg-black/45 [&_button]:cursor-pointer [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-offset-2 [&_button]:focus-visible:outline-brand-gold-ink`}><div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[#e6e0d6] bg-[#fbfaf8] px-5 py-3"><h2 className="font-heading text-lg">{title}</h2><button type="button" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`} className="flex size-11 items-center justify-center"><X aria-hidden="true" className="size-5" strokeWidth={1.5} /></button></div>{children}</dialog>;
}
