export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number;
  tokens: {
    [key: string]: number;
  };
  keypair?: any; // Storing the Solana Keypair object
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface TradeData {
  time: string;
  price: number;
  volume: number;
}

export enum Tab {
  DASHBOARD = 'DASHBOARD',
  SWAP = 'SWAP',
  CHAT = 'CHAT',
  AIRDROP = 'AIRDROP'
}

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
}