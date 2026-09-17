import Image from 'next/image'
import { ArrowRight, LockKeyhole, RotateCcw, ShieldCheck } from 'lucide-react'
import type { CartSummary } from '@/lib/commerce/cart-types'

export function CheckoutSummary ({
  cart,
  pending,
  canPay,
  error
}: {
  cart: CartSummary
  pending: boolean
  canPay: boolean
  error: string
}) {
  return (
    <aside className='space-y-4 xl:sticky xl:top-28'>
      <section className='rounded-xl border border-[#ded8ce] bg-white p-5 sm:p-7'>
        <p className='text-[0.65rem] font-medium uppercase tracking-[0.2em] text-brand-gold-ink'>
          Your order
        </p>
        <h2 className='mt-2 font-heading text-2xl font-medium'>Order summary</h2>

        <div className='mt-6 divide-y divide-[#e8e2d8] border-y border-[#e8e2d8]'>
          {cart.items.map(item => (
            <article key={item.key} className='flex gap-4 py-4'>
              <div className='relative aspect-4/5 w-16 shrink-0 overflow-hidden rounded-md bg-[#f5f2ed]'>
                {item.image ? (
                  <Image src={item.image} alt='' fill sizes='64px' className='object-cover' />
                ) : null}
                <span className='absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-[#302a23] text-[0.6rem] text-white'>
                  {item.quantity}
                </span>
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='font-heading text-sm font-medium leading-5'>{item.name}</h3>
                {item.options ? <p className='mt-1 text-xs text-[#7a7267]'>{item.options}</p> : null}
              </div>
              <p className='shrink-0 text-sm'>{item.total}</p>
            </article>
          ))}
        </div>

        <dl className='grid grid-cols-2 gap-y-3 py-5 text-sm [&_dd]:text-right'>
          <dt className='text-[#71695d]'>Subtotal</dt>
          <dd>{cart.subtotal}</dd>
          {cart.hasDiscount ? (
            <>
              <dt className='text-[#71695d]'>Discount</dt>
              <dd className='text-[#4e7354]'>−{cart.discount}</dd>
            </>
          ) : null}
          <dt className='text-[#71695d]'>Shipping</dt>
          <dd>{cart.needsShipping ? cart.shipping : 'Not required'}</dd>
          <dt className='text-[#71695d]'>Tax</dt>
          <dd>{cart.tax}</dd>
          <dt className='mt-1 border-t border-[#ded8ce] pt-4 font-heading text-base font-medium'>Total</dt>
          <dd className='mt-1 border-t border-[#ded8ce] pt-4 font-heading text-lg font-medium'>{cart.total}</dd>
        </dl>

        {cart.errors.map(message => (
          <p key={message} role='alert' className='mb-3 text-sm text-[#93483e]'>{message}</p>
        ))}
        {error ? (
          <p role='alert' className='mb-3 rounded-md border border-[#d9b6ad] bg-[#f8efeb] p-3 text-sm leading-5'>{error}</p>
        ) : null}

        <button
          type='submit'
          disabled={!canPay || pending}
          className='flex min-h-14 w-full items-center justify-center gap-3 rounded-md bg-[#302a23] px-5 text-sm font-medium uppercase tracking-[0.08em] text-white transition hover:bg-brand-gold-ink disabled:cursor-not-allowed disabled:opacity-45'
        >
          {pending ? 'Placing your order…' : 'Place order'}
          <ArrowRight className='size-4' />
        </button>
        {!canPay ? (
          <p className='mt-3 text-center text-xs leading-5 text-[#8a5f35]'>
            Complete the cart requirements and enable a WooCommerce payment method to place the order.
          </p>
        ) : null}
      </section>

      <section className='rounded-xl border border-[#ded8ce] bg-[#f5f1e9] p-5 text-center'>
        <LockKeyhole className='mx-auto size-6 text-brand-gold-ink' strokeWidth={1.4} />
        <h3 className='mt-2 font-heading text-base font-medium'>Safe &amp; secure checkout</h3>
        <p className='mt-1 text-xs leading-5 text-[#71695d]'>Payments are processed by your selected WooCommerce gateway.</p>
        <p className='mt-3 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[#655d52]'>WooCommerce protected</p>
        <div className='mt-4 flex justify-center gap-5 border-t border-[#ded8ce] pt-4 text-[0.68rem] text-[#71695d]'>
          <span className='flex items-center gap-1.5'><ShieldCheck className='size-4' /> Secure details</span>
          <span className='flex items-center gap-1.5'><RotateCcw className='size-4' /> Easy support</span>
        </div>
      </section>
    </aside>
  )
}
