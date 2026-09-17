import { cookies } from 'next/headers'
import { commerceReady } from '@/lib/commerce/config'
import { sameOrigin } from '@/lib/commerce/security'
import { CART_COOKIE, CommerceError, storeCart, summarizeCart } from '@/lib/commerce/woo-cart'
import { plainText } from '@/lib/commerce/normalize-product'

export const runtime = 'nodejs'

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })

function couponCode (value: unknown) {
  if (typeof value !== 'string') return ''
  return plainText(value).trim().slice(0, 100)
}

async function updateCoupon (request: Request, remove: boolean) {
  if (!sameOrigin(request)) return json({ error: 'Invalid request origin' }, 403)
  if (!commerceReady()) return json({ error: 'WooCommerce coupons are not connected yet.' }, 503)
  if (Number(request.headers.get('content-length') || 0) > 1000) return json({ error: 'Coupon request is too large.' }, 413)

  try {
    const body = await request.json()
    const code = couponCode(body.code)
    if (!code) return json({ error: 'Enter a valid coupon code.' }, 400)
    if (!(await cookies()).has(CART_COOKIE)) return json({ error: 'Your bag is empty or the session has expired.' }, 409)

    const cart = await storeCart(remove ? '/remove-coupon' : '/apply-coupon', { code })
    return json(summarizeCart(cart))
  } catch (error) {
    return json(
      { error: error instanceof CommerceError ? error.message : 'The coupon could not be updated.' },
      error instanceof CommerceError ? error.status : 502
    )
  }
}

export async function POST (request: Request) {
  return updateCoupon(request, false)
}

export async function DELETE (request: Request) {
  return updateCoupon(request, true)
}
