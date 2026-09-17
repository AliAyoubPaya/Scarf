import 'server-only'

import { cookies } from 'next/headers'
import { wooBaseUrl } from '@/lib/commerce/config'
import { money } from '@/lib/commerce/cart-types'
import { plainText } from '@/lib/commerce/normalize-product'

export const ORDER_CONFIRMATION_COOKIE = 'hs_order_confirmation'

export type OrderConfirmationSession = {
  id: number
  key: string
  email: string
  number: string
  paymentMethod: string
  note: string
  createdAt: string
}

type WooMoney = {
  currency_code: string
  currency_minor_unit: number
}

type WooOrder = {
  id: number
  status: string
  coupons?: { code: string; totals: WooMoney & { total_discount: string } }[]
  billing_address: WooAddress & { email?: string }
  shipping_address: WooAddress
  items: {
    key: string
    name: string
    quantity: number
    images?: { src: string }[]
    variation?: { attribute: string; value: string }[]
    item_data?: { display_key?: string; display_value?: string }[]
    totals: WooMoney & { line_subtotal: string; line_total: string }
  }[]
  totals: WooMoney & {
    total_items: string
    total_discount: string
    total_shipping: string
    total_tax: string
    total_price: string
  }
}

type WooAddress = {
  first_name?: string
  last_name?: string
  company?: string
  address_1?: string
  address_2?: string
  city?: string
  state?: string
  postcode?: string
  country?: string
  phone?: string
}

export type OrderConfirmation = {
  id: number
  number: string
  status: string
  paymentMethod: string
  note: string
  createdAt: string
  email: string
  billingAddress: string[]
  shippingAddress: string[]
  items: {
    key: string
    name: string
    quantity: number
    image: string | null
    options: string
    subtotal: string
    total: string
  }[]
  coupons: { code: string; discount: string }[]
  subtotal: string
  discount: string
  shipping: string
  tax: string
  total: string
}

export function encodeOrderConfirmationSession (session: OrderConfirmationSession) {
  return Buffer.from(JSON.stringify(session), 'utf8').toString('base64url')
}

function validSession (value: unknown): value is OrderConfirmationSession {
  if (!value || typeof value !== 'object') return false
  const session = value as Partial<OrderConfirmationSession>
  return Boolean(
    Number.isSafeInteger(session.id) && Number(session.id) > 0 &&
    typeof session.key === 'string' && /^wc_order_[A-Za-z0-9]+$/.test(session.key) &&
    typeof session.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(session.email) &&
    typeof session.number === 'string' && session.number.length <= 80 &&
    typeof session.paymentMethod === 'string' && session.paymentMethod.length <= 80 &&
    typeof session.note === 'string' && session.note.length <= 500 &&
    typeof session.createdAt === 'string' && !Number.isNaN(Date.parse(session.createdAt))
  )
}

async function readSession (orderId: number) {
  const encoded = (await cookies()).get(ORDER_CONFIRMATION_COOKIE)?.value
  if (!encoded || encoded.length > 3000) return null
  try {
    const session = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    return validSession(session) && session.id === orderId ? session : null
  } catch {
    return null
  }
}

function addressLines (address: WooAddress) {
  return [
    [address.first_name, address.last_name].filter(Boolean).join(' '),
    address.company,
    address.address_1,
    address.address_2,
    [address.city, address.state, address.postcode].filter(Boolean).join(', '),
    address.country,
    address.phone
  ].filter((line): line is string => Boolean(line)).map(plainText)
}

export async function getOrderConfirmation (orderId: number): Promise<OrderConfirmation | null> {
  if (!Number.isSafeInteger(orderId) || orderId <= 0) return null
  const session = await readSession(orderId)
  if (!session) return null

  const endpoint = new URL(`/wp-json/wc/store/v1/order/${orderId}`, wooBaseUrl())
  endpoint.searchParams.set('key', session.key)
  endpoint.searchParams.set('billing_email', session.email)
  const response = await fetch(endpoint, {
    headers: { 'Cache-Control': 'no-store' },
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(15000)
  })
  if (!response.ok) return null
  const order = await response.json() as WooOrder
  if (order.id !== orderId || !order.totals) return null

  const format = (amount: string, currency: WooMoney = order.totals) =>
    money(amount || '0', currency.currency_code, currency.currency_minor_unit)

  return {
    id: order.id,
    number: session.number,
    status: plainText(order.status || 'received'),
    paymentMethod: session.paymentMethod,
    note: session.note,
    createdAt: session.createdAt,
    email: plainText(order.billing_address?.email || session.email),
    billingAddress: addressLines(order.billing_address || {}),
    shippingAddress: addressLines(order.shipping_address || {}),
    coupons: (order.coupons || []).map(coupon => ({
      code: plainText(coupon.code),
      discount: format(coupon.totals.total_discount, coupon.totals)
    })),
    items: (order.items || []).map(item => ({
      key: item.key,
      name: plainText(item.name),
      quantity: item.quantity,
      image: item.images?.[0]?.src || null,
      options: [
        ...(item.variation || []).map(option => `${plainText(option.attribute)}: ${plainText(option.value)}`),
        ...(item.item_data || []).map(option => `${plainText(option.display_key || '')}: ${plainText(option.display_value || '')}`)
      ].filter(value => value !== ': ').join(' · '),
      subtotal: format(item.totals.line_subtotal, item.totals),
      total: format(item.totals.line_total, item.totals)
    })),
    subtotal: format(order.totals.total_items),
    discount: format(order.totals.total_discount),
    shipping: format(order.totals.total_shipping),
    tax: format(order.totals.total_tax),
    total: format(order.totals.total_price)
  }
}
