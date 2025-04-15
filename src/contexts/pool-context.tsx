
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Pool, SwapOperation } from '@/lib/types';
import { INITIAL_POOL } from '@/lib/constants';
import { 
  calculateSwapOutput, 
  executeSwap, 
  calculateRequiredAmounts, 
  executeAddLiquidity, 
  calculateRemoveLiquidity, 
  executeRemoveLiquidity 
} from '@/lib/amm';
import { useWallet } from './wallet-context';
import { toast } from 'sonner';

interface PoolContextType {
  pool: Pool;
  currentOperation: SwapOperation;
  setCurrentOperation: (operation: SwapOperation) => void;
  // Swap functions
  fromToken: string;
  setFromToken: (token: string) => void;
  toToken: string;
  setToToken: (token: string) => void;
  fromAmount: string;
  setFromAmount: (amount: string) => void;
  toAmount: string;
  swapTokens: () => void;
  executeSwapOperation: () => void;
  // Add liquidity functions
  tokenAAmount: string;
  setTokenAAmount: (amount: string) => void;
  tokenBAmount: string;
  setTokenBAmount: (amount: string) => void;
  lpTokensToReceive: string;
  executeAddLiquidityOperation: () => void;
  // Remove liquidity functions
  lpTokenAmount: string;
  setLpTokenAmount: (amount: string) => void;
  tokenAToReceive: string;
  tokenBToReceive: string;
  executeRemoveLiquidityOperation: () => void;
  // Reset functions
  resetInputs: () => void;
}

const PoolContext = createContext<PoolContextType | undefined>(undefined);

