
import { WalletProvider } from "@/contexts/wallet-context";
import { PoolProvider } from "@/contexts/pool-context";
import Header from "@/components/header";
import OperationTabs from "@/components/operation-tabs";
import PoolStats from "@/components/pool-stats";
import UserBalances from "@/components/user-balances";
import Footer from "@/components/footer";

const Index = () => {
  return (
    <WalletProvider>
      <PoolProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          
          <main className="flex-grow container py-6">
            <h1 className="text-3xl font-bold text-center mb-2">DeFi Swap Platform</h1>
            <p className="text-center text-muted-foreground mb-8">
              Swap, add liquidity, and earn fees on Alpha and Beta tokens
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-card rounded-lg p-6 swap-card">
                  <OperationTabs />
                </div>
              </div>
              
              <div className="space-y-6">
                <PoolStats />
                <UserBalances />
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </PoolProvider>
    </WalletProvider>
  );
};

export default Index;
