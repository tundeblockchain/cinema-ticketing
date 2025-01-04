# cinema-ticketing
 React front end up for cinema ticketing system
 
This is a proof of concept and it is NOT production ready.
This is a react front end project which uses blockchain to issue and maintain cinema tickets on the Avalanche testnet.

The webapp consists of the following pages
- Home Page
- Films Page (Lists all films in cinemas)
- Film Info Page (Details about selected film)
- My Tickets Page (Displays all ticjets held by connected address)
- Booking Page (handles booking tickets and payments)

The project relies on blockchain contracts created on this project
https://github.com/tundeblockchain/cinema-ticketing-backend.git

There are 2 main contracts this front end project relies on
-  CinemaInfo which handles all cinema info such as cinema chains, locations, screens, films and actors
-  CinemaMarket which handles the ticket transactions

# Environment Variables
This project requires a .env file with the following variables
- REACT_APP_IPFS_DEDICATED_GATEWAY - dedicated Pinata ipfs gateway url
- REACT_APP_PINATA_JWT - JWT token for Pinata IPFS Gateway
- REACT_APP_CINEMA_INFO_ADDRESS - blockchain contract address of the cinema info contract
- REACT_APP_CINEMA_MARKET_ADDRESS - blockchain contract address of the cinema market contract
- REACT_APP_USDC_ADDRESS - blockchain contract address of USDC contract ( this is the main currency used for transactions

# Run Project
- first install all dependencies using npm install
- run 'npm run start' command to start the project
