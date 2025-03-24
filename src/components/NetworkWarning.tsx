
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface NetworkWarningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NetworkWarning: React.FC<NetworkWarningProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 bg-cyber-black border-white/10 text-white">
        <DialogHeader className="flex flex-col items-center justify-center">
          <DialogTitle className="multicolor-text-red-orange text-xl sm:text-2xl font-bold tracking-wider mb-2 animate-glitch">
            WRONG NETWORK DETECTED
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center my-4 space-y-3">
          <p className="text-white/80 animate-pulse-slow">
            YOU ARE NOT ON THE TEN NETWORK
          </p>
          <p className="text-sm text-white/70">
            PLEASE VISIT TEN GATEWAY TO ADD TEN NETWORK TO YOUR WALLET
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:justify-center">
          <a 
            href="https://testnet.ten.xyz/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="multicolor-border-orange-red py-2 px-4 rounded-md bg-cyber-black hover:bg-cyber-darkgray transition-all duration-300 text-white text-center"
          >
            TEN GATEWAY
          </a>
          
          <DialogClose asChild>
            <button className="py-2 px-4 rounded-md border border-white/20 hover:bg-white/10 transition-all duration-300 text-white/80">
              CLOSE
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkWarning;
