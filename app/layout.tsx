import type { Metadata } from "next";
import { Figtree, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HS by Saman — Scarves for every story",
  description: "Modern scarves and modest essentials for women and girls.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", figtree.variable, outfit.variable)}
    >
      <body className="flex min-h-full flex-col font-paragraph">{children}</body>
    </html>
  );
}
