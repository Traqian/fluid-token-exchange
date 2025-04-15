
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePool } from "@/contexts/pool-context";
import { TrendingUp, DollarSign, LayersIcon, Percent } from "lucide-react";

const PoolStats = () => {
  const { pool } = usePool();
  
  return (
    <Card className="bg-card/30 backdrop-blur-xl border shadow-lg hover-scale">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <LayersIcon className="w-5 h-5 text-defi-purple" />
          <span className="bg-gradient-to-r from-defi-purple to-defi-blue bg-clip-text text-transparent">
            Pool Statistics
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Pool Size
              </span>
              <div className="flex flex-col items-end">
                <span className="font-medium">
                  {parseFloat(pool.balanceA).toLocaleString()} {pool.tokenA.symbol}
                </span>
                <span className="font-medium">
                  {parseFloat(pool.balanceB).toLocaleString()} {pool.tokenB.symbol}
                </span>
              </div>
            </div>
            
            <Separator className="bg-muted/50" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <LayersIcon className="w-4 h-4" />
                LP Token Supply
              </span>
              <span className="font-medium">{parseFloat(pool.totalLPTokens).toLocaleString()}</span>
            </div>
            
            <Separator className="bg-muted/50" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Price Ratio
              </span>
              <div className="flex flex-col items-end text-sm">
                <span className="font-medium">
                  1 {pool.tokenA.symbol} = {(parseFloat(pool.balanceB) / parseFloat(pool.balanceA)).toFixed(4)} {pool.tokenB.symbol}
                </span>
                <span className="font-medium">
                  1 {pool.tokenB.symbol} = {(parseFloat(pool.balanceA) / parseFloat(pool.balanceB)).toFixed(4)} {pool.tokenA.symbol}
                </span>
              </div>
            </div>
            
            <Separator className="bg-muted/50" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Swap Fee
              </span>
              <span className="font-medium text-defi-purple">{pool.fee}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolStats;
