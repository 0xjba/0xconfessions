
import React, { useEffect, useState } from 'react';

const GlitchOverlay: React.FC = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    // Set up random glitch effect intervals with reduced frequency
    const minInterval = 5000; // 5 seconds (increased from 2s)
    const maxInterval = 15000; // 15 seconds (increased from 8s)
    
    const triggerGlitch = () => {
      // Calculate random glitch duration between 150-600ms
      const glitchDuration = Math.random() * 450 + 150;
      
      setIsGlitching(true);
      
      // Turn off glitch effect after duration
      setTimeout(() => {
        setIsGlitching(false);
        
        // Schedule next glitch with random interval
        const nextGlitchDelay = Math.random() * (maxInterval - minInterval) + minInterval;
        setTimeout(triggerGlitch, nextGlitchDelay);
      }, glitchDuration);
    };
    
    // Start the first glitch after a random delay
    const initialDelay = Math.random() * 5000; // Increased from 3000ms
    const timerId = setTimeout(triggerGlitch, initialDelay);
    
    return () => {
      clearTimeout(timerId);
    };
  }, []);
  
  return (
    <>
      {/* Moving scanlines - adjusted for better visibility on dark background */}
      <div className="scanlines-moving fixed inset-0 w-full h-full pointer-events-none z-[1000]" />
      
      {/* Occasional glitch effect */}
      {isGlitching && (
        <div className="glitch-effect fixed inset-0 w-full h-full pointer-events-none z-[1001]" />
      )}
    </>
  );
};

export default GlitchOverlay;
