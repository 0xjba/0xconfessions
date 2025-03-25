
import React, { useEffect, useState } from 'react';

const GlitchOverlay: React.FC = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    // Set up random glitch effect intervals with increased frequency
    const minInterval = 3000; // 3 seconds (decreased from 5s)
    const maxInterval = 10000; // 10 seconds (decreased from 15s)
    
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
    
    // Start the first glitch after a shorter random delay
    const initialDelay = Math.random() * 3000; // Decreased from 5000ms
    const timerId = setTimeout(triggerGlitch, initialDelay);
    
    return () => {
      clearTimeout(timerId);
    };
  }, []);
  
  return (
    <>
      {/* Enhanced scanlines with more visibility against dark background */}
      <div className="scanlines-enhanced fixed inset-0 w-full h-full pointer-events-none z-[1000]" />
      
      {/* Occasional glitch effect */}
      {isGlitching && (
        <div className="glitch-effect fixed inset-0 w-full h-full pointer-events-none z-[1001]" />
      )}
    </>
  );
};

export default GlitchOverlay;
