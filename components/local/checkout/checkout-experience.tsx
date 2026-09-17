'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  PackageCheck,
  ShoppingBag,
  LockKeyhole,
  Check
} from 'lucide-react'
import { SiteContainer } from '@/components/local/site-container'
import { CheckoutPanel } from '@/components/local/checkout/checkout-panel'
import { CheckoutSummary } from '@/components/local/checkout/checkout-summary'
import { CouponCode } from '@/components/local/cart/coupon-code'
import {
  cartRequest,
  placeOrder,
  type CheckoutDetails
} from '@/lib/commerce/cart-client'
import type { CartSummary } from '@/lib/commerce/cart-types'

const fieldClass =
  'min-h-12 w-full rounded-md border border-[#ddd5c8] bg-white px-4 text-sm outline-none transition focus:border-brand-gold-ink focus:ring-2 focus:ring-brand-gold-soft'
const paymentLabels: Record<string, string> = {
  cod: 'Cash on delivery',
  bacs: 'Direct bank transfer',
  cheque: 'Cheque payment',
  stripe: 'Debit or credit card',
  ppcp: 'PayPal',
  'ppcp-gateway': 'PayPal'
}
const blank: CheckoutDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'PK',
  customerNote: '',
  paymentMethod: ''
}

export function CheckoutExperience () {
  const [cart, setCart] = useState<CartSummary | null>(null)
  const [details, setDetails] = useState(blank)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [complete, setComplete] = useState<{
    number: string
    status: string
  } | null>(null)
  useEffect(() => {
    let active = true
    cartRequest()
      .then(value => {
        if (!active) return
        setCart(value)
        setDetails(current => ({
          ...current,
          paymentMethod: value.paymentMethods[0] || ''
        }))
      })
      .catch(reason => {
        if (active) setError(reason.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])
  const update = (key: keyof CheckoutDetails, value: string) =>
    setDetails(current => ({ ...current, [key]: value }))
  const canPay = Boolean(
    cart &&
      cart.items.length &&
      !cart.errors.length &&
      (!cart.needsPayment || cart.paymentMethods.length)
  )
  async function submit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canPay || pending) return
    setPending(true)
    setError('')
    try {
      const result = await placeOrder(details)
      if (result.redirectUrl) window.location.assign(result.redirectUrl)
      else setComplete({ number: result.orderNumber, status: result.status })
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Your order could not be placed.'
      )
    } finally {
      setPending(false)
    }
  }
  if (loading)
    return (
      <SiteContainer>
        <p role='status' className='py-28 text-center text-sm text-[#71695d]'>
          Preparing your secure checkout…
        </p>
      </SiteContainer>
    )
  if (complete)
    return (
      <SiteContainer className='py-20'>
        <div className='mx-auto max-w-2xl rounded-2xl border border-brand-gold-line bg-white p-8 text-center sm:p-12'>
          <PackageCheck
            className='mx-auto size-12 text-brand-gold-ink'
            strokeWidth={1.2}
          />
          <p className='mt-6 text-xs uppercase tracking-[0.2em] text-brand-gold-ink'>
            Order received
          </p>
          <h1 className='mt-3 font-heading text-4xl font-light'>
            Thank you. Your order is with us.
          </h1>
          <p className='mt-4 text-sm text-[#71695d]'>
            Order {complete.number} · {complete.status}
          </p>
          <Link
            href='/collections/all'
            className='mt-8 inline-flex min-h-12 items-center gap-4 rounded bg-brand-gold-ink px-7 text-sm text-white'
          >
            Continue shopping
            <ArrowRight className='size-4' />
          </Link>
        </div>
      </SiteContainer>
    )
  if (!cart?.items.length)
    return (
      <SiteContainer className='py-20'>
        <div className='rounded-2xl border border-brand-gold-line bg-white p-10 text-center'>
          <ShoppingBag
            className='mx-auto size-9 text-brand-gold-ink'
            strokeWidth={1.2}
          />
          <h1 className='mt-5 font-heading text-3xl font-light'>
            Your bag is ready for something lovely.
          </h1>
          <Link
            href='/collections/all'
            className='mt-7 inline-flex min-h-12 items-center rounded bg-brand-gold-ink px-7 text-sm text-white'
          >
            Explore scarves
          </Link>
        </div>
      </SiteContainer>
    )
  return (
    <SiteContainer className='py-10 sm:py-14 lg:py-16'>
      <nav aria-label='Breadcrumb' className='mb-7 flex items-center gap-2 text-xs text-[#81786c]'>
        <Link href='/' className='hover:text-brand-gold-ink'>Home</Link>
        <span aria-hidden='true'>/</span>
        <Link href='/cart' className='hover:text-brand-gold-ink'>Bag</Link>
        <span aria-hidden='true'>/</span>
        <span className='text-[#302a23]'>Checkout</span>
      </nav>
      <div className='mb-9 flex flex-wrap items-end justify-between gap-4 border-b border-brand-gold-line pb-7'>
        <div>
          <p className='text-xs uppercase tracking-[0.2em] text-brand-gold-ink'>
            Secure checkout
          </p>
          <h1 className='mt-2 font-heading text-4xl font-light tracking-[-0.03em] sm:text-5xl'>
            Almost yours.
          </h1>
        </div>
        <Link href='/cart' className='text-sm underline underline-offset-4'>
          Return to your bag
        </Link>
      </div>
      <CouponCode cart={cart} onCartChange={setCart} className='mb-8 lg:max-w-xl' />
      <form
        onSubmit={submit}
        className='grid items-start gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(21rem,0.75fr)] xl:gap-12'
      >
        <div className='space-y-7'>
          <CheckoutPanel number='01' title='Contact information' description='We will use these details for your order confirmation.'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <Field
                label='First name'
                value={details.firstName}
                onChange={v => update('firstName', v)}
                autoComplete='given-name'
              />
              <Field
                label='Last name'
                value={details.lastName}
                onChange={v => update('lastName', v)}
                autoComplete='family-name'
              />
              <Field
                label='Email address'
                type='email'
                value={details.email}
                onChange={v => update('email', v)}
                autoComplete='email'
              />
              <Field
                label='Phone number'
                type='tel'
                value={details.phone}
                onChange={v => update('phone', v)}
                autoComplete='tel'
              />
            </div>
          </CheckoutPanel>
          <CheckoutPanel number='02' title='Shipping address' description='Enter the address where you would like your scarves delivered.'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <label className='sm:col-span-2'>
                <span className='mb-2 block text-xs text-[#71695d]'>
                  Street address
                </span>
                <input
                  className={fieldClass}
                  required
                  autoComplete='address-line1'
                  value={details.address1}
                  onChange={e => update('address1', e.target.value)}
                />
              </label>
              <label className='sm:col-span-2'>
                <span className='mb-2 block text-xs text-[#71695d]'>
                  Apartment, suite or landmark{' '}
                  <span className='text-[#a29888]'>(optional)</span>
                </span>
                <input
                  className={fieldClass}
                  autoComplete='address-line2'
                  value={details.address2}
                  onChange={e => update('address2', e.target.value)}
                />
              </label>
              <label>
                <span className='mb-2 block text-xs text-[#71695d]'>
                  Country
                </span>
                <select
                  className={fieldClass}
                  value={details.country}
                  onChange={e => update('country', e.target.value)}
                >
                  <option value='PK'>Pakistan</option>
                  <option value='AE'>United Arab Emirates</option>
                  <option value='GB'>United Kingdom</option>
                  <option value='US'>United States</option>
                </select>
              </label>
              <Field
                label='Region / state'
                value={details.state}
                onChange={v => update('state', v)}
                autoComplete='address-level1'
              />
              <Field
                label='City'
                value={details.city}
                onChange={v => update('city', v)}
                autoComplete='address-level2'
              />
              <Field
                label='Postal code'
                value={details.postcode}
                onChange={v => update('postcode', v)}
                autoComplete='postal-code'
              />
              <label className='sm:col-span-2'>
                <span className='mb-2 block text-xs text-[#71695d]'>
                  Order note <span className='text-[#a29888]'>(optional)</span>
                </span>
                <textarea
                  rows={4}
                  className={`${fieldClass} py-3`}
                  value={details.customerNote}
                  onChange={e => update('customerNote', e.target.value)}
                />
              </label>
            </div>
          </CheckoutPanel>
          <CheckoutPanel number='03' title='Payment option' description='Only payment methods enabled in WooCommerce are shown here.'>
            {!cart.needsPayment ? (
              <div className='rounded-lg border border-[#cbd9c9] bg-[#f2f7f1] p-4 text-sm leading-6 text-[#496149]'>
                No payment is required for this order. You can continue to place it securely.
              </div>
            ) : cart.paymentMethods.length ? (
              <div className='grid gap-3 sm:grid-cols-2'>
                {cart.paymentMethods.map(method => (
                  <label
                    key={method}
                    className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm transition ${
                      details.paymentMethod === method
                        ? 'border-brand-gold-ink bg-brand-gold-soft shadow-[inset_3px_0_0_var(--color-brand-gold-ink)]'
                        : 'border-[#ddd5c8] bg-white hover:border-brand-gold'
                    }`}
                  >
                    <input
                      type='radio'
                      name='paymentMethod'
                      required={cart.needsPayment}
                      checked={details.paymentMethod === method}
                      onChange={() => update('paymentMethod', method)}
                    />
                    <span className='font-medium'>{paymentLabels[method] || method.replaceAll('-', ' ')}</span>
                    {details.paymentMethod === method ? (
                      <Check className='ml-auto size-4 text-brand-gold-ink' />
                    ) : null}
                  </label>
                ))}
              </div>
            ) : (
              <div className='rounded-lg border border-[#dfc79f] bg-[#fff9ed] p-4 text-sm leading-6 text-[#71572d]'>
                <strong className='font-heading font-medium'>
                  Payment setup required.
                </strong>
                <br />
                Enable Cash on Delivery, bank transfer, PayPal or a Store
                API-compatible card gateway in WooCommerce → Settings →
                Payments. Checkout will activate automatically.
              </div>
            )}
            <p className='mt-4 flex items-center gap-2 text-xs leading-5 text-[#71695d]'>
              <LockKeyhole className='size-4 shrink-0' />
              Card information is handled only by the enabled payment gateway
              and is never stored by this website.
            </p>
          </CheckoutPanel>
        </div>
        <CheckoutSummary
          cart={cart}
          pending={pending}
          canPay={canPay}
          error={error}
        />
      </form>
    </SiteContainer>
  )
}
function Field ({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <label>
      <span className='mb-2 block text-xs text-[#71695d]'>{label}</span>
      <input
        className={fieldClass}
        required
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </label>
  )
}
