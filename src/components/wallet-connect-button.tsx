
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/contexts/wallet-context";
import { WalletConnectionStatus } from "@/lib/types";

const WalletConnectButton = () => {
  const { walletState, connectWallet, disconnectWallet } = useWallet();
  
  const isConnected = walletState.status === WalletConnectionStatus.Connected;
  const isConnecting = walletState.status === WalletConnectionStatus.Connecting;
  
  const shortenAddress = (address?: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  const handleConnectClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isConnected && !isConnecting) {
      await connectWallet();
    }
  };
  
  const handleDisconnectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isConnected) {
      disconnectWallet();
    }
  };
  
  return (
    <div>
      {!isConnected ? (
        <Button
          onClick={handleConnectClick}
          disabled={isConnecting}
          className="bg-gradient-to-r from-defi-purple to-defi-blue hover:opacity-90 text-white"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="bg-secondary rounded-full px-3 py-1 text-sm font-medium">
            {shortenAddress(walletState.address)}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleDisconnectClick}
            aria-label="Disconnect wallet"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletConnectButton;
