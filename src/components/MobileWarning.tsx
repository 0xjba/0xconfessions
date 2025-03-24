
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MobileWarningProps {
  open: boolean;
}

const MobileWarning: React.FC<MobileWarningProps> = ({ open }) => {
  return (
    <Dialog open={open}>
      <DialogContent className="bg-black multicolor-border-blue-purple text-white max-w-[90%] rounded-md">
        <DialogHeader>
          <DialogTitle className="cyber-text text-xl flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-cyber-green" />
            MOBILE DETECTED
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            For the best experience, we recommend using a desktop browser.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="bg-black border border-white/10">
            <AlertDescription className="text-sm">
              This app works best on desktop or in the MetaMask mobile app browser. Some features might be limited on mobile devices.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-3">
            <Button 
              variant="outline" 
              className="border-cyber-green text-cyber-green hover:bg-cyber-green/20 w-full"
              onClick={() => {
                document.body.classList.add('mobile-acknowledged');
                window.localStorage.setItem('mobileAcknowledged', 'true');
                window.location.reload();
              }}
            >
              Continue Anyway
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileWarning;
