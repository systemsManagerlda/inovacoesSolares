import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

const url = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET

if (!url) throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL não definida')
if (!consumerKey) throw new Error('WOOCOMMERCE_CONSUMER_KEY não definida')
if (!consumerSecret) throw new Error('WOOCOMMERCE_CONSUMER_SECRET não definida')

export const api = new WooCommerceRestApi({
  url: url,
  consumerKey: consumerKey,
  consumerSecret: consumerSecret,
  version: 'wc/v3',
})