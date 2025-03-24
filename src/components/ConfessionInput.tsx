
import React, { useState, useRef, useEffect } from 'react';
import { useWeb3 } from '../lib/web3';
import { toast } from "sonner";

const ConfessionInput: React.FC = () => {
  const [confession, setConfession] = useState('');
  const { connected, loading, submitConfession } = useWeb3();
  const maxLength = 280;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering && audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isHovering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        <audio 
          ref={audioRef} 
          src="/electric-hum.mp3" 
          loop 
        />
        
        {/* Input pill */}
        <div 
          className={`w-full relative multicolor-border-blue-purple flex items-center group overflow-hidden mb-2 rounded-full transition-all duration-300 bg-cyber-black bg-opacity-80 backdrop-blur-lg ${isHovering ? 'animate-glow-pulsate' : ''}`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <input
            type="text"
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            placeholder="TYPE YOUR CONFESSION HERE..."
            className="w-full bg-transparent border-none outline-none text-white py-3 px-6 text-base sm:text-lg"
            maxLength={maxLength}
            disabled={loading}
          />
          
          <button
            type="submit"
            className="absolute right-2 rounded-full px-4 py-1 bg-cyber-black hover:bg-cyber-darkgray flex items-center justify-center disabled:opacity-50 transition-all duration-200 border border-white/10"
            disabled={loading || !connected || !confession.trim()}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-white text-sm">CONFESS</span>
            )}
          </button>
          
          {/* Character counter */}
          <div className="absolute bottom-1 left-6 flex items-center">
            <span className={`text-xs ${confession.length > maxLength ? 'text-red-500' : 'text-white text-opacity-50'}`}>
              {confession.length}/{maxLength}
            </span>
          </div>
        </div>
        
        {/* Status text */}
        <div className={`text-xs text-white ${connected ? 'text-opacity-50' : 'text-opacity-100 animate-pulse-soft'}`}>
          {connected 
            ? 'POWERED BY TEN NETWORK\'S ENCRYPTION' 
            : 'CONNECT WALLET TO SUBMIT CONFESSIONS'}
        </div>
      </form>
    </div>
  );
};

export default ConfessionInput;
