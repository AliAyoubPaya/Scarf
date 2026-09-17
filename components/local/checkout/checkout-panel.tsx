import type { ReactNode } from 'react'

export function CheckoutPanel ({
  number,
  title,
  description,
  children
}: {
  number: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className='rounded-xl border border-[#e2ddd4] bg-white p-5 shadow-[0_1px_0_rgba(48,42,35,0.02)] sm:p-7 lg:p-8'>
      <div className='mb-7 flex items-start gap-4 border-b border-[#eee9e1] pb-5'>
        <span className='flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-gold-line bg-brand-gold-soft text-xs font-medium text-brand-gold-ink'>
          {number}
        </span>
        <div>
          <h2 className='font-heading text-xl font-medium tracking-[-0.01em] text-[#302a23] sm:text-2xl'>
            {title}
          </h2>
          {description ? (
            <p className='mt-1 text-xs leading-5 text-[#7a7267]'>{description}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  )
}
