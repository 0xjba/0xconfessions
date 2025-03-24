import React, { useState } from 'react';
import { Confession } from '../lib/web3';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from 'lucide-react';

interface ConfessionPillProps {
  confession: Confession;
  index: number;
}

const ConfessionPill: React.FC<ConfessionPillProps> = ({ confession, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const truncatedText = confession.text.length > 10 
    ? `${confession.text.substring(0, 10)}...` 
    : confession.text;
  
  const timestamp = new Date(confession.timestamp * 1000);
  const timeAgo = getTimeAgo(timestamp);

  return (
    <>
      {/* Pill that stays as a pill */}
      <div 
        className="relative transition-all duration-300 bg-cyber-black bg-opacity-80 backdrop-blur-lg border border-gray-700 rounded-lg p-1.5 flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-white text-xs text-center">{truncatedText}</span>
      </div>

      {/* Dialog for expanded view */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="bg-cyber-black bg-opacity-90 backdrop-blur-lg border border-gray-700 max-w-md max-h-[400px] p-0 rounded-md"
          closeButtonClassName="bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full p-1 hover:bg-opacity-20 hover:opacity-100 transition-all duration-300"
        >
          <div className="p-4 flex flex-col">
            <div className="mb-3 flex items-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse-soft mr-2"></div>
              <span className="text-xs text-white text-opacity-70">{timeAgo}</span>
            </div>
            <div className="overflow-y-auto max-h-[280px] scrollbar-none">
              <p className="text-white text-sm mb-4 text-left">{confession.text}</p>
            </div>
            <div className="text-xs text-white text-opacity-50 text-right mt-auto">
              CONFESSION #{confession.id}
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
