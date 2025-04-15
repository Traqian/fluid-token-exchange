
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SwapOperation } from "@/lib/types";
import SwapInterface from "./swap-interface";
import AddLiquidityInterface from "./add-liquidity-interface";
import RemoveLiquidityInterface from "./remove-liquidity-interface";
import { usePool } from "@/contexts/pool-context";

const OperationTabs = () => {
  const { currentOperation, setCurrentOperation, resetInputs } = usePool();
  
  const handleTabChange = (value: string) => {
    setCurrentOperation(value as SwapOperation);
    resetInputs();
  };
  
  return (
    <Tabs 
      defaultValue={currentOperation} 
      value={currentOperation}
      onValueChange={handleTabChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value={SwapOperation.Swap}>Swap</TabsTrigger>
        <TabsTrigger value={SwapOperation.AddLiquidity}>Add Liquidity</TabsTrigger>
        <TabsTrigger value={SwapOperation.RemoveLiquidity}>Remove Liquidity</TabsTrigger>
      </TabsList>
      
      <TabsContent value={SwapOperation.Swap}>
        <SwapInterface />
      </TabsContent>
      
      <TabsContent value={SwapOperation.AddLiquidity}>
        <AddLiquidityInterface />
      </TabsContent>
      
      <TabsContent value={SwapOperation.RemoveLiquidity}>
        <RemoveLiquidityInterface />
      </TabsContent>
    </Tabs>
  );
};

export default OperationTabs;
