import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SwapInterface } from './components/SwapInterface';
import { ChatInterface } from './components/ChatInterface';
import { Airdrop } from './components/Airdrop';
import { Modal } from './components/ui/Modal';
import { WalletConnect } from './components/WalletConnect';
import { Tab, WalletState } from './types';
import { INITIAL_WALLET_STATE } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET_STATE);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const handleWalletConnected = (newWallet: WalletState) => {
    setWallet(newWallet);
    setIsConnectModalOpen(false);
  };

  const handleDisconnect = () => {
    setWallet(INITIAL_WALLET_STATE);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard wallet={wallet} />;
      case Tab.SWAP:
        return <SwapInterface wallet={wallet} />;
      case Tab.CHAT:
        return <ChatInterface />;
      case Tab.AIRDROP:
        return <Airdrop wallet={wallet} />;
      default:
        return <Dashboard wallet={wallet} />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-gray-200 font-sans selection:bg-cyber-cyan selection:text-black">
      {/* Background Grid Effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1a1a24 1px, transparent 1px),
            linear-gradient(to bottom, #1a1a24 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyber-purple/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Wallet Connection Modal */}
      <Modal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        title="SECURE LINK UPLINK"
      >
        <WalletConnect 
          onConnected={handleWalletConnected} 
          onClose={() => setIsConnectModalOpen(false)}
        />
      </Modal>

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        wallet={wallet}
        onConnect={() => wallet.connected ? handleDisconnect() : setIsConnectModalOpen(true)}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyber-gray mt-auto py-6 bg-cyber-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-600 font-display tracking-widest">
          MEGATRON SOLBOT SYSTEM v1.0.0 // CONNECTED TO SOLANA MAINNET
        </div>
      </footer>
    </div>
  );
};

export default App;