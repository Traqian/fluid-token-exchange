
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePool } from "@/contexts/pool-context";

const PoolStats = () => {
  const { pool } = usePool();
  
  return (
    <Card className="swap-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Pool Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Pool Size</span>
            <div className="flex flex-col items-end">
              <span className="font-medium">{parseFloat(pool.balanceA).toLocaleString()} {pool.tokenA.symbol}</span>
              <span className="font-medium">{parseFloat(pool.balanceB).toLocaleString()} {pool.tokenB.symbol}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">LP Token Supply</span>
            <span className="font-medium">{parseFloat(pool.totalLPTokens).toLocaleString()}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price Ratio</span>
            <div className="flex flex-col items-end">
              <span className="font-medium">
                1 {pool.tokenA.symbol} = {(parseFloat(pool.balanceB) / parseFloat(pool.balanceA)).toFixed(4)} {pool.tokenB.symbol}
              </span>
              <span className="font-medium">
                1 {pool.tokenB.symbol} = {(parseFloat(pool.balanceA) / parseFloat(pool.balanceB)).toFixed(4)} {pool.tokenA.symbol}
              </span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Swap Fee</span>
            <span className="font-medium">{pool.fee}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolStats;
