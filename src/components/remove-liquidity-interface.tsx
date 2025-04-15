
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { usePool } from "@/contexts/pool-context";
import { useWallet } from "@/contexts/wallet-context";
import { Separator } from "@/components/ui/separator";

const RemoveLiquidityInterface = () => {
  const { 
    pool,
    lpTokenAmount, 
    setLpTokenAmount, 
    tokenAToReceive, 
    tokenBToReceive, 
    executeRemoveLiquidityOperation 
  } = usePool();
  
  const { isConnected, userBalances } = useWallet();
  
  const handleMaxClick = () => {
    if (isConnected) {
      setLpTokenAmount(userBalances.lpTokenBalance);
    }
  };
  
  return (
    <div className="space-y-4">
      <Card className="swap-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <label className="text-sm font-medium">LP Tokens</label>
              {isConnected && (
                <button 
                  onClick={handleMaxClick}
                  className="text-xs text-defi-purple hover:text-defi-purple-dark"
                >
                  Balance: {parseFloat(userBalances.lpTokenBalance).toLocaleString()}
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={lpTokenAmount}
                onChange={(e) => setLpTokenAmount(e.target.value)}
                className="flex-grow"
              />
              <Button variant="outline" className="w-24 font-medium" disabled>
                LP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {parseFloat(lpTokenAmount) > 0 && (
        <Card className="swap-card">
          <CardContent className="py-4">
            <div className="text-sm font-medium mb-3">You Will Receive</div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>{pool.tokenA.symbol}</span>
                <span className="font-medium">{parseFloat(tokenAToReceive).toFixed(6)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span>{pool.tokenB.symbol}</span>
                <span className="font-medium">{parseFloat(tokenBToReceive).toFixed(6)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Button 
        onClick={executeRemoveLiquidityOperation}
        disabled={
          !isConnected || 
          !lpTokenAmount || 
          parseFloat(lpTokenAmount) <= 0 ||
          parseFloat(lpTokenAmount) > parseFloat(userBalances.lpTokenBalance)
        }
        className="w-full bg-gradient-to-r from-defi-purple to-defi-blue hover:opacity-90 text-white"
      >
        {!isConnected ? "Connect Wallet to Remove Liquidity" : "Remove Liquidity"}
      </Button>
    </div>
  );
};

export default RemoveLiquidityInterface;
