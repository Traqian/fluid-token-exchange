
import WalletConnectButton from "./wallet-connect-button";

const Header = () => {
  return (
    <header className="w-full py-4 px-4 md:px-8 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold gradient-text">Fluid Swap</h1>
      </div>
      
      <WalletConnectButton />
    </header>
  );
};

export default Header;
