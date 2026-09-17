import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { SiteContainer } from '@/components/local/site-container'
import { SiteFooter } from '@/components/local/site-footer'
import { SiteHeader } from '@/components/local/site-header'
import { OrderConfirmationDetails } from '@/components/local/order/order-confirmation-details'
import { getOrderConfirmation } from '@/lib/commerce/order-confirmation'

export const metadata = {
  title: 'Order confirmed — HS by Saman',
  robots: { index: false, follow: false }
}

export default function OrderConfirmationPage ({ params }: PageProps<'/order-confirmation/[orderId]'>) {
  return (
    <div className='min-h-screen bg-[#fbfaf8] text-[#302a23]'>
      <SiteHeader />
      <main>
        <SiteContainer>
          <Suspense fallback={<ConfirmationLoading />}>
            <ConfirmationContent params={params} />
          </Suspense>
        </SiteContainer>
      </main>
      <SiteFooter />
    </div>
  )
}

async function ConfirmationContent ({ params }: { params: PageProps<'/order-confirmation/[orderId]'>['params'] }) {
  const { orderId: rawOrderId } = await params
  if (!/^\d{1,12}$/.test(rawOrderId)) notFound()
  const order = await getOrderConfirmation(Number(rawOrderId))

  if (!order) {
    return (
      <section className='mx-auto my-16 max-w-2xl rounded-2xl border border-brand-gold-line bg-white p-8 text-center sm:p-12'>
        <AlertCircle className='mx-auto size-10 text-brand-gold-ink' strokeWidth={1.3} />
        <h1 className='mt-5 font-heading text-3xl font-light'>This confirmation link is unavailable.</h1>
        <p className='mx-auto mt-3 max-w-lg text-sm leading-6 text-[#71695d]'>For your privacy, order details are available only in the browser that placed the order. Check your confirmation email or contact us for help.</p>
        <div className='mt-7 flex flex-wrap justify-center gap-3'><Link href='/pages/contact' className='inline-flex min-h-11 items-center rounded border border-[#302a23] px-5 text-sm'>Contact us</Link><Link href='/collections/all' className='inline-flex min-h-11 items-center rounded bg-[#302a23] px-5 text-sm text-white'>Continue shopping</Link></div>
      </section>
    )
  }

  return <OrderConfirmationDetails order={order} />
}

function ConfirmationLoading () {
  return <p role='status' className='py-28 text-center text-sm text-[#71695d]'>Preparing your order confirmation…</p>
}
