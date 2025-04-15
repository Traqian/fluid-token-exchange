
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { WalletState, WalletConnectionStatus } from '@/lib/types';
import { MOCK_WALLET } from '@/lib/constants';

interface WalletContextType {
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  userBalances: {
    alphaBalance: string;
    betaBalance: string;
    lpTokenBalance: string;
  };
  isConnected: boolean;
}

const initialWalletState: WalletState = {
  status: WalletConnectionStatus.Disconnected,
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>(initialWalletState);
  const [userBalances, setUserBalances] = useState({
    alphaBalance: "0",
    betaBalance: "0",
    lpTokenBalance: "0",
  });

  const isConnected = walletState.status === WalletConnectionStatus.Connected;

  // Check if MetaMask is installed
  const checkIfMetaMaskIsInstalled = () => {
    const { ethereum } = window as any;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    try {
      console.log("Attempting to connect wallet...");
      
      // Check if MetaMask is installed
      if (!checkIfMetaMaskIsInstalled()) {
        console.log("MetaMask not installed");
        setWalletState({
          status: WalletConnectionStatus.Error,
          error: "MetaMask is not installed",
        });
        toast.error("MetaMask is not installed. Please install MetaMask to connect.");
        return;
      }

      setWalletState({ status: WalletConnectionStatus.Connecting });
      console.log("Setting connecting state");
      
      const { ethereum } = window as any;
      
      try {
        console.log("Requesting accounts...");
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        
        if (accounts.length === 0) {
          throw new Error("No accounts found");
        }
        
        const address = accounts[0];
        const chainId = await ethereum.request({ method: "eth_chainId" });
        
        console.log("Wallet connected:", address);
        
        setWalletState({
          status: WalletConnectionStatus.Connected,
          address,
          chainId,
        });
        
        // In a real app, we would fetch actual token balances
        // For this demo, we'll use mock balances
        setUserBalances({
          alphaBalance: MOCK_WALLET.alphaBalance,
          betaBalance: MOCK_WALLET.betaBalance,
          lpTokenBalance: MOCK_WALLET.lpTokenBalance,
        });
        
        toast.success("Wallet connected successfully!");
      } catch (innerError: any) {
        console.error("Error requesting accounts:", innerError);
        setWalletState({
          status: WalletConnectionStatus.Error,
          error: innerError.message,
        });
        toast.error(`Failed to connect wallet: ${innerError.message}`);
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setWalletState({
        status: WalletConnectionStatus.Error,
        error: error.message,
      });
      toast.error(`Failed to connect wallet: ${error.message}`);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    console.log("Disconnecting wallet");
    setWalletState({ status: WalletConnectionStatus.Disconnected });
    setUserBalances({
      alphaBalance: "0",
      betaBalance: "0",
      lpTokenBalance: "0",
    });
    toast.info("Wallet disconnected");
  };

  // Listen for account changes
  useEffect(() => {
    const { ethereum } = window as any;
    
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnectWallet();
        } else if (walletState.status === WalletConnectionStatus.Connected) {
          // Account changed while connected
          setWalletState({
            ...walletState,
            address: accounts[0],
          });
          toast.info("Account changed");
        }
      };
      
      const handleChainChanged = () => {
        // The recommended way to handle chain changes is to reload the page
        window.location.reload();
      };
      
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletState]);

  return (
    <WalletContext.Provider
      value={{
        walletState,
        connectWallet,
        disconnectWallet,
        userBalances,
        isConnected,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