export const PoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isConnected, userBalances } = useWallet();
  
  // Pool state
  const [pool, setPool] = useState<Pool>(INITIAL_POOL);
  const [currentOperation, setCurrentOperation] = useState<SwapOperation>(SwapOperation.Swap);
  
  // Swap state
  const [fromToken, setFromToken] = useState<string>(pool.tokenA.symbol);
  const [toToken, setToToken] = useState<string>(pool.tokenB.symbol);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  
  // Add liquidity state
  const [tokenAAmount, setTokenAAmount] = useState<string>("");
  const [tokenBAmount, setTokenBAmount] = useState<string>("");
  const [lpTokensToReceive, setLpTokensToReceive] = useState<string>("0");
  
  // Remove liquidity state
  const [lpTokenAmount, setLpTokenAmount] = useState<string>("");
  const [tokenAToReceive, setTokenAToReceive] = useState<string>("0");
  const [tokenBToReceive, setTokenBToReceive] = useState<string>("0");

  // Reset all input fields
  const resetInputs = () => {
    setFromAmount("");
    setToAmount("");
    setTokenAAmount("");
    setTokenBAmount("");
    setLpTokenAmount("");
    setLpTokensToReceive("0");
    setTokenAToReceive("0");
    setTokenBToReceive("0");
  };

  // Swap functions
  useEffect(() => {
    if (fromAmount && fromAmount !== "0") {
      const isAtoB = fromToken === pool.tokenA.symbol;
      const calculatedToAmount = calculateSwapOutput(pool, fromAmount, isAtoB);
      setToAmount(calculatedToAmount);
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken, pool]);

  const swapTokens = () => {
    const tempFromToken = fromToken;
    const tempToToken = toToken;
    const tempFromAmount = fromAmount;
    const tempToAmount = toAmount;
    
    setFromToken(tempToToken);
    setToToken(tempFromToken);
    setFromAmount(tempToAmount);
    // toAmount will be calculated by the useEffect
  };

  const executeSwapOperation = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Check if user has enough balance
    const isFromTokenA = fromToken === pool.tokenA.symbol;
    const userBalance = isFromTokenA ? userBalances.alphaBalance : userBalances.betaBalance;
    
    if (parseFloat(fromAmount) > parseFloat(userBalance)) {
      toast.error(`Insufficient ${fromToken} balance`);
      return;
    }
    
    try {
      const isAtoB = fromToken === pool.tokenA.symbol;
      const { newPool, outputAmount } = executeSwap(pool, fromAmount, isAtoB);
      
      setPool(newPool);
      toast.success(`Swap executed successfully! Received ${outputAmount} ${toToken}`);
      resetInputs();
    } catch (error: any) {
      toast.error(`Failed to execute swap: ${error.message}`);
    }
  };

  // Add liquidity functions
  useEffect(() => {
    if (tokenAAmount && tokenAAmount !== "0") {
      // Calculate required token B amount based on current pool ratio
      const { tokenBAmount: calculatedBAmount } = calculateRequiredAmounts(pool, tokenAAmount);
      setTokenBAmount(calculatedBAmount);
      
      // Calculate LP tokens to be received
      const lpTokens = calculateLPTokensMinted(pool, tokenAAmount, calculatedBAmount);
      setLpTokensToReceive(lpTokens);
    } else {
      setTokenBAmount("");
      setLpTokensToReceive("0");
    }
  }, [tokenAAmount, pool]);

  useEffect(() => {
    if (tokenBAmount && tokenBAmount !== "0" && !tokenAAmount) {
      // If user enters token B amount first, calculate token A amount based on reverse ratio
      const reverseRatio = parseFloat(pool.balanceA) / parseFloat(pool.balanceB);
      const calculatedAAmount = (parseFloat(tokenBAmount) * reverseRatio).toString();
      setTokenAAmount(calculatedAAmount);
      
      // LP tokens calculation will be triggered by the previous useEffect
    }
  }, [tokenBAmount, tokenAAmount, pool]);

  const executeAddLiquidityOperation = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!tokenAAmount || !tokenBAmount || 
        parseFloat(tokenAAmount) <= 0 || 
        parseFloat(tokenBAmount) <= 0) {
      toast.error("Please enter valid amounts");
      return;
    }
    
    // Check if user has enough balance
    if (parseFloat(tokenAAmount) > parseFloat(userBalances.alphaBalance)) {
      toast.error(`Insufficient ${pool.tokenA.symbol} balance`);
      return;
    }
    
    if (parseFloat(tokenBAmount) > parseFloat(userBalances.betaBalance)) {
      toast.error(`Insufficient ${pool.tokenB.symbol} balance`);
      return;
    }
    
    try {
      const { newPool, lpTokensMinted } = executeAddLiquidity(pool, tokenAAmount, tokenBAmount);
      
      setPool(newPool);
      // In a real dApp, we'd update the user's LP token balance here
      toast.success(`Liquidity added successfully! Received ${lpTokensMinted} LP tokens`);
      resetInputs();
    } catch (error: any) {
      toast.error(`Failed to add liquidity: ${error.message}`);
    }
  };

  // Remove liquidity functions
  useEffect(() => {
    if (lpTokenAmount && lpTokenAmount !== "0") {
      const { tokenAAmount, tokenBAmount } = calculateRemoveLiquidity(pool, lpTokenAmount);
      setTokenAToReceive(tokenAAmount);
      setTokenBToReceive(tokenBAmount);
    } else {
      setTokenAToReceive("0");
      setTokenBToReceive("0");
    }
  }, [lpTokenAmount, pool]);

  const executeRemoveLiquidityOperation = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!lpTokenAmount || parseFloat(lpTokenAmount) <= 0) {
      toast.error("Please enter a valid LP token amount");
      return;
    }
    
    // Check if user has enough LP tokens
    if (parseFloat(lpTokenAmount) > parseFloat(userBalances.lpTokenBalance)) {
      toast.error("Insufficient LP token balance");
      return;
    }
    
    try {
      const { newPool, tokenAAmount, tokenBAmount } = executeRemoveLiquidity(pool, lpTokenAmount);
      
      setPool(newPool);
      // In a real dApp, we'd update the user's token balances here
      toast.success(`Liquidity removed successfully! Received ${tokenAAmount} ${pool.tokenA.symbol} and ${tokenBAmount} ${pool.tokenB.symbol}`);
      resetInputs();
    } catch (error: any) {
      toast.error(`Failed to remove liquidity: ${error.message}`);
    }
  };

  return (
    <PoolContext.Provider
      value={{
        pool,
        currentOperation,
        setCurrentOperation,
        // Swap
        fromToken,
        setFromToken,
        toToken,
        setToToken,
        fromAmount,
        setFromAmount,
        toAmount,
        swapTokens,
        executeSwapOperation,
        // Add liquidity
        tokenAAmount,
        setTokenAAmount,
        tokenBAmount,
        setTokenBAmount,
        lpTokensToReceive,
        executeAddLiquidityOperation,
        // Remove liquidity
        lpTokenAmount,
        setLpTokenAmount,
        tokenAToReceive,
        tokenBToReceive,
        executeRemoveLiquidityOperation,
        // Reset
        resetInputs,
      }}
    >
      {children}
    </PoolContext.Provider>
  );
};

export const usePool = () => {
  const context = useContext(PoolContext);
  if (context === undefined) {
    throw new Error('usePool must be used within a PoolProvider');
  }
  return context;
};
