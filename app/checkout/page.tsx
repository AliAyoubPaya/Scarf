import { CheckoutExperience } from "@/components/local/checkout/checkout-experience";
import { SiteFooter } from "@/components/local/site-footer";
import { SiteHeader } from "@/components/local/site-header";

export const metadata = { title: "Secure checkout — HS by Saman", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return <div className="min-h-screen bg-[#fbfaf8] text-[#302a23]"><SiteHeader /><main><CheckoutExperience /></main><SiteFooter /></div>;
}
