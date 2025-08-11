import { http, createPublicClient } from 'viem'
import { CONFIG } from './config'
import {
  fetchDogePriceFromBinance,
  getCurrentOraclePrice,
  updateOraclePrice,
} from './doge-oracle-service'

const MIN_UPDATE_INTERVAL_MS = 10000

/**
 * Runs the main oracle price update loop that syncs with new blocks
 */
async function runOracleService() {
  console.log('Starting DOGE price oracle service...')
  console.log('Will update prices when:')
  console.log('1. New block is detected')
  console.log('2. At least 15 seconds passed since last update')
  console.log('3. The price has changed')

  // Create a public client to watch for new blocks
  const publicClient = createPublicClient({
    chain: CONFIG.CHAIN,
    transport: http(CONFIG.RPC_URL),
  })

  // Track the last block we processed
  let lastProcessedBlock = 0
  let lastPrice = 0
  let lastUpdateTimestamp = 0

  // Initial fetch to ensure everything works
  try {
    const currentPrice = await fetchDogePriceFromBinance()
    lastPrice = currentPrice
    console.log(`Current DOGE price from Binance: $${currentPrice}`)

    const oracleData = await getCurrentOraclePrice()
    console.log(
      `Current oracle price: $${oracleData.price} (updated at: ${new Date(Number(oracleData.timestamp) * 1000).toLocaleString()})`,
    )

    // Get current block number
    lastProcessedBlock = Number(await publicClient.getBlockNumber())
    console.log(`Current block number: ${lastProcessedBlock}`)
  } catch (error) {
    console.error('Error during initial setup:', error)
    process.exit(1)
  }

  // Create a block watcher
  const unwatch = publicClient.watchBlocks({
    onBlock: async (block) => {
      const blockNumber = Number(block.number)

      // Prevent duplicate processing
      if (blockNumber <= lastProcessedBlock) {
        return
      }

      console.log(`New block detected: ${blockNumber}`)
      lastProcessedBlock = blockNumber

      try {
        const currentTime = Date.now()
        const timePassedSinceLastUpdate = currentTime - lastUpdateTimestamp
        const hasMinIntervalPassed =
          timePassedSinceLastUpdate >= MIN_UPDATE_INTERVAL_MS

        if (!hasMinIntervalPassed) {
          console.log(
            `Only ${timePassedSinceLastUpdate}ms passed since last update (minimum: ${MIN_UPDATE_INTERVAL_MS}ms), skipping`,
          )
          return
        }

        // Fetch current price from Binance
        const currentPrice = await fetchDogePriceFromBinance()
        console.log(`Current DOGE price: $${currentPrice}`)

        // Check if the price has changed
        const hasPriceChanged = currentPrice !== lastPrice

        if (!hasPriceChanged) {
          console.log(`Price unchanged at $${currentPrice}, skipping update`)
          return
        }

        // All conditions met: new block, minimum time passed, price changed
        console.log('All conditions met for update:')
        console.log(`- New block: ${blockNumber}`)
        console.log(
          `- Time since last update: ${timePassedSinceLastUpdate}ms > ${MIN_UPDATE_INTERVAL_MS}ms`,
        )
        console.log(`- Price changed from $${lastPrice} to $${currentPrice}`)

        // Update the oracle contract
        await updateOraclePrice(currentPrice)
        lastPrice = currentPrice
        lastUpdateTimestamp = currentTime

        // Get the updated price from the oracle (optional, for verification)
        const updatedOracleData = await getCurrentOraclePrice()
        console.log(`Oracle price updated to $${updatedOracleData.price}`)
      } catch (error) {
        console.error('Error in price update process:', error)
      }
    },
  })

  // Handle cleanup on exit
  process.on('SIGINT', () => {
    console.log('Stopping price oracle service...')
    unwatch()
    process.exit(0)
  })
}

// Run the oracle service
runOracleService().catch((error) => {
  console.error('Fatal error in oracle service:', error)
  process.exit(1)
})
