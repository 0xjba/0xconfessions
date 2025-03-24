
import React, { useState } from 'react';
import { useWeb3 } from '../lib/web3';
import { toast } from "sonner";

const ConfessionInput: React.FC = () => {
  const [confession, setConfession] = useState('');
  const { connected, loading, submitConfession } = useWeb3();
  const maxLength = 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!confession.trim()) {
      toast.error("Confession cannot be empty");
      return;
    }
    
    if (confession.length > maxLength) {
      toast.error(`Confession must be ${maxLength} characters or less`);
      return;
    }
    
    await submitConfession(confession);
    setConfession('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className="relative w-full flex flex-col items-center"
      >
        {/* Input pill */}
        <div className="w-full relative cyber-pill flex items-center group overflow-hidden mb-2 hover:shadow-[0_0_15px_rgba(0,255,65,0.7)] transition-all duration-300">
          <input
            type="text"
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            placeholder="TYPE YOUR CONFESSION HERE..."
            className="w-full bg-transparent border-none outline-none cyber-text py-3 px-4 text-base sm:text-lg"
            maxLength={maxLength}
            disabled={loading}
          />
          
          <button
            type="submit"
            className="absolute right-2 cyber-pill px-4 py-1 bg-cyber-black hover:bg-cyber-darkgray flex items-center justify-center disabled:opacity-50 transition-all duration-200"
            disabled={loading || !connected || !confession.trim()}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-cyber-green border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="cyber-text text-sm">CONFESS</span>
            )}
          </button>
          
          {/* Character counter */}
          <div className="absolute bottom-1 left-4 flex items-center">
            <span className={`text-xs ${confession.length > maxLength ? 'text-cyber-red' : 'text-cyber-green text-opacity-50'}`}>
              {confession.length}/{maxLength}
            </span>
          </div>
        </div>
        
        {/* Status text */}
        <div className={`text-xs cyber-text ${connected ? 'text-opacity-50' : 'text-opacity-100 animate-pulse-soft'}`}>
          {connected 
            ? 'BRUTALLY HONEST. COMPLETELY ANONYMOUS.' 
            : 'CONNECT WALLET TO SUBMIT CONFESSIONS'}
        </div>
      </form>
    </div>
  );
};

export default ConfessionInput;
