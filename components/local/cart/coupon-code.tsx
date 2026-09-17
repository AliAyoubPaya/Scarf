'use client'

import { useState } from 'react'
import { Check, Tag, X } from 'lucide-react'
import { couponRequest } from '@/lib/commerce/cart-client'
import type { CartSummary } from '@/lib/commerce/cart-types'

export function CouponCode ({
  cart,
  onCartChange,
  className = ''
}: {
  cart: CartSummary
  onCartChange: (cart: CartSummary) => void
  className?: string
}) {
  const [code, setCode] = useState('')
  const [pending, setPending] = useState('')
  const [error, setError] = useState('')

  async function update (method: 'POST' | 'DELETE', value: string) {
    if (pending) return
    setPending(value)
    setError('')
    try {
      const nextCart = await couponRequest(method, value)
      onCartChange(nextCart)
      if (method === 'POST') setCode('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The coupon could not be updated.')
    } finally {
      setPending('')
    }
  }

  return (
    <section className={`rounded-xl border border-[#ded8ce] bg-white p-4 sm:p-5 ${className}`} aria-labelledby='coupon-heading'>
      <div className='flex items-center gap-3'>
        <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gold-soft text-brand-gold-ink'>
          <Tag className='size-4' strokeWidth={1.5} />
        </span>
        <div>
          <h2 id='coupon-heading' className='font-heading text-base font-medium'>Have a coupon?</h2>
          <p className='text-xs text-[#71695d]'>Enter your WooCommerce coupon code.</p>
        </div>
      </div>

      <form
        className='mt-4 flex gap-2'
        onSubmit={event => {
          event.preventDefault()
          void update('POST', code.trim())
        }}
      >
        <label className='sr-only' htmlFor='coupon-code'>Coupon code</label>
        <input
          id='coupon-code'
          value={code}
          maxLength={100}
          autoComplete='off'
          onChange={event => setCode(event.target.value)}
          placeholder='Coupon code'
          className='min-h-11 min-w-0 flex-1 rounded-md border border-[#ddd5c8] bg-white px-3 text-sm uppercase outline-none placeholder:normal-case focus:border-brand-gold-ink focus:ring-2 focus:ring-brand-gold-soft'
        />
        <button
          type='submit'
          disabled={!code.trim() || Boolean(pending)}
          className='min-h-11 shrink-0 rounded-md bg-[#302a23] px-5 text-xs font-medium uppercase tracking-[0.08em] text-white transition hover:bg-brand-gold-ink disabled:cursor-not-allowed disabled:opacity-45'
        >
          {pending && !cart.coupons.some(coupon => coupon.code === pending) ? 'Applying…' : 'Apply'}
        </button>
      </form>

      {cart.coupons.length ? (
        <div className='mt-3 flex flex-wrap gap-2'>
          {cart.coupons.map(coupon => (
            <span key={coupon.code} className='inline-flex min-h-9 items-center gap-2 rounded-full border border-[#cbd9c9] bg-[#f2f7f1] px-3 text-xs text-[#496149]'>
              <Check className='size-3.5' />
              <span className='font-medium uppercase'>{coupon.code}</span>
              <span>−{coupon.discount}</span>
              <button
                type='button'
                aria-label={`Remove coupon ${coupon.code}`}
                disabled={Boolean(pending)}
                onClick={() => void update('DELETE', coupon.code)}
                className='ml-1 flex size-6 items-center justify-center rounded-full hover:bg-white disabled:opacity-45'
              >
                <X className='size-3.5' />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {error ? <p role='alert' className='mt-3 text-xs leading-5 text-[#93483e]'>{error}</p> : null}
    </section>
  )
}
