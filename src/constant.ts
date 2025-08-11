import { defineChain } from 'viem'

export const hyperion = defineChain({
  id: 133717,
  name: 'Hyperion tetsnet',
  nativeCurrency: { name: 'tMETIS', symbol: 'tMETIS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://hyperion-testnet.metisdevops.link'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperionscan',
      url: 'https://hyperion-testnet-explorer.metisdevops.link',
    },
  },
  testnet: true,
})
