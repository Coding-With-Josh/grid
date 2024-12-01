import { useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { cn } from "@/lib/utils";

interface NFTGalleryProps {
  walletAddress: string;
  gridColumns?: number;
  showName?: boolean;
  className?: string;
}

interface NFT {
  name: string;
  image: string;
  description: string;
}

export function NFTGallery({ 
  walletAddress, 
  gridColumns = 3, 
  showName = true,
  className 
}: NFTGalleryProps) {
  const { connection } = useConnection();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNFTs() {
      if (!walletAddress) return;

      try {
        setLoading(true);
        const pubkey = new PublicKey(walletAddress);
        
        // This is a simplified version
        // In a real implementation, you would:
        // 1. Use Metaplex to fetch NFTs
        // 2. Filter for actual NFTs
        // 3. Fetch metadata for each NFT
        // 4. Handle pagination
        
        setNfts([]); // Replace with actual NFT data
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setNfts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, [connection, walletAddress]);

  if (!walletAddress) {
    return (
      <div className="text-sm text-muted-foreground">
        Please provide a wallet address
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading NFTs...
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No NFTs found
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-4",
      {
        "grid-cols-1": gridColumns === 1,
        "grid-cols-2": gridColumns === 2,
        "grid-cols-3": gridColumns === 3,
        "grid-cols-4": gridColumns === 4,
        "grid-cols-5": gridColumns === 5,
        "grid-cols-6": gridColumns === 6,
      },
      className
    )}>
      {nfts.map((nft, index) => (
        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          <img
            src={nft.image}
            alt={nft.name}
            className="object-cover w-full h-full"
          />
          {showName && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-sm truncate">
              {nft.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
