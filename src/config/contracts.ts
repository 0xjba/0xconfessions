
// Contract configuration with environment variables

// Extend the ImportMetaEnv interface
interface ImportMetaEnv {
  VITE_CONFESSIONS_CONTRACT_ADDRESS?: string;
}

// The contract address should be set in the .env file as VITE_CONFESSIONS_CONTRACT_ADDRESS
// For local development, we provide a fallback value
export const CONFESSIONS_CONTRACT_ADDRESS = 
  import.meta.env.VITE_CONFESSIONS_CONTRACT_ADDRESS || 
  "0xEfF03873B5E8656efF58A2ECcb25aD766a97015f";

// To use your own contract address, create a .env file in the project root with:
// VITE_CONFESSIONS_CONTRACT_ADDRESS=0xYourContractAddressHere
