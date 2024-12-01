'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { SoonUtils } from '@/lib/solana/soon-utils';
import { SOON_CONFIG } from '@/lib/solana/soon-config';
import { ExternalLink } from 'lucide-react';

export function SoonTransactionViewer() {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const bal = await SoonUtils.getBalance(publicKey);
          setBalance(bal);
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [publicKey]);

  const openFaucet = () => {
    window.open(SOON_CONFIG.FAUCET_URL, '_blank');
  };

  const openBridge = () => {
    window.open(SOON_CONFIG.BRIDGE_URL, '_blank');
  };

  if (!publicKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SOON Network</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connect your wallet to view balance and transactions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SOON Network Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Balance:</span>
            <span className="text-xl font-bold">{balance?.toFixed(4)} SOL</span>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={openFaucet} className="flex-1">
              Get Test Tokens
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={openBridge} variant="outline" className="flex-1">
              Bridge Tokens
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>View account on explorer:</p>
            <a 
              href={`${SOON_CONFIG.EXPLORER_URL}/account/${publicKey.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
