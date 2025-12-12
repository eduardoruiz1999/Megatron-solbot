import React, { useState } from 'react';
import { ArrowDownUp, RefreshCw } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { WalletState } from '../types';
import { performSwap } from '../services/solanaService';

interface SwapProps {
  wallet: WalletState;
}

export const SwapInterface: React.FC<SwapProps> = ({ wallet }) => {
  const [fromAmount, setFromAmount] = useState<string>('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapDirection, setSwapDirection] = useState<'SOL_TO_DIAMOND' | 'DIAMOND_TO_SOL'>('SOL_TO_DIAMOND');
  const [status, setStatus] = useState<string | null>(null);

  const RATE = 1000; // 1 SOL = 1000 DIAMOND approx

  const handleSwap = async () => {
    if (!wallet.connected) {
      setStatus("Error: Wallet not connected");
      return;
    }
    
    setIsSwapping(true);
    setStatus(null);

    const fromToken = swapDirection === 'SOL_TO_DIAMOND' ? 'SOL' : 'DIAMOND';
    const toToken = swapDirection === 'SOL_TO_DIAMOND' ? 'DIAMOND' : 'SOL';

    try {
      const result = await performSwap(fromToken, toToken, parseFloat(fromAmount));
      setStatus(result.message);
      setFromAmount('');
    } catch (error) {
      setStatus("Transaction Failed.");
    } finally {
      setIsSwapping(false);
    }
  };

  const estimatedOutput = fromAmount 
    ? (swapDirection === 'SOL_TO_DIAMOND' 
        ? parseFloat(fromAmount) * RATE 
        : parseFloat(fromAmount) / RATE).toFixed(4)
    : '0.00';

  return (
    <div className="max-w-xl mx-auto">
      <Card title="DECENTRALIZED SWAP">
        <div className="space-y-4">
          
          {/* FROM */}
          <div className="bg-cyber-black p-4 border border-cyber-gray rounded-lg">
            <div className="flex justify-between mb-2 text-sm text-gray-400">
              <span>PAYING</span>
              <span>BAL: {swapDirection === 'SOL_TO_DIAMOND' ? wallet.balance : (wallet.tokens['DIAMOND'] || 0)}</span>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="bg-transparent text-2xl font-bold w-full focus:outline-none text-white font-mono"
              />
              <div className="flex items-center gap-2 bg-cyber-gray px-3 py-1 rounded border border-cyber-cyan/30 text-cyber-cyan font-bold">
                 {swapDirection === 'SOL_TO_DIAMOND' ? 'SOL' : 'DIAMOND'}
              </div>
            </div>
          </div>

          {/* SWAP ICON */}
          <div className="flex justify-center -my-2 relative z-10">
            <button 
              onClick={() => setSwapDirection(prev => prev === 'SOL_TO_DIAMOND' ? 'DIAMOND_TO_SOL' : 'SOL_TO_DIAMOND')}
              className="bg-cyber-purple p-2 rounded-full hover:shadow-[0_0_15px_rgba(188,19,254,0.6)] transition-all"
            >
              <ArrowDownUp className="text-white h-5 w-5" />
            </button>
          </div>

          {/* TO */}
          <div className="bg-cyber-black p-4 border border-cyber-gray rounded-lg">
            <div className="flex justify-between mb-2 text-sm text-gray-400">
              <span>RECEIVING (EST)</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-2xl font-bold w-full text-gray-300 font-mono">
                 {estimatedOutput}
               </div>
               <div className="flex items-center gap-2 bg-cyber-gray px-3 py-1 rounded border border-cyber-purple/30 text-cyber-purple font-bold">
                 {swapDirection === 'SOL_TO_DIAMOND' ? 'DIAMOND' : 'SOL'}
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="flex justify-between text-xs text-gray-500 font-mono">
            <span>Rate</span>
            <span>1 SOL ≈ 1000 DIAMOND</span>
          </div>

          {/* Action */}
          <Button 
            className="w-full mt-4" 
            onClick={handleSwap} 
            isLoading={isSwapping}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          >
            {wallet.connected ? 'INITIATE SWAP' : 'CONNECT WALLET TO SWAP'}
          </Button>

          {status && (
            <div className={`text-center p-3 rounded bg-opacity-20 text-sm ${status.includes('Error') ? 'bg-red-500 text-red-300' : 'bg-green-500 text-green-300'}`}>
              {status}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};