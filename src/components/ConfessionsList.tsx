
import React, { useEffect } from 'react';
import ConfessionPill from './ConfessionPill';
import { useWeb3 } from '../lib/web3';

const ConfessionsList: React.FC = () => {
  const { confessions, loading, refreshConfessions } = useWeb3();

  // Refresh confessions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshConfessions();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [refreshConfessions]);

  return (
    <div className="relative w-full h-[60vh] overflow-hidden">
      {loading && confessions.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="cyber-text animate-pulse-soft">Loading confessions...</div>
        </div>
      ) : confessions.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="cyber-text text-opacity-70">No confessions yet. Be the first to confess.</div>
        </div>
      ) : (
        // Container for floating pills
        <div className="relative w-full h-full">
          {confessions.map((confession, index) => (
            <ConfessionPill 
              key={`${confession.id}-${confession.timestamp}`} 
              confession={confession} 
              index={index} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfessionsList;
