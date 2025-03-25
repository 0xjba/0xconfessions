
import React, { useState, useEffect } from 'react';
import { Confession, useWeb3 } from '../lib/web3';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowUp, X } from 'lucide-react';

interface ConfessionPillProps {
  confession: Confession;
  index: number;
  showUpvotes?: boolean;
  customUpvoteIcon?: React.ReactNode;
  upvotePosition?: 'bottom-left' | 'top-right';
}

const ConfessionPill: React.FC<ConfessionPillProps> = ({ 
  confession, 
  index, 
  showUpvotes = false,
  customUpvoteIcon,
  upvotePosition = 'top-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const { upvoteConfession, checkIfUserHasUpvoted, connected } = useWeb3();
  
  const truncatedText = confession.text.length > 6 
    ? `${confession.text.substring(0, 6)}...` 
    : confession.text;
  
  const timestamp = new Date(confession.timestamp * 1000);
  const timeAgo = getTimeAgo(timestamp);

  useEffect(() => {
    if (isOpen && connected) {
      checkIfUserHasUpvoted(confession.id).then(setHasUpvoted);
    }
  }, [isOpen, connected, confession.id, checkIfUserHasUpvoted]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasUpvoted) return;
    await upvoteConfession(confession.id);
    setHasUpvoted(true);
  };

  return (
    <>
      {/* Pill that stays as a pill */}
      <div 
        className={`relative transition-all duration-300 bg-cyber-black bg-opacity-80 backdrop-blur-lg border ${isHovering ? 'border-white' : 'border-gray-700'} rounded-lg p-1.5 flex items-center justify-center cursor-pointer`}
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <span className={`text-white text-xs text-center ${isHovering ? 'text-opacity-100' : 'text-opacity-80'}`}>{truncatedText}</span>
        {showUpvotes && confession.upvotes > 0 && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-1 text-[10px] border border-transparent animate-pulse-soft">
            {confession.upvotes}
          </div>
        )}
      </div>

      {/* Dialog for expanded view */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="bg-cyber-black bg-opacity-90 backdrop-blur-lg border border-gray-700 max-w-md max-h-[400px] p-0 rounded-md"
        >
          <DialogTitle className="sr-only">Confession #{confession.id}</DialogTitle>
          <div className="p-4 flex flex-col h-full">
            <div className="mb-3 flex items-center justify-between relative">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse-soft mr-2"></div>
                <span className="text-xs text-white text-opacity-70">{timeAgo}</span>
              </div>
              <X 
                className="text-white hover:text-gray-300 cursor-pointer" 
                size={18} 
                onClick={() => setIsOpen(false)} 
              />
            </div>
            <div className="overflow-y-auto max-h-[280px] scrollbar-none">
              <p className="text-white text-sm mb-4 text-left">{confession.text}</p>
            </div>
            <div className="flex justify-between items-center mt-auto">
              <div className="flex items-center">
                <span className="text-xs text-white text-opacity-70 mr-2">
                  {confession.upvotes} upvotes
                </span>
                <button 
                  onClick={handleUpvote}
                  disabled={hasUpvoted || !connected}
                  className={`p-1.5 rounded-full transition-all duration-200 ${
                    hasUpvoted ? 'text-gray-500 cursor-not-allowed' : connected ? 'text-white hover:text-cyber-blue cursor-pointer' : 'text-gray-500 cursor-not-allowed'
                  }`}
                  title={!connected ? "Connect wallet to upvote" : hasUpvoted ? "Already upvoted" : "Upvote this confession"}
                >
                  <ArrowUp size={16} className="border border-current rounded-full p-0.5" />
                </button>
              </div>
              <div className="text-xs text-white text-opacity-50">
                CONFESSION #{confession.id}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
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
