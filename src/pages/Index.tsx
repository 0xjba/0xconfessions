
import React, { useEffect, useState } from 'react';
import ConnectWallet from '../components/ConnectWallet';
import ConfessionInput from '../components/ConfessionInput';
import ConfessionsList from '../components/ConfessionsList';
import AnimatedBackground from '../components/AnimatedBackground';
import NoiseOverlay from '../components/NoiseOverlay';
import MobileWarning from '../components/MobileWarning';
import GlitchOverlay from '../components/GlitchOverlay';
import ConfessionSearch from '../components/ConfessionSearch';
import { useIsMobile } from '../hooks/use-mobile';
import { useWeb3 } from '../lib/web3';
import { Twitter } from 'lucide-react';

const Index: React.FC = () => {
  const { connected } = useWeb3();
  const isMobile = useIsMobile();
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  
  useEffect(() => {
    if (isMobile) {
      // Check if the user has already acknowledged the mobile warning
      const mobileAcknowledged = window.localStorage.getItem('mobileAcknowledged');
      const bodyHasClass = document.body.classList.contains('mobile-acknowledged');
      
      if (!mobileAcknowledged && !bodyHasClass) {
        setShowMobileWarning(true);
      }
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-start">
      {/* Mobile warning dialog */}
      <MobileWarning open={showMobileWarning} />
      
      {/* Animated background with matrix rain effect */}
      <AnimatedBackground />
      
      {/* TV noise overlay */}
      <NoiseOverlay />
      
      {/* Scanlines and glitch effect overlay */}
      <GlitchOverlay />
      
      {/* Search component */}
      <ConfessionSearch />
      
      {/* Connect wallet button */}
      <ConnectWallet />
      
      {/* Header - added pt-24 to increase top padding */}
      <header className="w-full pt-24 pb-8 px-4 flex flex-col items-center">
        <div className="text-center mb-2 animate-text-flicker">
          <h1 className="cyber-text text-3xl sm:text-4xl md:text-5xl font-bold mb-1 tracking-widest">
            OxCONFESSIONS
          </h1>
          <div className="cyber-text text-sm sm:text-base text-opacity-70 tracking-wider">
            BRUTAL · ANONYMOUS · ONCHAIN
          </div>
        </div>
        
        <div className="h-px w-32 bg-cyber-green my-4 animate-glow"></div>
        
        <p className="cyber-text text-center max-w-md text-sm text-opacity-80">
          Speak your truth to the void. Confessions stored on-chain. Forever anonymous.
          <br />Never linked to your identity.
        </p>
      </header>
      
      {/* Main content */}
      <main className="w-full flex-1 flex flex-col items-center px-4 gap-8">
        {/* Input for typing confession */}
        <ConfessionInput />
        
        {/* Confessions listed as floating pills */}
        <ConfessionsList />
      </main>
      
      {/* Footer */}
      <footer className="w-full py-4 px-4 text-center">
        <div className="cyber-text text-xs text-opacity-50 flex items-center justify-center gap-1">
          VIBECODED BY <a 
            href="https://x.com/0xjba" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-cyber-blue transition-colors duration-200 inline-flex items-center gap-1"
          >
            0XJBA <Twitter className="w-3 h-3 inline" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
