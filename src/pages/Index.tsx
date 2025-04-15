
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
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background/80">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          <Header />
          
          <main className="flex-grow container py-8 relative">
            <div className="text-center space-y-4 mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-defi-purple to-defi-blue bg-clip-text text-transparent">
                DeFi Swap Platform
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fast and secure token swaps with optimal rates. Trade Alpha and Beta tokens with minimal slippage.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <div className="bg-card/30 backdrop-blur-xl border shadow-lg rounded-lg p-6">
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
