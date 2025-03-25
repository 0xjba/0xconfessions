
import React, { useEffect, useState } from 'react';

const GlitchOverlay: React.FC = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    // More frequent glitching intervals
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance of glitching (increased from 30%)
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150 + Math.random() * 300); // Longer duration
      }
    }, 1000); // Check every 1 second (reduced from 2s)
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  return (
    <div className={`glitch-effect-overlay ${isGlitching ? 'active' : ''}`}>
      <div className="glitch-lines"></div>
      <div className="glitch-color-shift"></div>
      <div className="glitch-scanlines"></div>
    </div>
  );
};

export default GlitchOverlay;
