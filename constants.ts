export const SOLANA_RPC_URL = "https://rpc.ankr.com/solana";

export const DIAMOND_TOKEN_ADDRESS = "5zJo2GzYRgiZw5j3SBNpuqVcGok35kT3ADwsw74yJWV6";

export const MOCK_CHART_DATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  price: 120 + Math.random() * 20 - 10,
  volume: Math.floor(Math.random() * 10000) + 5000,
}));

export const INITIAL_WALLET_STATE = {
  connected: false,
  publicKey: null,
  balance: 0,
  tokens: {},
};

export const GEMINI_MODEL = "gemini-2.5-flash";