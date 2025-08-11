import axios from 'axios'
import {
  http,
  createPublicClient,
  createWalletClient,
  formatUnits,
  parseUnits,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ORACLE_ABI } from './abis/oracle-abi'
import { CONFIG } from './config'

// Define the type for Binance API response
interface BinancePrice {
  symbol: string
  price: string
}

// Initialize the wallet client with your private key
const account = privateKeyToAccount(CONFIG.PRIVATE_KEY as `0x${string}`)
const walletClient = createWalletClient({
  account,
  chain: CONFIG.CHAIN,
  transport: http(CONFIG.RPC_URL),
})

// Initialize the public client
const publicClient = createPublicClient({
  chain: CONFIG.CHAIN,
  transport: http(CONFIG.RPC_URL),
})

/**
 * Fetches the current DOGE/USDT price from Binance API
 */
export async function fetchDogePriceFromBinance(): Promise<number> {
  try {
    const response = await axios.get<BinancePrice>(CONFIG.BINANCE_API_URL)
    return Number.parseFloat(response.data.price)
  } catch (error) {
    console.error('Error fetching DOGE price from Binance:', error)
    throw error
  }
}

/**
 * Gets the current DOGE price from the oracle contract
 */
export async function getCurrentOraclePrice() {
  try {
    const oraclePrice = await publicClient.readContract({
      address: CONFIG.ORACLE_ADDRESS as `0x${string}`,
      abi: ORACLE_ABI,
      functionName: 'getDogePrice',
    })

    // The return value is an array with [price, timestamp]
    const [price, timestamp] = oraclePrice as [bigint, bigint]

    return {
      price: Number(formatUnits(price, 8)), // Assuming 8 decimals
      timestamp: Number(timestamp),
    }
  } catch (error) {
    console.error('Error getting oracle price:', error)
    throw error
  }
}

/**
 * Updates the DOGE price on the oracle contract
 */
export async function updateOraclePrice(price: number) {
  try {
    // Convert price to the format expected by the contract
    const priceInContractFormat = parseUnits(price.toFixed(8), 8)

    console.log(`Updating oracle price to: ${price} (${priceInContractFormat})`)

    // Prepare the transaction parameters
    const txParams = {
      address: CONFIG.ORACLE_ADDRESS as `0x${string}`,
      abi: ORACLE_ABI,
      functionName: 'updateDogePrice',
      args: [priceInContractFormat],
    }

    // Estimate gas first
    try {
      const gasEstimate = await publicClient.estimateContractGas({
        ...txParams,
        account: account.address,
      })

      // Add 20% buffer to the gas estimate to avoid failures
      const gasLimit = BigInt(Math.floor(Number(gasEstimate) * 1.2))
      console.log(`Estimated gas: ${gasEstimate}, with buffer: ${gasLimit}`)

      // Send the transaction with the gas limit
      const hash = await walletClient.writeContract({
        ...txParams,
        gas: gasLimit,
      })

      console.log(`Transaction sent: ${hash}`)

      // Wait for the transaction to be mined
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`)

      if (receipt.status === 'success') {
        console.log('Transaction successful')
      } else {
        console.warn('Transaction reverted or failed')
      }

      return hash
    } catch (gasError) {
      console.error('Error estimating gas:', gasError)

      // If there's an error with gas estimation, we can try with a higher hardcoded gas limit
      console.log('Attempting transaction with hardcoded gas limit')
      const hardcodedGasLimit = BigInt(300000) // A conservative value

      const hash = await walletClient.writeContract({
        ...txParams,
        gas: hardcodedGasLimit,
      })

      console.log(`Transaction sent with hardcoded gas: ${hash}`)

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`)

      return hash
    }
  } catch (error) {
    console.error('Error updating oracle price:', error)

    throw error
  }
}
