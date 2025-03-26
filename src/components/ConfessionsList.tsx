
import React, { useEffect } from 'react';
import ConfessionPill from './ConfessionPill';
import { useWeb3 } from '../lib/web3';

const ConfessionsList: React.FC = () => {
  const { confessions, topConfessions, totalConfessions, loading, refreshData, connected } = useWeb3();

  // Refresh confessions periodically and when connection state changes
  useEffect(() => {
    // Initial data fetch
    if (connected) {
      refreshData();
    }
    
    const interval = setInterval(() => {
      if (connected) {
        refreshData();
      }
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, [refreshData, connected]);

  return (
    <div className="w-full flex flex-col">
      {/* Top confessions section */}
      <div className="mb-8">
        <div className="mb-4 text-center">
          <h2 className="cyber-text text-xl tracking-wider animate-pulse-soft">
            TOP CONFESSIONS
          </h2>
          <div className="h-px w-24 bg-white mx-auto mt-2 animate-glow"></div>
        </div>
        
        <div className="relative w-full h-[20vh] overflow-y-auto scrollbar-none">
          {loading && topConfessions.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="cyber-text animate-pulse-soft">Loading top confessions...</div>
            </div>
          ) : topConfessions.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="cyber-text text-opacity-70">No top confessions yet.</div>
            </div>
          ) : (
            // Reduced gap from gap-4 to gap-2
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-4">
              {topConfessions.map((confession, index) => (
                <ConfessionPill 
                  key={`top-${confession.id}-${confession.timestamp}`} 
                  confession={confession} 
                  index={index}
                  showUpvotes={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Recent confessions section */}
      <div className="mb-4 text-center">
        <h2 className="cyber-text text-xl tracking-wider animate-pulse-soft">
          RECENT CONFESSIONS
        </h2>
        <div className="h-px w-24 bg-white mx-auto mt-2 animate-glow"></div>
      </div>
      
      {/* Confessions container with reduced gap */}
      <div className="relative w-full h-[40vh] overflow-y-auto scrollbar-none">
        {loading && confessions.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="cyber-text animate-pulse-soft">Loading confessions...</div>
          </div>
        ) : confessions.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="cyber-text text-opacity-70">No confessions yet. Be the first to confess.</div>
          </div>
        ) : (
          // Reduced gap from gap-4 to gap-2
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-4">
            {confessions.map((confession, index) => (
              <ConfessionPill 
                key={`recent-${confession.id}-${confession.timestamp}`} 
                confession={confession} 
                index={index}
                showUpvotes={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfessionsList;
