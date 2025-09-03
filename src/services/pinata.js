/**
 * Service for interacting with Pinata API for IPFS storage
 */

// Initialize Pinata client
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

/**
 * Upload a file to IPFS via Pinata
 * @param {File|Blob} file - The file to upload
 * @param {string} name - Name for the file
 * @returns {Promise<string>} - IPFS hash (CID) of the uploaded file
 */
export const uploadToIPFS = async (file, name) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const metadata = JSON.stringify({
      name: name || `meme-${Date.now()}`,
      keyvalues: {
        app: 'MemeMaster AI',
        timestamp: Date.now().toString()
      }
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0
    });
    formData.append('pinataOptions', options);
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.details || 'Failed to upload to IPFS');
    }
    
    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

/**
 * Upload JSON data to IPFS via Pinata
 * @param {Object} jsonData - The JSON data to upload
 * @param {string} name - Name for the JSON file
 * @returns {Promise<string>} - IPFS hash (CID) of the uploaded JSON
 */
export const uploadJSONToIPFS = async (jsonData, name) => {
  try {
    const data = JSON.stringify(jsonData);
    
    const metadata = JSON.stringify({
      name: name || `meme-metadata-${Date.now()}`,
      keyvalues: {
        app: 'MemeMaster AI',
        timestamp: Date.now().toString()
      }
    });
    
    const options = JSON.stringify({
      cidVersion: 0
    });
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataMetadata: JSON.parse(metadata),
        pinataOptions: JSON.parse(options)
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.details || 'Failed to upload JSON to IPFS');
    }
    
    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw error;
  }
};

/**
 * Get the IPFS gateway URL for a given CID
 * @param {string} cid - The IPFS content identifier (hash)
 * @returns {string} - The gateway URL
 */
export const getIPFSGatewayURL = (cid) => {
  if (!cid) return null;
  return `${PINATA_GATEWAY}/ipfs/${cid}`;
};

/**
 * Upload a meme to IPFS
 * @param {Object} meme - The meme object with caption, image, etc.
 * @returns {Promise<Object>} - Object with image CID and metadata CID
 */
export const uploadMemeToIPFS = async (meme) => {
  try {
    // First, upload the image
    const imageBlob = await fetch(meme.image).then(r => r.blob());
    const imageCID = await uploadToIPFS(imageBlob, `meme-image-${Date.now()}`);
    
    // Then, upload the metadata
    const metadata = {
      name: `Meme ${Date.now()}`,
      description: meme.caption,
      image: getIPFSGatewayURL(imageCID),
      attributes: [
        {
          trait_type: 'Humor Style',
          value: meme.humorStyle
        },
        {
          trait_type: 'Engagement Score',
          value: meme.engagementScore || 0
        },
        {
          trait_type: 'Created At',
          value: meme.timestamp || new Date().toISOString()
        }
      ]
    };
    
    const metadataCID = await uploadJSONToIPFS(metadata, `meme-metadata-${Date.now()}`);
    
    return {
      imageCID,
      metadataCID,
      imageUrl: getIPFSGatewayURL(imageCID),
      metadataUrl: getIPFSGatewayURL(metadataCID)
    };
  } catch (error) {
    console.error('Error uploading meme to IPFS:', error);
    throw error;
  }
};

export default {
  uploadToIPFS,
  uploadJSONToIPFS,
  getIPFSGatewayURL,
  uploadMemeToIPFS
};

