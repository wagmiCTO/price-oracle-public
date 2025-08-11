# DOGE Price Oracle Offchain Service

A TypeScript-based offchain service that fetches DOGE/USDT prices from Binance and updates an oracle smart contract on the Hyperion testnet. The service monitors blockchain blocks and updates the oracle price when specific conditions are met.

## 🚀 Features

- **Real-time Price Fetching**: Retrieves current DOGE/USDT prices from Binance API
- **Block-based Updates**: Monitors new blockchain blocks to trigger price updates
- **Smart Update Logic**: Only updates when price changes and sufficient time has passed
- **Gas Optimization**: Estimates gas usage with buffer to prevent transaction failures
- **Error Handling**: Comprehensive error handling and logging
- **Type Safety**: Built with TypeScript for better development experience

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A private key for the wallet that will update the oracle contract
- Access to Hyperion testnet

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd doge-price-oracle-offchain
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
touch .env
```

4. Add your private key to the `.env` file:
```env
PRIVATE_KEY=0x...your_private_key_here
```

⚠️ **Warning**: Never commit your private key to version control. Make sure `.env` is in your `.gitignore` file.

## 🏃‍♂️ Usage

### Start the Oracle Service

```bash
npm start
```

The service will:
1. Connect to the Hyperion testnet
2. Fetch the current DOGE price from Binance
3. Check the current oracle price
4. Monitor for new blocks
5. Update the oracle when conditions are met

### Update Conditions

The oracle price is updated when all of the following conditions are met:
- A new block is detected
- At least 10 seconds have passed since the last update
- The price has changed from the last recorded price

## 📁 Project Structure

```
src/
├── index.ts                 # Main entry point and block monitoring logic
├── config.ts                # Configuration settings and environment variables
├── constant.ts              # Blockchain network definitions (Hyperion testnet)
├── doge-oracle-service.ts   # Core oracle service functions
└── abis/
    └── oracle-abi.ts        # Smart contract ABI definitions
```

## ⚙️ Configuration

The service is configured through `src/config.ts`:

- **ORACLE_ADDRESS**: The smart contract address on Hyperion testnet
- **RPC_URL**: Hyperion testnet RPC endpoint
- **BINANCE_API_URL**: Binance API endpoint for DOGE/USDT price
- **PRICE_MULTIPLIER**: Scaling factor for price precision
- **CHAIN**: Hyperion testnet chain configuration

## 🔧 API Reference

### Core Functions

#### `fetchDogePriceFromBinance(): Promise<number>`
Fetches the current DOGE/USDT price from Binance API.

#### `getCurrentOraclePrice(): Promise<{price: number, timestamp: number}>`
Retrieves the current price and timestamp from the oracle contract.

#### `updateOraclePrice(price: number): Promise<string>`
Updates the oracle contract with a new DOGE price. Returns the transaction hash.

## 🌐 Network Information

**Hyperion Testnet**
- Chain ID: 133717
- Native Currency: tMETIS
- RPC URL: https://hyperion-testnet.metisdevops.link
- Block Explorer: https://hyperion-testnet-explorer.metisdevops.link

## 📊 Monitoring and Logs

The service provides detailed console logging including:
- Current DOGE price from Binance
- Current oracle price and last update timestamp
- New block detections
- Transaction details and confirmations
- Gas estimation and usage
- Error messages and debugging information

## 🔍 Example Output

```
Starting DOGE price oracle service...
Will update prices when:
1. New block is detected
2. At least 15 seconds passed since last update
3. The price has changed
Current DOGE price from Binance: $0.2845
Current oracle price: $0.2840 (updated at: 8/11/2025, 2:30:45 PM)
Current block number: 1234567
New block detected: 1234568
Updating oracle price to: 0.2845 (28450000)
Estimated gas: 45000, with buffer: 54000
Transaction sent: 0x1234...5678
Transaction confirmed in block 1234568
Transaction successful
```

## 🚨 Error Handling

The service includes comprehensive error handling for:
- Network connectivity issues
- API rate limiting
- Transaction failures
- Gas estimation errors
- Contract interaction errors

## 🔒 Security Considerations

- Store private keys securely in environment variables
- Never commit sensitive information to version control
- Use testnet for development and testing
- Implement proper access controls for production deployments

## 🧪 Development

### Code Formatting
The project uses Biome for code formatting and linting:

```bash
npx biome check src/
npx biome format src/ --write
```

### TypeScript Compilation
Compile TypeScript files:

```bash
npx tsc
```

## 📝 Scripts

- `npm start`: Start the oracle service
- `npm test`: Run tests (placeholder)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid private key" error**: Ensure your private key is properly formatted and starts with "0x"
2. **Connection timeout**: Check your internet connection and RPC endpoint availability
3. **Gas estimation failed**: The transaction might revert; check contract state and parameters
4. **Price not updating**: Verify that the price has actually changed and sufficient time has passed

### Support

For issues and questions, please open an issue in the GitHub repository.
