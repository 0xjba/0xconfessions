
// Contract configuration with fallback values

// Extend the ImportMetaEnv interface instead of redefining ImportMeta
interface ImportMetaEnv {
  VITE_CONFESSIONS_CONTRACT_ADDRESS?: string;
}

// If environment variable is set, use it, otherwise use the fallback value
export const CONFESSIONS_CONTRACT_ADDRESS = 
  import.meta.env.VITE_CONFESSIONS_CONTRACT_ADDRESS || 
  "0xEfF03873B5E8656efF58A2ECcb25aD766a97015f";
