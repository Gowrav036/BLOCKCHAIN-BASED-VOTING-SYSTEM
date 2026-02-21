import { createContext, useContext, useState } from 'react';
import { connectWallet } from '../services/blockchain';

const WalletContext = createContext(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem('voting_wallet') || null
  );
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    try {
      const { success, address } = await connectWallet();
      if (success && address) {
        setWalletAddress(address);
        localStorage.setItem('voting_wallet', address);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletAddress(null);
    localStorage.removeItem('voting_wallet');
  };

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        shortAddress,
        isConnected: !!walletAddress,
        connect,
        disconnect,
        connecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
