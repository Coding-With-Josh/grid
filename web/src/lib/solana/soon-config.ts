import { Connection, PublicKey } from '@solana/web3.js';

// SOON Network Configuration
export const SOON_CONFIG = {
    RPC_URL: "https://rpc.devnet.soo.network/rpc",
    NETWORK: "devnet",
    EXPLORER_URL: "https://explorer.devnet.soo.network",
    FAUCET_URL: "https://faucet.soo.network",
    BRIDGE_URL: "https://bridge.devnet.soo.network/home"
};

// Create SOON-specific connection instance
export const soonConnection = new Connection(SOON_CONFIG.RPC_URL, 'confirmed');

// Helper functions for SOON integration
export const getSoonExplorerUrl = (txHash: string): string => {
    return `${SOON_CONFIG.EXPLORER_URL}/tx/${txHash}`;
};

export const getBridgeUrl = (): string => {
    return SOON_CONFIG.BRIDGE_URL;
};

export const getFaucetUrl = (): string => {
    return SOON_CONFIG.FAUCET_URL;
};
