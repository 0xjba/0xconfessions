
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
    <div className="w-full flex flex-col">
      {/* Title for the confessions section */}
      <div className="mb-4 text-center">
        <h2 className="cyber-text text-xl tracking-wider animate-pulse-soft">
          RECENT 0xCONFESSIONS
        </h2>
        <div className="h-px w-24 bg-cyber-green mx-auto mt-2"></div>
      </div>
      
      {/* Confessions container */}
      <div className="relative w-full h-[55vh] overflow-y-auto scrollbar-none">
        {loading && confessions.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="cyber-text animate-pulse-soft">Loading confessions...</div>
          </div>
        ) : confessions.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="cyber-text text-opacity-70">No confessions yet. Be the first to confess.</div>
          </div>
        ) : (
          // Container for pills in a grid layout - adjusted for smaller pills
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 p-4">
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
    </div>
  );
};

export default ConfessionsList;
