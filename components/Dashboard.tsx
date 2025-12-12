import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { Send } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { TransferInterface } from './TransferInterface';
import { WalletState } from '../types';
import { MOCK_CHART_DATA, DIAMOND_TOKEN_ADDRESS } from '../constants';

interface DashboardProps {
  wallet: WalletState;
}

export const Dashboard: React.FC<DashboardProps> = ({ wallet }) => {
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Transfer Modal */}
      <Modal 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        title="INITIATE TRANSFER"
      >
        <TransferInterface 
          wallet={wallet} 
          onClose={() => setIsTransferOpen(false)}
          onSuccess={() => {/* Ideally refresh balance here */}}
        />
      </Modal>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="TOTAL BALANCE (SOL)">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-4xl font-display font-bold text-white">
                {wallet.balance.toFixed(3)} <span className="text-sm text-cyber-cyan font-sans">SOL</span>
              </div>
              <div className="mt-2 text-gray-400 text-sm">
                ≈ ${(wallet.balance * 145).toFixed(2)} USD
              </div>
            </div>
            {wallet.connected && (
              <button 
                onClick={() => setIsTransferOpen(true)}
                className="bg-cyber-gray hover:bg-cyber-cyan hover:text-black text-cyber-cyan p-2 rounded transition-all border border-cyber-cyan/30"
                title="Send Tokens"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </Card>

        <Card title="DIAMOND HOLDINGS">
          <div className="text-4xl font-display font-bold text-cyber-cyan">
            {(wallet.tokens[DIAMOND_TOKEN_ADDRESS] || 0).toLocaleString()}
          </div>
          <div className="mt-2 text-sm text-gray-400 break-all font-mono text-xs">
            {DIAMOND_TOKEN_ADDRESS.slice(0, 8)}...{DIAMOND_TOKEN_ADDRESS.slice(-8)}
          </div>
        </Card>

        <Card title="VPOC ANALYTICS">
          <div className="text-4xl font-display font-bold text-cyber-purple">
             124.5 SOL
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Volume Point of Control
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="PRICE ACTION (DIAMOND/SOL)">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" />
                <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#00f3ff' }}
                  itemStyle={{ color: '#00f3ff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00f3ff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="VOLUME PROFILE (TPOC)">
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" />
                <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0f', borderColor: '#bc13fe' }}
                  cursor={{fill: '#1a1a24'}}
                />
                <Bar dataKey="volume" fill="#bc13fe" opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};