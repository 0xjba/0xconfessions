
import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      {/* Grid background with matrix effect */}
      <div className="absolute inset-0 grid-lines opacity-60"></div>
      
      {/* Animated glitch effect overlay */}
      <div className="absolute inset-0 glitch-overlay"></div>
      
      {/* Gradient overlays */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyber-black to-transparent opacity-80"></div>
      <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-cyber-black to-transparent opacity-70"></div>
    </div>
  );
};

export default AnimatedBackground;
