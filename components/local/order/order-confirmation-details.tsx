import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, CircleHelp, Mail, MapPin, PackageCheck, ShieldCheck } from 'lucide-react'
import type { OrderConfirmation } from '@/lib/commerce/order-confirmation'

const paymentLabels: Record<string, string> = {
  cod: 'Cash on delivery',
  bacs: 'Direct bank transfer',
  cheque: 'Cheque payment',
  stripe: 'Debit or credit card',
  ppcp: 'PayPal',
  'ppcp-gateway': 'PayPal'
}

const statusLabels: Record<string, string> = {
  pending: 'Payment pending',
  processing: 'Confirmed',
  'on-hold': 'On hold',
  completed: 'Completed',
  failed: 'Payment failed',
  cancelled: 'Cancelled',
  refunded: 'Refunded'
}

export function OrderConfirmationDetails ({ order }: { order: OrderConfirmation }) {
  const date = new Intl.DateTimeFormat('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(order.createdAt))
  const payment = paymentLabels[order.paymentMethod] || order.paymentMethod.replaceAll('-', ' ')
  const status = statusLabels[order.status] || order.status.replaceAll('-', ' ')

  return (
    <div className='pb-20 pt-10 sm:pt-14 lg:pt-16'>
      <section className='overflow-hidden rounded-2xl border border-brand-gold-line bg-white'>
        <div className='bg-[linear-gradient(135deg,#f7f2e8_0%,#fff_55%,#f2ead9_100%)] px-5 py-10 text-center sm:px-10 sm:py-14'>
          <span className='mx-auto flex size-16 items-center justify-center rounded-full border border-[#c9d8c5] bg-[#f0f7ef] text-[#557052]'>
            <PackageCheck className='size-8' strokeWidth={1.4} />
          </span>
          <p className='mt-5 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-brand-gold-ink'>Order received</p>
          <h1 className='mt-3 font-heading text-4xl font-light tracking-[-0.03em] sm:text-5xl'>Thank you for your order.</h1>
          <p className='mx-auto mt-4 max-w-xl text-sm leading-6 text-[#71695d]'>
            We have received your order and sent the confirmation details to <span className='font-medium text-[#302a23]'>{order.email}</span>.
          </p>
        </div>

        <dl className='grid border-t border-brand-gold-line sm:grid-cols-2 lg:grid-cols-4 [&>div]:p-5 [&>div]:sm:p-6 [&>div]:lg:border-r [&>div:last-child]:border-r-0'>
          <Meta label='Order number' value={`#${order.number}`} />
          <Meta label='Date' value={date} />
          <Meta label='Status' value={status} accent />
          <Meta label='Payment' value={payment} />
        </dl>
      </section>

      <div className='mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)]'>
        <section className='rounded-xl border border-[#e2ddd4] bg-white p-5 sm:p-7'>
          <div className='flex items-center justify-between gap-4 border-b border-[#ece7df] pb-5'>
            <div>
              <p className='text-[0.65rem] uppercase tracking-[0.18em] text-brand-gold-ink'>Your selection</p>
              <h2 className='mt-1 font-heading text-2xl font-medium'>Order details</h2>
            </div>
            <span className='text-xs text-[#71695d]'>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
          </div>

          <div className='divide-y divide-[#ece7df]'>
            {order.items.map(item => (
              <article key={item.key} className='flex gap-4 py-5 sm:gap-5'>
                <div className='relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-md bg-[#f2eee7] sm:w-24'>
                  {item.image ? <Image src={item.image} alt='' fill sizes='96px' className='object-cover' /> : null}
                  <span className='absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-[#302a23] text-[0.65rem] text-white'>{item.quantity}</span>
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='font-heading text-base font-medium sm:text-lg'>{item.name}</h3>
                  {item.options ? <p className='mt-1 text-xs leading-5 text-[#71695d]'>{item.options}</p> : null}
                  {item.subtotal !== item.total ? <p className='mt-3 text-xs text-[#9a9185] line-through'>{item.subtotal}</p> : null}
                </div>
                <p className='shrink-0 text-sm font-medium'>{item.total}</p>
              </article>
            ))}
          </div>

          <dl className='ml-auto grid max-w-sm grid-cols-2 gap-y-3 border-t border-[#ded8ce] pt-5 text-sm [&_dd]:text-right'>
            <dt className='text-[#71695d]'>Subtotal</dt><dd>{order.subtotal}</dd>
            {order.coupons.length ? <><dt className='text-[#4e7354]'>Coupon discount</dt><dd className='text-[#4e7354]'>−{order.discount}</dd></> : null}
            <dt className='text-[#71695d]'>Shipping</dt><dd>{order.shipping}</dd>
            <dt className='text-[#71695d]'>Tax</dt><dd>{order.tax}</dd>
            <dt className='mt-1 border-t border-[#ded8ce] pt-4 font-heading text-base font-medium'>Total</dt>
            <dd className='mt-1 border-t border-[#ded8ce] pt-4 font-heading text-lg font-medium'>{order.total}</dd>
          </dl>

          {order.coupons.length ? (
            <div className='mt-5 flex flex-wrap gap-2'>
              {order.coupons.map(coupon => <span key={coupon.code} className='inline-flex items-center gap-2 rounded-full border border-[#cbd9c9] bg-[#f2f7f1] px-3 py-2 text-xs text-[#496149]'><Check className='size-3.5' />{coupon.code.toUpperCase()} · −{coupon.discount}</span>)}
            </div>
          ) : null}
        </section>

        <aside className='space-y-5'>
          <AddressCard icon={<MapPin />} title='Delivery address' lines={order.shippingAddress} />
          <AddressCard icon={<Mail />} title='Billing details' lines={[order.email, ...order.billingAddress]} />
          {order.note ? (
            <section className='rounded-xl border border-[#e2ddd4] bg-white p-5'>
              <h2 className='font-heading text-lg font-medium'>Order note</h2>
              <p className='mt-2 text-sm leading-6 text-[#71695d]'>{order.note}</p>
            </section>
          ) : null}
          <section className='rounded-xl border border-brand-gold-line bg-brand-gold-soft p-5'>
            <div className='flex gap-3'><ShieldCheck className='mt-0.5 size-5 shrink-0 text-brand-gold-ink' /><div><h2 className='font-heading text-lg font-medium'>What happens next?</h2><p className='mt-1 text-xs leading-5 text-[#71695d]'>Our team will confirm and prepare your order. Keep your order number handy if you contact us.</p></div></div>
          </section>
        </aside>
      </div>

      <div className='mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-[#e2ddd4] bg-white p-5 sm:flex-row sm:p-6'>
        <p className='flex items-center gap-2 text-sm text-[#71695d]'><CircleHelp className='size-4 text-brand-gold-ink' />Need help with order #{order.number}?</p>
        <div className='flex flex-wrap justify-center gap-3'>
          <Link href='/pages/contact' className='inline-flex min-h-11 items-center rounded-md border border-[#302a23] px-5 text-xs font-medium uppercase tracking-[0.08em]'>Contact us</Link>
          <Link href='/collections/all' className='inline-flex min-h-11 items-center gap-3 rounded-md bg-[#302a23] px-5 text-xs font-medium uppercase tracking-[0.08em] text-white'>Continue shopping<ArrowRight className='size-4' /></Link>
        </div>
      </div>
    </div>
  )
}

function Meta ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className='border-b border-brand-gold-line sm:border-r sm:[&:nth-child(2)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2)]:border-r'><dt className='text-[0.65rem] uppercase tracking-[0.16em] text-[#81786c]'>{label}</dt><dd className={`mt-2 font-heading text-base font-medium capitalize ${accent ? 'text-[#557052]' : ''}`}>{value}</dd></div>
}

function AddressCard ({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <section className='rounded-xl border border-[#e2ddd4] bg-white p-5'>
      <div className='flex items-center gap-3 text-brand-gold-ink [&_svg]:size-4'>{icon}<h2 className='font-heading text-lg font-medium text-[#302a23]'>{title}</h2></div>
      <address className='mt-3 not-italic text-sm leading-6 text-[#71695d]'>{lines.map((line, index) => <span key={`${line}-${index}`} className='block'>{line}</span>)}</address>
    </section>
  )
}
