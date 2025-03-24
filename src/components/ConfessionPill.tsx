
import React, { useState } from 'react';
import { Confession } from '../lib/web3';

interface ConfessionPillProps {
  confession: Confession;
  index: number;
}

const ConfessionPill: React.FC<ConfessionPillProps> = ({ confession, index }) => {
  const [expanded, setExpanded] = useState(false);
  const truncatedText = confession.text.length > 25 
    ? `${confession.text.substring(0, 25)}...` 
    : confession.text;
  
  const timestamp = new Date(confession.timestamp * 1000);
  const timeAgo = getTimeAgo(timestamp);
  
  // Apply different animations and positions for a floating effect
  const getRandomStyles = () => {
    const directions = ['float', 'pulse-soft', 'text-flicker'];
    const animation = directions[index % directions.length];
    
    const delay = (index * 0.3) % 2;
    const duration = 3 + (index % 5);
    
    // For x/y position within viewport
    const xPosition = 20 + (index % 3) * 15;
    const yPosition = 10 + (index % 4) * 5;
    
    return {
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      left: `${xPosition}%`,
      top: expanded ? undefined : `${yPosition}%`,
      transform: expanded ? undefined : `translateX(-${xPosition}%)`,
      animation: expanded ? undefined : `${animation} ${duration}s ease-in-out infinite`,
      zIndex: expanded ? 20 : 10
    };
  };

  return (
    <div 
      className={`cyber-pill cursor-pointer transition-all duration-500 ${
        expanded 
          ? 'fixed inset-0 w-full sm:w-3/4 lg:w-1/2 xl:w-2/5 h-fit mx-auto my-20 animate-expand' 
          : 'absolute p-2 transform'
      }`}
      style={getRandomStyles()}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? (
        // Expanded view
        <div className="p-4 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-soft mr-2"></div>
              <span className="cyber-text text-xs text-cyber-green text-opacity-70">{timeAgo}</span>
            </div>
            <div 
              className="cyber-text cursor-pointer px-3 text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
            >
              X
            </div>
          </div>
          <p className="cyber-text text-base sm:text-lg mb-4 text-left">{confession.text}</p>
          <div className="text-xs text-cyber-green text-opacity-50 text-right">
            CONFESSION #{confession.id}
          </div>
        </div>
      ) : (
        // Collapsed view (pill)
        <div className="flex items-center justify-center">
          <span className="cyber-text text-sm whitespace-nowrap">{truncatedText}</span>
        </div>
      )}

      {/* Click anywhere outside to close */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-cyber-black bg-opacity-50 backdrop-blur-sm z-10"
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
