// export const SUPPORTED_NETWORKS = [1, 3, 42, 31337, 1234]
export const SUPPORTED_CHAIN_IDS = [42, 31337, 1234]

export const MAINNET_POLLING_INTERVAL = 10000
// export const MAINNET_POLLING_INTERVAL = 15000

// cookie names
export const MAGIC_EMAIL = 'magic-email'
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

export const CONFETTI_DURATION_MS = 12000

const domain = process.env.NEXT_JS_DOMAIN_NAME && `.${process.env.NEXT_JS_DOMAIN_NAME}`

export const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: process.env.NEXT_JS_DOMAIN_NAME === 'pooltogether.com',
  domain
}

export const CONTRACT_ADDRESSES = {
  1: {
    DAI_POOL_CONTRACT_ADDRESS: '',
    USDC_POOL_CONTRACT_ADDRESS: '',
    USDT_POOL_CONTRACT_ADDRESS: '',
  },
  31337: {
    DAI_POOL_CONTRACT_ADDRESS: '',
    USDC_POOL_CONTRACT_ADDRESS: '',
    USDT_POOL_CONTRACT_ADDRESS: '',
  },
  42: {
    DAI_POOL_CONTRACT_ADDRESS: '0x3a6fae0734f3263e7e1d722140e38db998416abd',
    USDC_POOL_CONTRACT_ADDRESS: '0x4a99a46c0b822b57763edece8fcebc72943ebb6e',
    USDT_POOL_CONTRACT_ADDRESS: '0xeecf3405ce385ba294ef2ac78e9a53652d6c163d',
  }
}
