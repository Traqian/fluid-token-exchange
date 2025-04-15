
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/contexts/wallet-context";
import { usePool } from "@/contexts/pool-context";

const UserBalances = () => {
  const { isConnected, userBalances } = useWallet();
  const { pool } = usePool();
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <Card className="swap-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Your Balances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{pool.tokenA.symbol}</span>
            <span className="font-medium">{parseFloat(userBalances.alphaBalance).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{pool.tokenB.symbol}</span>
            <span className="font-medium">{parseFloat(userBalances.betaBalance).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">LP Tokens</span>
            <span className="font-medium">{parseFloat(userBalances.lpTokenBalance).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserBalances;
