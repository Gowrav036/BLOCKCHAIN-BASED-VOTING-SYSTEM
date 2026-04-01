/**
 * Blockchain Service - Placeholder functions for blockchain integration
 * Replace with actual Web3/ethers.js implementation when connecting to real blockchain
 */

const MOCK_DELAY = 800;

// Simulate async blockchain calls
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const FACE_GRID_SIZE = 16;

const getImageData = (imageDataUrl) => {
  if (typeof document === 'undefined') return null;
  const img = new Image();
  img.src = imageDataUrl;
  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = FACE_GRID_SIZE;
      canvas.height = FACE_GRID_SIZE;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, FACE_GRID_SIZE, FACE_GRID_SIZE);
      resolve(ctx.getImageData(0, 0, FACE_GRID_SIZE, FACE_GRID_SIZE).data);
    };
    img.onerror = () => resolve(null);
  });
};

export const createFaceSignature = async (imageDataUrl) => {
  const data = await getImageData(imageDataUrl);
  if (!data) return null;

  const gray = [];
  for (let i = 0; i < data.length; i += 4) {
    const brightness = Math.round((data[i] + data[i + 1] + data[i + 2]) / 3);
    gray.push(brightness);
  }

  const avg = gray.reduce((sum, v) => sum + v, 0) / gray.length;
  return gray.map((v) => (v >= avg ? '1' : '0')).join('');
};

export const verifyFaceMatch = (liveSignature, storedSignature) => {
  if (!liveSignature || !storedSignature) return false;
  if (liveSignature.length !== storedSignature.length) return false;

  let sameBits = 0;
  for (let i = 0; i < liveSignature.length; i += 1) {
    if (liveSignature[i] === storedSignature[i]) sameBits += 1;
  }

  const similarity = sameBits / liveSignature.length;
  return similarity >= 0.72;
};

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
      { id: '1', name: 'Narendra Modi', party: 'BJP', votes: 0 },
      { id: '2', name: 'Rahul Gandhi', party: 'Congress', votes: 0 },
      { id: '3', name: 'Arvind Kejriwal', party: 'AAP', votes: 0 },
      { id: '4', name: 'Mamata Banerjee', party: 'TMC', votes: 0 },
      { id: '5', name: 'N Chandrababu Naidu', party: 'TDP', votes: 0 },
      { id: '6', name: 'Sitaram Yechury', party: 'CPI(M)', votes: 0 },
      { id: '7', name: 'Tejasvi Surya', party: 'BSP', votes: 0 },
      { id: '8', name: 'NOTA', party: 'None of the Above', votes: 0 },
    ],
    totalVotes: 0,
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
