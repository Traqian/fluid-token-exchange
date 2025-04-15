
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { usePool } from "@/contexts/pool-context";
import { useWallet } from "@/contexts/wallet-context";

const AddLiquidityInterface = () => {
  const { 
    pool,
    tokenAAmount, 
    setTokenAAmount, 
    tokenBAmount, 
    setTokenBAmount, 
    lpTokensToReceive, 
    executeAddLiquidityOperation 
  } = usePool();
  
  const { isConnected, userBalances } = useWallet();
  
  const handleMaxAClick = () => {
    if (isConnected) {
      setTokenAAmount(userBalances.alphaBalance);
    }
  };
  
  const handleMaxBClick = () => {
    if (isConnected) {
      setTokenBAmount(userBalances.betaBalance);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card className="swap-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{pool.tokenA.symbol}</label>
              {isConnected && (
                <button 
                  onClick={handleMaxAClick}
                  className="text-xs text-defi-purple hover:text-defi-purple-dark"
                >
                  Balance: {parseFloat(userBalances.alphaBalance).toLocaleString()}
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={tokenAAmount}
                onChange={(e) => setTokenAAmount(e.target.value)}
                className="flex-grow"
              />
              <Button variant="outline" className="w-24 font-medium" disabled>
                {pool.tokenA.symbol}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="swap-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">{pool.tokenB.symbol}</label>
              {isConnected && (
                <button 
                  onClick={handleMaxBClick}
                  className="text-xs text-defi-purple hover:text-defi-purple-dark"
                >
                  Balance: {parseFloat(userBalances.betaBalance).toLocaleString()}
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={tokenBAmount}
                onChange={(e) => setTokenBAmount(e.target.value)}
                className="flex-grow"
              />
              <Button variant="outline" className="w-24 font-medium" disabled>
                {pool.tokenB.symbol}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {parseFloat(tokenAAmount) > 0 && parseFloat(tokenBAmount) > 0 && (
        <div className="bg-muted/50 rounded-md p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">LP Tokens to Receive</span>
            <span>{parseFloat(lpTokensToReceive).toFixed(6)}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Share of Pool</span>
            <span>
              {(parseFloat(lpTokensToReceive) / (parseFloat(pool.totalLPTokens) + parseFloat(lpTokensToReceive)) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      )}
      
      <Button 
        onClick={executeAddLiquidityOperation}
        disabled={
          !isConnected || 
          !tokenAAmount || 
          !tokenBAmount || 
          parseFloat(tokenAAmount) <= 0 || 
          parseFloat(tokenBAmount) <= 0
        }
        className="w-full bg-gradient-to-r from-defi-purple to-defi-blue hover:opacity-90 text-white"
      >
        {!isConnected ? "Connect Wallet to Add Liquidity" : "Add Liquidity"}
      </Button>
    </div>
  );
};

export default AddLiquidityInterface;
