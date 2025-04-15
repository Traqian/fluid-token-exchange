import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownUp } from "lucide-react";
import { usePool } from "@/contexts/pool-context";
import { useWallet } from "@/contexts/wallet-context";
import { ALPHA_TOKEN, BETA_TOKEN } from "@/lib/constants";
import { SettingsDialog } from "./settings-dialog";
import { useState } from "react";

const SwapInterface = () => {
  const { 
    fromToken, 
    toToken, 
    fromAmount, 
    setFromAmount, 
    toAmount, 
    swapTokens, 
    executeSwapOperation,
    pool 
  } = usePool();
  
  const { isConnected, userBalances } = useWallet();
  const [slippage, setSlippage] = useState(0.5);
  
  const getMaxBalance = () => {
    if (!isConnected) return "0";
    return fromToken === ALPHA_TOKEN.symbol ? userBalances.alphaBalance : userBalances.betaBalance;
  };
  
  const handleMaxClick = () => {
    setFromAmount(getMaxBalance());
  };
  
  const calculatePriceImpact = () => {
    if (!fromAmount || !toAmount) return 0;
    const currentPrice = parseFloat(pool.balanceB) / parseFloat(pool.balanceA);
    const executionPrice = parseFloat(toAmount) / parseFloat(fromAmount);
    const impact = Math.abs((currentPrice - executionPrice) / currentPrice * 100);
    return impact;
  };

  const priceImpact = calculatePriceImpact();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Swap</h2>
        <SettingsDialog slippage={slippage} onSlippageChange={setSlippage} />
      </div>

      <Card className="swap-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">From</label>
              {isConnected && (
                <button 
                  onClick={handleMaxClick}
                  className="text-xs text-defi-purple hover:text-defi-purple-dark"
                >
                  Balance: {parseFloat(getMaxBalance()).toLocaleString()}
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-grow"
              />
              <Button variant="outline" className="w-24 font-medium" disabled>
                {fromToken}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center -my-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={swapTokens}
          className="bg-secondary rounded-full h-10 w-10 shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5"
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>
      
      <Card className="swap-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">To</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="flex-grow bg-muted"
              />
              <Button variant="outline" className="w-24 font-medium" disabled>
                {toToken}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {parseFloat(fromAmount) > 0 && parseFloat(toAmount) > 0 && (
        <div className="bg-muted/50 rounded-md p-3 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rate</span>
            <span>
              1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price Impact</span>
            <span className={priceImpact > 5 ? "text-red-500" : priceImpact > 2 ? "text-yellow-500" : ""}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Minimum Received</span>
            <span>
              {(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)} {toToken}
            </span>
          </div>
        </div>
      )}
      
      <Button 
        onClick={executeSwapOperation}
        disabled={
          !isConnected || 
          !fromAmount || 
          parseFloat(fromAmount) <= 0 ||
          priceImpact > 15
        }
        className={`w-full ${
          priceImpact > 5 
            ? "bg-red-500 hover:bg-red-600" 
            : "bg-gradient-to-r from-defi-purple to-defi-blue hover:opacity-90"
        } text-white`}
      >
        {!isConnected 
          ? "Connect Wallet to Swap"
          : priceImpact > 5 
            ? "Swap Anyway" 
            : "Swap"
        }
      </Button>
    </div>
  );
};

export default SwapInterface;
