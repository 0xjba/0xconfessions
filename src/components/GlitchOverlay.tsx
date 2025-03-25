
import React, { useEffect, useState } from 'react';

const GlitchOverlay: React.FC = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    // Random glitching intervals
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of glitching
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100 + Math.random() * 200); // Random duration
      }
    }, 2000); // Check every 2 seconds
    
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
