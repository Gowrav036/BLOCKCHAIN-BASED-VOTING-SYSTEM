/**
 * Blockchain Service - Placeholder functions for blockchain integration
 * Replace with actual Web3/ethers.js implementation when connecting to real blockchain
 */

const MOCK_DELAY = 800;

// Simulate async blockchain calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Connect user's wallet via MetaMask
 * Uses the injected `window.ethereum` provider.
 * @returns {Promise<{address?: string, success: boolean, error?: string}>}
 */
export const connectWallet = async () => {
  // Ensure we are in a browser and MetaMask (or another EIP-1193 provider) is available
  if (typeof window === 'undefined' || !window.ethereum) {
    return {
      success: false,
      error: 'MetaMask is not installed. Please install MetaMask and try again.',
    };
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const address = accounts && accounts[0];

    if (!address) {
      return {
        success: false,
        error: 'No accounts returned from MetaMask.',
      };
    }

    return {
      success: true,
      address,
    };
  } catch (error) {
    // Handle user rejection and other errors
    if (error.code === 4001) {
      // EIP-1193 user rejected request
      return {
        success: false,
        error: 'Connection request rejected by user.',
      };
    }

    return {
      success: false,
      error: error?.message || 'Failed to connect wallet.',
    };
  }
};

/**
 * Register a new user/voter on the blockchain
 * @param {Object} userData - { name, email, walletAddress }
 * @returns {Promise<{success: boolean, txHash?: string}>}
 */
export const registerUser = async (userData) => {
  await delay(MOCK_DELAY);
  return {
    success: true,
    txHash: '0x' + Math.random().toString(16).slice(2, 66),
  };
};

/**
 * Add a candidate to the election (Admin only)
 * @param {Object} candidate - { name, party, manifesto }
 * @returns {Promise<{success: boolean, candidateId?: string}>}
 */
export const addCandidate = async (candidate) => {
  await delay(MOCK_DELAY);
  return {
    success: true,
    candidateId: 'cand_' + Date.now(),
  };
};

/**
 * Cast a vote for a candidate
 * @param {string} candidateId - ID of the candidate
 * @param {string} voterAddress - Wallet address of voter
 * @returns {Promise<{success: boolean, txHash?: string}>}
 */
export const castVote = async (candidateId, voterAddress) => {
  await delay(MOCK_DELAY);
  return {
    success: true,
    txHash: '0x' + Math.random().toString(16).slice(2, 66),
  };
};

/**
 * Get voting results from blockchain
 * @returns {Promise<{results: Array, totalVotes: number}>}
 */
export const getResults = async () => {
  await delay(MOCK_DELAY);
  return {
    results: [
      { id: '1', name: 'Alice Johnson', party: 'Progressive Party', votes: 1250 },
      { id: '2', name: 'Bob Smith', party: 'Unity Party', votes: 980 },
      { id: '3', name: 'Carol Williams', party: 'Green Alliance', votes: 756 },
    ],
    totalVotes: 2986,
  };
};

/**
 * Get election status (active/ended)
 * @returns {Promise<{isActive: boolean}>}
 */
export const getElectionStatus = async () => {
  await delay(300);
  return { isActive: true };
};
