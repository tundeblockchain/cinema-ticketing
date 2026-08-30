# cinema-ticketing

React front end for cinema ticketing system using blockchain on Avalanche testnet.

This is a proof of concept and is NOT production ready.

This project uses Vite, React 19, TypeScript 5, and wagmi v2 with viem for Web3 interactions.

## Pages

- **Home Page** - Landing page with featured films
- **Films Page** - Lists all films in cinemas
- **Film Info Page** - Details about selected film
- **My Tickets Page** - Displays all tickets held by connected address
- **Booking Page** - Handles booking tickets and payments

## Smart Contracts

The project relies on blockchain contracts from [cinema-ticketing-backend](https://github.com/tundeblockchain/cinema-ticketing-backend.git).

- **CinemaInfo** - Handles cinema info: chains, locations, screens, films, actors
- **CinemaMarket** - Handles ticket transactions and NFT minting

## Environment Variables

Create a `.env` file with the following variables (see `.env.example`):

```bash
# Pinata IPFS Configuration
VITE_IPFS_DEDICATED_GATEWAY=your-gateway.mypinata.cloud
VITE_PINATA_JWT=your_pinata_jwt_token

# Smart Contract Addresses (Avalanche Fuji Testnet)
VITE_CINEMA_INFO_ADDRESS=0x...
VITE_CINEMA_MARKET_ADDRESS=0x...
VITE_USDC_ADDRESS=0x...
```

## Development

### Prerequisites

- Node.js 20 or later

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

The app will open at http://localhost:3000.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run tests

```bash
npm test
```

Or in watch mode:

```bash
npm run test:watch
```

## Tech Stack

- **Vite 6** - Build tool
- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **wagmi v2 + viem** - Ethereum interactions
- **ethers v6** - Ethereum utilities
- **TanStack Query** - Data fetching
- **Tailwind CSS 3** - Utility-first CSS
- **Bootstrap 5 + React Bootstrap** - UI components
- **MUI v6** - Material UI components
- **Headless UI 2** - Unstyled accessible components
- **React Router 7** - Client-side routing
- **Pinata SDK** - IPFS integration
- **Vitest** - Test runner
- **React Testing Library** - Component testing
