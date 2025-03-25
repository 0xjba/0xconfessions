
import React, { useEffect, useState } from 'react';

const GlitchOverlay: React.FC = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    // Set up random glitch effect intervals
    const minInterval = 2000; // 2 seconds
    const maxInterval = 8000; // 8 seconds (reduced from 10s for more frequent glitches)
    
    const triggerGlitch = () => {
      // Calculate random glitch duration between 150-600ms (increased duration)
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
    const initialDelay = Math.random() * 3000; // Reduced from 5000ms
    const timerId = setTimeout(triggerGlitch, initialDelay);
    
    return () => {
      clearTimeout(timerId);
    };
  }, []);
  
  return (
    <>
      {/* Moving scanlines */}
      <div className="scanlines-moving fixed inset-0 w-full h-full pointer-events-none z-[1000] mix-blend-overlay" />
      
      {/* Occasional glitch effect */}
      {isGlitching && (
        <div className="glitch-effect fixed inset-0 w-full h-full pointer-events-none z-[1001]" />
      )}
    </>
  );
};

export default GlitchOverlay;
