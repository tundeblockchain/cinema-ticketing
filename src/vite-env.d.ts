/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IPFS_DEDICATED_GATEWAY: string;
  readonly VITE_PINATA_JWT: string;
  readonly VITE_CINEMA_INFO_ADDRESS: string;
  readonly VITE_CINEMA_MARKET_ADDRESS: string;
  readonly VITE_USDC_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
