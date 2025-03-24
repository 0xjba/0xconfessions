
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
      
      {/* Random bits of "code" for decoration */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div 
          key={i}
          className="absolute cyber-text text-xs sm:text-sm opacity-10 select-none"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `pulse-soft ${3 + Math.random() * 5}s ease-in-out infinite`
          }}
        >
          {getRandomMatrixSnippet()}
        </div>
      ))}
    </div>
  );
};

// Helper function to generate random "code" snippets
const getRandomMatrixSnippet = (): string => {
  const snippets = [
    "01100101 01111000 01101001 01110011 01110100",
    "< anon :: secure />",
    "0x7fE3A47BBa44b9b70401",
    "function confess() { ... }",
    "pragma solidity ^0.8.18;",
    "uint256 timestamp;",
    "bytes32 encrypted;",
    "constructor() anonymous {",
    "event ConfessionAdded()",
    "mapping(address => bool)",
    "commit(keccak256(message))",
    "Error: tx reverted",
    "0x00000000000000",
    "function getRecentConfessions()",
    "address(0)",
  ];
  
  return snippets[Math.floor(Math.random() * snippets.length)];
};

export default AnimatedBackground;
