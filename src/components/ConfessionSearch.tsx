
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useWeb3 } from '../lib/web3';
import ConfessionPill from './ConfessionPill';
import { toast } from 'sonner';

const ConfessionSearch: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<null | any>(null);
  const { getConfessionById } = useWeb3();

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast.error("Please enter a valid confession ID");
      return;
    }

    const confessionId = parseInt(searchInput.trim());
    if (isNaN(confessionId)) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      const confession = await getConfessionById(confessionId);
      if (confession) {
        setSearchResult(confession);
      } else {
        toast.error(`Confession #${confessionId} not found`);
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Error searching for confession:", error);
      toast.error("Error searching for confession");
      setSearchResult(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setSearchInput('');
      setSearchResult(null);
    }
  };

  return (
    <div 
      className={`fixed top-4 left-4 z-20 overflow-hidden transition-all duration-300 bg-cyber-black bg-opacity-70 backdrop-blur-lg border border-gray-700 rounded-lg ${
        isExpanded ? 'w-64' : 'w-10 h-10'
      }`}
    >
      <div className="flex items-center">
        <button
          className="p-2 text-white hover:text-cyber-green transition-colors"
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (!isExpanded) {
              setSearchResult(null);
            }
          }}
        >
          <Search size={20} />
        </button>
        
        {isExpanded && (
          <div className="flex-1 py-2 pr-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Confession ID"
              className="w-full bg-transparent text-white border-b border-gray-700 focus:border-cyber-green focus:outline-none px-1 py-1 text-sm"
              autoFocus
            />
          </div>
        )}
      </div>
      
      {isExpanded && searchResult && (
        <div className="p-3 border-t border-gray-700 mt-2">
          <p className="text-xs text-white mb-2">Found confession:</p>
          <div className="flex justify-center">
            <ConfessionPill 
              confession={searchResult} 
              index={0}
              showUpvotes={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfessionSearch;
