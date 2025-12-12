import React, { useState } from 'react';
import { ShieldAlert, Key } from 'lucide-react';
import { Button } from './ui/Button';
import { importWallet } from '../services/solanaService';
import { WalletState } from '../types';

interface WalletConnectProps {
  onConnected: (wallet: WalletState) => void;
  onClose: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnected, onClose }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const wallet = await importWallet(privateKey);
      onConnected(wallet);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to import wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-cyber-red/10 border border-cyber-red/30 p-4 rounded text-sm text-cyber-red flex gap-3 items-start">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <p>
          WARNING: You are entering a private key directly. 
          Use only for testing or with ephemeral wallets. 
          Keys are processed locally in memory.
        </p>
      </div>

      <form onSubmit={handleImport} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-2">PRIVATE KEY (BASE58)</label>
          <div className="relative">
            <input
              type="password"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="w-full bg-cyber-black border border-cyber-gray p-3 pl-10 text-white focus:border-cyber-cyan focus:outline-none font-mono text-sm rounded"
              placeholder="Enter your private key..."
              required
            />
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-xs text-center font-mono break-words p-2 bg-red-900/10 rounded">
            [{error}]
          </div>
        )}

        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full"
          disabled={!privateKey}
        >
          ACCESS MAINFRAME
        </Button>
      </form>
    </div>
  );
};