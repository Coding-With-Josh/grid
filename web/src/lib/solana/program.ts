import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { networkConfig, PROGRAM_ID } from "./config";
import { soonConnection, getSoonExplorerUrl } from './soon-config';

export const GREETING_SIZE = 32;
export const GREETING_SEED = "hello";

export async function createGreetingAccount(
  wallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction> }
): Promise<{ greetedPubkey: PublicKey; signature: string; explorerUrl: string }> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const greetedPubkey = await PublicKey.createWithSeed(
    wallet.publicKey,
    GREETING_SEED,
    PROGRAM_ID
  );

  const lamports = await soonConnection.getMinimumBalanceForRentExemption(
    GREETING_SIZE
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: wallet.publicKey,
      basePubkey: wallet.publicKey,
      seed: GREETING_SEED,
      newAccountPubkey: greetedPubkey,
      lamports,
      space: GREETING_SIZE,
      programId: PROGRAM_ID,
    })
  );

  const signedTx = await wallet.signTransaction(transaction);
  const signature = await soonConnection.sendRawTransaction(
    signedTx.serialize()
  );
  await soonConnection.confirmTransaction(signature, "confirmed");

  return { 
    greetedPubkey, 
    signature,
    explorerUrl: getSoonExplorerUrl(signature)
  };
}

export async function sendHello(
  wallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction> },
  greetedPubkey: PublicKey
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const instruction = new TransactionInstruction({
    keys: [{ pubkey: greetedPubkey, isSigner: false, isWritable: true }],
    programId: PROGRAM_ID,
    data: Buffer.alloc(0),
  });

  const transaction = new Transaction().add(instruction);
  const signedTx = await wallet.signTransaction(transaction);
  const signature = await networkConfig.connection.sendRawTransaction(
    signedTx.serialize()
  );
  await networkConfig.connection.confirmTransaction(signature, "confirmed");

  return signature;
}

export async function requestAirdrop(
  wallet: { publicKey: PublicKey },
  amount: number = 1
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const signature = await networkConfig.connection.requestAirdrop(
    wallet.publicKey,
    amount * LAMPORTS_PER_SOL
  );
  await networkConfig.connection.confirmTransaction(signature, "confirmed");

  return signature;
}
