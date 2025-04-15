
export interface Token {
  name: string;
  symbol: string;
  balance?: string;
  decimals: number;
}

export interface Pool {
  tokenA: Token;
  tokenB: Token;
  balanceA: string;
  balanceB: string;
  totalLPTokens: string;
  fee: number; // As a percentage (e.g., 0.3 for 0.3%)
}

export enum SwapOperation {
  Swap = "swap",
  AddLiquidity = "addLiquidity",
  RemoveLiquidity = "removeLiquidity",
}

export enum WalletConnectionStatus {
  Connected = "connected",
  Disconnected = "disconnected",
  Connecting = "connecting",
  Error = "error",
}

export interface WalletState {
  status: WalletConnectionStatus;
  address?: string;
  chainId?: string;
  error?: string;
}
