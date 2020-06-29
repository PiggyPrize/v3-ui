export const SUPPORTED_NETWORKS = [3, 42, 31337, 1234]

export const MAINNET_POLLING_INTERVAL = 15000

export const MAGIC_EMAIL = 'magic-email'
export const MAGIC_IS_LOGGED_IN = 'magic-signed-in'

let cookieOptions = { sameSite: 'strict' }
if (process.env.NEXT_JS_DOMAIN_NAME) {
  cookieOptions = {
    ...cookieOptions,
    domain: `.${process.env.NEXT_JS_DOMAIN_NAME}`
  }
}

export const COOKIE_OPTIONS = cookieOptions

export const CONTRACT_ADDRESSES = {
  1: {
    PRIZE_POOL_CONTRACT_ADDRESS: ''
  },
  31337: {
    PRIZE_POOL_CONTRACT_ADDRESS: '0x74E9Fb436C558a00fc77A0fEF41CE26aB3e923F2'
  },
  42: {
    DAI_PRIZE_POOL_CONTRACT_ADDRESS: '0x59A0ED7BE8117369BDd1cd2C4e3C35958C5149f1',
    USDC_PRIZE_POOL_CONTRACT_ADDRESS: '0xB2eCdC06e07E1bff27D13440bc40351D769d7353',
    USDT_PRIZE_POOL_CONTRACT_ADDRESS: '0x55907a3699Bd33bE7DCC3e754ff4Cbf54bD72145',
  }
}
