import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// SOON Devnet Configuration
export const SOLANA_RPC_URL = "https://rpc.devnet.soo.network/rpc";
export const SOLANA_NETWORK = "devnet";

// Create connection instance
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Program ID - Replace with your actual program ID
export const PROGRAM_ID = new PublicKey("7qhC7bD9cDV9LTwjgVmGJHs5rGtrMY4pSBw1KswuaBfk");

// Export network configuration
export const networkConfig = {
  name: SOLANA_NETWORK,
  endpoint: SOLANA_RPC_URL,
  connection: connection,
  programId: PROGRAM_ID,
};
