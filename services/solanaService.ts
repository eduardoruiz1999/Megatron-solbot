import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import bs58 from "bs58";
import { WalletState } from "../types";
import { DIAMOND_TOKEN_ADDRESS, SOLANA_RPC_URL } from "../constants";

// Initialize Connection
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export const importWallet = async (privateKeyString: string): Promise<WalletState> => {
  try {
    // Sanitize input
    const cleanKey = privateKeyString.trim();
    
    // Decode private key (Base58)
    let secretKey: Uint8Array;
    try {
      secretKey = bs58.decode(cleanKey);
    } catch (e) {
      throw new Error("Invalid Base58 private key format.");
    }

    // Generate Keypair
    const keypair = Keypair.fromSecretKey(secretKey);
    const publicKey = keypair.publicKey;

    // Fetch Balance with timeout/error handling
    let balance = 0;
    try {
      balance = await connection.getBalance(publicKey);
    } catch (netError: any) {
      console.error("RPC Connection Error:", netError);
      // Check for common RPC errors
      if (netError.toString().includes('403') || netError.toString().includes('429')) {
        throw new Error("RPC Network congested (403/429). Try again later or use a custom RPC.");
      }
      throw new Error(`Failed to fetch balance: ${netError.message}`);
    }

    return {
      connected: true,
      publicKey: publicKey.toString(),
      balance: balance / LAMPORTS_PER_SOL,
      tokens: {
        [DIAMOND_TOKEN_ADDRESS]: 0 // Default to 0, actual token fetching requires SPL library which adds complexity
      },
      keypair: keypair
    };
  } catch (error: any) {
    console.error("Wallet Import Logic Error:", error);
    throw new Error(error.message || "Unknown error during wallet import");
  }
};

export const transferSOL = async (
  wallet: WalletState,
  toAddress: string,
  amount: number
): Promise<string> => {
  if (!wallet.keypair || !wallet.publicKey) throw new Error("Wallet not connected");

  try {
    const fromPubkey = new PublicKey(wallet.publicKey);
    const toPubkey = new PublicKey(toAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
    
    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet.keypair]
    );

    return signature;
  } catch (error: any) {
    console.error("Transfer Error:", error);
    throw new Error(error.message || "Transfer failed");
  }
};

// Keeping mock swap for UI demonstration as it requires complex DEX integration
export const performSwap = async (
  fromToken: string,
  toToken: string,
  amount: number
): Promise<{ success: boolean; txHash: string; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        txHash: "SimulatedHash..." + Math.random().toString(36).substring(7),
        message: `Successfully swapped ${amount} ${fromToken} for ${toToken}`
      });
    }, 2000);
  });
};

export const checkAirdropEligibility = async (address: string): Promise<boolean> => {
    // Simulating a check based on address characters for variety
    return address.length > 0 && (address.charCodeAt(0) % 2 === 0);
}

// Fallback mock connect if needed, but we prefer importWallet now
export const connectWallet = async (): Promise<WalletState> => {
    return {
        connected: false,
        publicKey: null,
        balance: 0,
        tokens: {},
        keypair: null
    }
};