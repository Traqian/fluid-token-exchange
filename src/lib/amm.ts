import { parseEther, formatEther } from 'ethers';
import { Pool } from './types';

// Calculate the amount of output token given an input amount
export function calculateSwapOutput(
  pool: Pool,
  inputAmount: string,
  isAtoB: boolean
): string {
  if (!inputAmount || parseFloat(inputAmount) <= 0) return "0";

  try {
    const inputAmountBN = parseEther(inputAmount);
    
    // Extract the relevant pool balances based on swap direction
    const inputBalance = parseEther(isAtoB ? pool.balanceA : pool.balanceB);
    const outputBalance = parseEther(isAtoB ? pool.balanceB : pool.balanceA);
    
    // Calculate fee amount
    const feeMultiplier = 1 - pool.fee / 100;
    const inputAmountWithFee = inputAmountBN * BigInt(Math.floor(feeMultiplier * 1000)) / 1000n;
    
    // Apply constant product formula: x * y = k
    // (x + dx) * (y - dy) = k
    // dy = y - k / (x + dx)
    // dy = y - (x * y) / (x + dx * feeMultiplier)
    // dy = y * (1 - x / (x + dx * feeMultiplier))
    // dy = y * (dx * feeMultiplier) / (x + dx * feeMultiplier)
    
    const numerator = inputAmountWithFee * outputBalance;
    const denominator = inputBalance + inputAmountWithFee;
    
    const outputAmount = numerator / denominator;
    
    return formatEther(outputAmount);
  } catch (error) {
    console.error("Error calculating swap output:", error);
    return "0";
  }
}

// Calculate required token amounts for adding liquidity
export function calculateRequiredAmounts(
  pool: Pool,
  tokenAAmount: string
): { tokenBAmount: string } {
  if (!tokenAAmount || parseFloat(tokenAAmount) <= 0) {
    return { tokenBAmount: "0" };
  }

  try {
    // Calculate based on the current ratio in the pool
    const ratio = parseFloat(pool.balanceB) / parseFloat(pool.balanceA);
    const tokenBAmount = (parseFloat(tokenAAmount) * ratio).toString();
    
    return { tokenBAmount };
  } catch (error) {
    console.error("Error calculating required amounts:", error);
    return { tokenBAmount: "0" };
  }
}

// Calculate LP tokens to be minted when adding liquidity
export function calculateLPTokensMinted(
  pool: Pool,
  tokenAAmount: string,
  tokenBAmount: string
): string {
  if (
    !tokenAAmount ||
    !tokenBAmount ||
    parseFloat(tokenAAmount) <= 0 ||
    parseFloat(tokenBAmount) <= 0
  ) {
    return "0";
  }

  try {
    // The simplest way is to mint LP tokens proportional to the contribution
    // relative to the existing pool
    const shareOfPool = parseFloat(tokenAAmount) / parseFloat(pool.balanceA);
    const lpTokensToMint = shareOfPool * parseFloat(pool.totalLPTokens);
    
    return lpTokensToMint.toString();
  } catch (error) {
    console.error("Error calculating LP tokens:", error);
    return "0";
  }
}

// Calculate token amounts to be received when removing liquidity
export function calculateRemoveLiquidity(
  pool: Pool,
  lpTokenAmount: string
): { tokenAAmount: string; tokenBAmount: string } {
  if (!lpTokenAmount || parseFloat(lpTokenAmount) <= 0) {
    return { tokenAAmount: "0", tokenBAmount: "0" };
  }

  try {
    // Calculate the share of the pool
    const shareOfPool = parseFloat(lpTokenAmount) / parseFloat(pool.totalLPTokens);
    
    // Calculate token amounts based on the share
    const tokenAAmount = (shareOfPool * parseFloat(pool.balanceA)).toString();
    const tokenBAmount = (shareOfPool * parseFloat(pool.balanceB)).toString();
    
    return { tokenAAmount, tokenBAmount };
  } catch (error) {
    console.error("Error calculating remove liquidity amounts:", error);
    return { tokenAAmount: "0", tokenBAmount: "0" };
  }
}

// Simulate executing a swap
export function executeSwap(
  pool: Pool,
  inputAmount: string,
  isAtoB: boolean
): {
  newPool: Pool;
  outputAmount: string;
} {
  if (!inputAmount || parseFloat(inputAmount) <= 0) {
    return { newPool: { ...pool }, outputAmount: "0" };
  }

  try {
    const outputAmount = calculateSwapOutput(pool, inputAmount, isAtoB);
    
    // Update pool balances
    const newPool = { ...pool };
    if (isAtoB) {
      newPool.balanceA = (parseFloat(pool.balanceA) + parseFloat(inputAmount)).toString();
      newPool.balanceB = (parseFloat(pool.balanceB) - parseFloat(outputAmount)).toString();
    } else {
      newPool.balanceB = (parseFloat(pool.balanceB) + parseFloat(inputAmount)).toString();
      newPool.balanceA = (parseFloat(pool.balanceA) - parseFloat(outputAmount)).toString();
    }
    
    return { newPool, outputAmount };
  } catch (error) {
    console.error("Error executing swap:", error);
    return { newPool: { ...pool }, outputAmount: "0" };
  }
}

// Simulate adding liquidity
export function executeAddLiquidity(
  pool: Pool,
  tokenAAmount: string,
  tokenBAmount: string
): {
  newPool: Pool;
  lpTokensMinted: string;
} {
  if (
    !tokenAAmount ||
    !tokenBAmount ||
    parseFloat(tokenAAmount) <= 0 ||
    parseFloat(tokenBAmount) <= 0
  ) {
    return { newPool: { ...pool }, lpTokensMinted: "0" };
  }

  try {
    const lpTokensMinted = calculateLPTokensMinted(pool, tokenAAmount, tokenBAmount);
    
    // Update pool balances and total LP tokens
    const newPool = { ...pool };
    newPool.balanceA = (parseFloat(pool.balanceA) + parseFloat(tokenAAmount)).toString();
    newPool.balanceB = (parseFloat(pool.balanceB) + parseFloat(tokenBAmount)).toString();
    newPool.totalLPTokens = (parseFloat(pool.totalLPTokens) + parseFloat(lpTokensMinted)).toString();
    
    return { newPool, lpTokensMinted };
  } catch (error) {
    console.error("Error adding liquidity:", error);
    return { newPool: { ...pool }, lpTokensMinted: "0" };
  }
}

// Simulate removing liquidity
export function executeRemoveLiquidity(
  pool: Pool,
  lpTokenAmount: string
): {
  newPool: Pool;
  tokenAAmount: string;
  tokenBAmount: string;
} {
  if (!lpTokenAmount || parseFloat(lpTokenAmount) <= 0) {
    return { newPool: { ...pool }, tokenAAmount: "0", tokenBAmount: "0" };
  }

  try {
    const { tokenAAmount, tokenBAmount } = calculateRemoveLiquidity(pool, lpTokenAmount);
    
    // Update pool balances and total LP tokens
    const newPool = { ...pool };
    newPool.balanceA = (parseFloat(pool.balanceA) - parseFloat(tokenAAmount)).toString();
    newPool.balanceB = (parseFloat(pool.balanceB) - parseFloat(tokenBAmount)).toString();
    newPool.totalLPTokens = (parseFloat(pool.totalLPTokens) - parseFloat(lpTokenAmount)).toString();
    
    return { newPool, tokenAAmount, tokenBAmount };
  } catch (error) {
    console.error("Error removing liquidity:", error);
    return { newPool: { ...pool }, tokenAAmount: "0", tokenBAmount: "0" };
  }
}
