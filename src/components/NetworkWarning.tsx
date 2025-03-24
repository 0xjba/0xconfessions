
import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog';
import { Button } from './ui/button';

interface NetworkWarningProps {
  open: boolean;
  onClose: () => void;
}

const NetworkWarning: React.FC<NetworkWarningProps> = ({ open, onClose }) => {
  const [glitchClass, setGlitchClass] = useState('');
  
  // Apply glitch effect randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchClass(Math.random() > 0.7 ? 'glitch-effect' : '');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Force open dialog to be visible when open prop is true
  useEffect(() => {
    if (open) {
      console.log("NetworkWarning: Dialog should be visible now");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="border border-red-500 shadow-red-500/20 shadow-lg backdrop-blur-lg bg-black/80 max-w-md">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-3 shadow-lg shadow-red-500/50">
          <AlertTriangle className={`h-8 w-8 text-black ${glitchClass}`} />
        </div>
        <DialogHeader className="pt-8">
          <DialogTitle className={`text-center text-xl font-bold text-red-500 ${glitchClass}`}>
            NETWORK ERROR
          </DialogTitle>
        </DialogHeader>
        
        <div className={`text-center mt-2 mb-4 ${glitchClass}`}>
          <p className="text-white">You are not on TEN network.</p>
          <p className="text-white mt-2">Please visit TEN Gateway to add TEN network to your wallet.</p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-black multicolor-border-orange-pink"
            onClick={() => window.open('https://testnet.ten.xyz/', '_blank')}
          >
            TEN GATEWAY
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkWarning;
