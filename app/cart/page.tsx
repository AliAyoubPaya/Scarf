import { SiteHeader } from "@/components/local/site-header";
import { SiteFooter } from "@/components/local/site-footer";
import { SiteContainer } from "@/components/local/site-container";
import { ShoppingBag } from "@/components/local/cart/shopping-bag";

export const metadata = { title: "Your shopping bag — HS by Saman", robots: { index: false, follow: false } };
export default function CartPage() { return <div className="min-h-screen bg-[#fbfaf8] text-[#302a23]"><SiteHeader /><main><SiteContainer><ShoppingBag /></SiteContainer></main><SiteFooter /></div>; }
