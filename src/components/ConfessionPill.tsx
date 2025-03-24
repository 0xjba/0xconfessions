import React, { useState } from 'react';
import { Confession } from '../lib/web3';

interface ConfessionPillProps {
  confession: Confession;
  index: number;
}

const ConfessionPill: React.FC<ConfessionPillProps> = ({ confession, index }) => {
  const [expanded, setExpanded] = useState(false);
  const truncatedText = confession.text.length > 10 
    ? `${confession.text.substring(0, 10)}...` 
    : confession.text;
  
  const timestamp = new Date(confession.timestamp * 1000);
  const timeAgo = getTimeAgo(timestamp);

  return (
    <div 
      className={`relative transition-all duration-500 bg-cyber-black bg-opacity-80 backdrop-blur-lg rounded-lg cursor-pointer border border-gray-700 ${
        expanded ? 'fixed inset-0 w-full sm:w-3/4 lg:w-1/2 xl:w-2/5 h-fit mx-auto my-20 animate-expand z-50' : 'text-xs'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? (
        // Expanded view
        <div className="p-6 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse-soft mr-2"></div>
              <span className="text-xs text-white text-opacity-70">{timeAgo}</span>
            </div>
            <div 
              className="text-white cursor-pointer px-3 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
            >
              X
            </div>
          </div>
          <p className="text-white text-base sm:text-lg mb-4 text-left">{confession.text}</p>
          <div className="text-xs text-white text-opacity-50 text-right">
            CONFESSION #{confession.id}
          </div>
        </div>
      ) : (
        // Collapsed view (smaller pill)
        <div className="p-1.5">
          <span className="text-white text-xs">{truncatedText}</span>
        </div>
      )}

      {/* Click anywhere outside to close */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-cyber-black bg-opacity-50 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false);
          }}
          style={{ zIndex: -1 }}
        />
      )}
    </div>
  );
};

// Helper function to format timeago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  
  return Math.floor(seconds) + "s ago";
}

export default ConfessionPill;
