import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Use devnet for development and testing
export const network = WalletAdapterNetwork.Devnet;
export const endpoint = clusterApiUrl(network);

// Create connection with retry logic
export const getConnection = async () => {
  const connection = new Connection(endpoint, 'confirmed');
  try {
    // Test connection
    await connection.getLatestBlockhash();
    return connection;
  } catch (error) {
    console.error('Failed to connect to Solana network:', error);
    throw new Error('Failed to connect to Solana network. Please try again later.');
  }
};

// Initialize wallets with error handling
export const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new LedgerWalletAdapter(),
  new TorusWalletAdapter(),
].map(wallet => {
  const originalConnect = wallet.connect.bind(wallet);
  wallet.connect = async () => {
    try {
      await originalConnect();
    } catch (error: any) {
      console.error(`${wallet.name} connection error:`, error);
      throw new Error(`Failed to connect ${wallet.name}: ${error.message || 'Unknown error'}`);
    }
  };
  return wallet;
});

export const walletConfig = {
  autoConnect: false,
  network,
  endpoint,
  wallets,
};
