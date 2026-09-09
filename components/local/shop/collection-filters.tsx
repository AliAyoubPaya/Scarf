import { ChevronDown } from "lucide-react";
import { fabrics, shades, priceOptions, type CollectionProduct, type ShopFilters } from "@/lib/catalog/collections";

export type FilterChange = (key: string, value: string, multiple?: boolean) => void;

export function CollectionFilters({ products, filters, onChange, prefix }: { products: CollectionProduct[]; filters: ShopFilters; onChange: FilterChange; prefix: string }) {
  return (
    <div className="divide-y divide-[#e6e0d6] text-sm [&_summary]:flex [&_summary]:min-h-14 [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center [&_summary]:justify-between [&_summary]:font-heading [&_summary]:text-xs [&_summary]:font-medium [&_summary]:uppercase [&_summary]:tracking-[0.1em] [&_summary]:focus-visible:outline-2 [&_summary]:focus-visible:outline-brand-gold-ink [&_summary::-webkit-details-marker]:hidden [&_input]:accent-brand-gold-ink [&_input]:focus-visible:outline-2 [&_input]:focus-visible:outline-offset-3 [&_input]:focus-visible:outline-brand-gold-ink [&_label]:cursor-pointer">
      <details open className="group">
        <summary>Fabric<ChevronDown aria-hidden="true" className="size-3.5 group-open:rotate-180" /></summary>
        <div className="pb-5">
          {fabrics.map((fabric) => { const count = products.filter((p) => p.fabric === fabric).length; return <label key={fabric} className={`flex min-h-10 items-center gap-3 ${!count ? "text-[#999184]" : "text-[#665e52]"}`}><input type="checkbox" className="size-4" checked={filters.fabrics.includes(fabric)} disabled={!count && !filters.fabrics.includes(fabric)} onChange={() => onChange("fabric", fabric, true)} /><span className="flex-1">{fabric}</span><span className="text-xs">{count}</span></label>; })}
        </div>
      </details>
      <details open className="group">
        <summary>Colour family<ChevronDown aria-hidden="true" className="size-3.5 group-open:rotate-180" /></summary>
        <div className="grid grid-cols-2 gap-x-2 pb-5">
          {shades.map((shade) => <label key={shade.name} className="flex min-h-11 items-center gap-2 text-xs text-[#665e52]"><input type="checkbox" className="peer sr-only" checked={filters.shades.includes(shade.name)} onChange={() => onChange("shade", shade.name, true)} /><span aria-hidden="true" className="size-6 shrink-0 rounded-full border border-black/10 ring-offset-2 peer-checked:ring-2 peer-checked:ring-brand-gold-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-brand-gold-ink" style={{ background: shade.name === "Printed" ? "repeating-linear-gradient(45deg,#b77b61 0 5px,#efe1cc 5px 10px)" : shade.hex }} /><span>{shade.name}</span></label>)}
        </div>
      </details>
      <details open className="group">
        <summary>Price<ChevronDown aria-hidden="true" className="size-3.5 group-open:rotate-180" /></summary>
        <div className="pb-5">{priceOptions.map((option) => <label key={option.value} className="flex min-h-10 items-center gap-3 text-[#665e52]"><input type="radio" name={`${prefix}-price`} checked={filters.price === option.value} onChange={() => onChange("price", option.value)} className="size-4" />{option.label}</label>)}</div>
      </details>
      <div className="py-5"><label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="size-4" checked={filters.stock} onChange={() => onChange("stock", filters.stock ? "" : "1")} />In stock only</label></div>
    </div>
  );
}
