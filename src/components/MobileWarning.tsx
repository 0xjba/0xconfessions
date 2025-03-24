
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
      <DialogContent 
        className="bg-black border border-white text-white max-w-[90%] rounded-md"
        hideCloseButton={true}
      >
        <DialogHeader className="items-center"> {/* Added items-center to center the header contents */}
          <DialogTitle className="cyber-text text-xl flex items-center justify-center gap-2"> {/* Added justify-center */}
            <div className="relative h-5 w-5 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 absolute" style={{
                background: 'linear-gradient(135deg, #FF6B00, #FF003C)',
                borderRadius: '50%',
                color: 'transparent'
              }} />
              <AlertCircle className="h-5 w-5 text-white absolute" strokeWidth={3} />
            </div>
            MOBILE DETECTED
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-center"> {/* Added text-center */}
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
            <button 
              className="relative py-3 px-4 rounded-full multicolor-border-blue-purple backdrop-blur-md bg-black/70 text-white hover:bg-black/50 transition-all duration-300 w-full flex items-center justify-center"
              onClick={() => {
                document.body.classList.add('mobile-acknowledged');
                window.localStorage.setItem('mobileAcknowledged', 'true');
                window.location.reload();
              }}
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileWarning;
