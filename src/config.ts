import 'dotenv/config'
import type { Chain } from 'viem'
import { hyperion } from './constant'

export const CONFIG = {
  ORACLE_ADDRESS: '0xd2c6c162a1aa2511e35c229da62e5084d6762942',
  RPC_URL: hyperion.rpcUrls.default.http[0],
  BINANCE_API_URL:
    'https://api.binance.com/api/v3/ticker/price?symbol=DOGEUSDT',
  UPDATE_INTERVAL: 1000,
  PRICE_MULTIPLIER: 100000000,
  PRIVATE_KEY: process.env.PRIVATE_KEY || '0x',
  CHAIN: hyperion as Chain,
  CHAIN_ID: hyperion.id,
}
