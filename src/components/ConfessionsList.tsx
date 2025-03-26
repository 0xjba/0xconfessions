
import React, { useEffect, useCallback, useRef } from 'react';
import ConfessionPill from './ConfessionPill';
import { useWeb3 } from '../lib/web3';

const ConfessionsList: React.FC = () => {
  const { confessions, topConfessions, totalConfessions, loading, refreshData, connected } = useWeb3();
  const refreshTimerRef = useRef<number | null>(null);

  // Memoized refresh function to prevent unnecessary re-renders
  const handleRefresh = useCallback(() => {
    if (connected) {
      refreshData();
    }
  }, [refreshData, connected]);

  // Optimized refresh mechanism
  useEffect(() => {
    // Initial data fetch only if connected
    if (connected) {
      handleRefresh();
    }
    
    // Clear any existing interval first to prevent memory leaks
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    // Only set interval if connected
    if (connected) {
      refreshTimerRef.current = window.setInterval(handleRefresh, 15000);
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [handleRefresh, connected]);

  // Render optimized grid for top confessions
  const renderTopConfessions = () => {
    if (loading && topConfessions.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="cyber-text animate-pulse-soft">Loading top confessions...</div>
        </div>
      );
    }
    
    if (topConfessions.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="cyber-text text-opacity-70">No top confessions yet.</div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {topConfessions.map((confession, index) => (
          <ConfessionPill 
            key={`top-${confession.id}-${confession.timestamp}`} 
            confession={confession} 
            index={index}
            showUpvotes={true}
          />
        ))}
      </div>
    );
  };

  // Render optimized grid for recent confessions
  const renderRecentConfessions = () => {
    if (loading && confessions.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="cyber-text animate-pulse-soft">Loading confessions...</div>
        </div>
      );
    }
    
    if (confessions.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="cyber-text text-opacity-70">No confessions yet. Be the first to confess.</div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {confessions.map((confession, index) => (
          <ConfessionPill 
            key={`recent-${confession.id}-${confession.timestamp}`} 
            confession={confession} 
            index={index}
            showUpvotes={true}
          />
        ))}
      </div>
    );
  };

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
          {renderTopConfessions()}
        </div>
      </div>
      
      {/* Recent confessions section */}
      <div className="mb-4 text-center">
        <h2 className="cyber-text text-xl tracking-wider animate-pulse-soft">
          RECENT CONFESSIONS
        </h2>
        <div className="h-px w-24 bg-white mx-auto mt-2 animate-glow"></div>
      </div>
      
      {/* Confessions container with uniform gap */}
      <div className="relative w-full h-[40vh] overflow-y-auto scrollbar-none">
        {renderRecentConfessions()}
      </div>
    </div>
  );
};

export default ConfessionsList;
