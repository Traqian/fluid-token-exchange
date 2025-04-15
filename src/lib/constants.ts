
import { Token, Pool } from './types';

export const ALPHA_TOKEN: Token = {
  name: "Alpha",
  symbol: "ALPHA",
  decimals: 18,
};

export const BETA_TOKEN: Token = {
  name: "Beta",
  symbol: "BETA",
  decimals: 18,
};

// Initial pool state
export const INITIAL_POOL: Pool = {
  tokenA: ALPHA_TOKEN,
  tokenB: BETA_TOKEN,
  balanceA: "1000",
  balanceB: "1000",
  totalLPTokens: "1000", // Initial LP supply
  fee: 0.3, // 0.3% fee
};

// To simulate wallet connection
export const MOCK_WALLET = {
  address: "0x1234...5678",
  alphaBalance: "10000",
  betaBalance: "10000",
  lpTokenBalance: "0",
};

export const CHAIN_IDS = {
  ethereum: "0x1",
  goerli: "0x5",
  sepolia: "0xaa36a7",
};
