# Pinata Integration Documentation

This document provides detailed information about the Pinata integration in the MemeMaster AI application.

## Overview

MemeMaster AI uses Pinata for decentralized storage of generated meme images and metadata on IPFS (InterPlanetary File System). This integration ensures that memes are stored in a persistent and decentralized manner, making them accessible even if the application's servers are unavailable.

## Integration Components

1. **Image Storage**: Upload generated meme images to IPFS via Pinata.
2. **Metadata Storage**: Store meme metadata (caption, humor style, engagement score, etc.) on IPFS.
3. **Gateway Access**: Access stored content through Pinata's IPFS gateway.

## Implementation Details

The `src/services/pinata.js` file provides functions for interacting with the Pinata API:

### Configuration

```javascript
// Initialize Pinata client
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud';
```

### File Upload

The `uploadToIPFS` function handles uploading files to IPFS via Pinata:

```javascript
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
```

### JSON Upload

The `uploadJSONToIPFS` function handles uploading JSON data to IPFS:

```javascript
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
```

### Gateway URL Generation

The `getIPFSGatewayURL` function generates a gateway URL for accessing IPFS content:

```javascript
export const getIPFSGatewayURL = (cid) => {
  if (!cid) return null;
  return `${PINATA_GATEWAY}/ipfs/${cid}`;
};
```

### Meme Upload

The `uploadMemeToIPFS` function handles uploading a complete meme (image and metadata) to IPFS:

```javascript
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
```

## Metadata Format

The metadata for each meme follows a standard format:

```json
{
  "name": "Meme 1672531200000",
  "description": "When the code compiles on the first try but you don't know why",
  "image": "https://gateway.pinata.cloud/ipfs/QmXyZ...",
  "attributes": [
    {
      "trait_type": "Humor Style",
      "value": "witty"
    },
    {
      "trait_type": "Engagement Score",
      "value": 85
    },
    {
      "trait_type": "Created At",
      "value": "2023-01-01T00:00:00Z"
    }
  ]
}
```

This format is compatible with NFT standards, allowing for potential future integration with NFT marketplaces.

## Integration with Meme Generation

The Pinata integration is used in the meme generation workflow:

1. A meme is generated using the OpenAI API.
2. The meme image and metadata are uploaded to IPFS via Pinata.
3. The IPFS CIDs and gateway URLs are stored in the database.
4. The meme is displayed to the user with the gateway URL.

## Security Considerations

1. **API Key Management**: Pinata API keys are stored in environment variables and never exposed to the client.
2. **Content Verification**: Verify that uploaded content meets application guidelines.
3. **Rate Limiting**: Implement rate limiting to prevent abuse of the Pinata API.
4. **Error Handling**: Properly handle and log errors from the Pinata API.

## Production Considerations

For a production deployment, consider the following enhancements:

1. **Server-Side Implementation**: Move API calls to a backend service to protect API keys.
2. **Dedicated Pinata Plan**: Use a paid Pinata plan for higher rate limits and dedicated gateways.
3. **Multiple Gateways**: Use multiple IPFS gateways for redundancy.
4. **Content Moderation**: Implement content moderation before uploading to IPFS.
5. **Backup Strategy**: Implement a backup strategy for IPFS CIDs.

## Usage Examples

### Uploading a Meme to IPFS

```javascript
import { uploadMemeToIPFS } from '../services/pinata';

// Upload a meme to IPFS
const meme = {
  caption: "When the code compiles on the first try but you don't know why",
  image: "https://example.com/meme-image.jpg",
  humorStyle: "witty",
  engagementScore: 85,
  timestamp: new Date().toISOString()
};

const ipfsData = await uploadMemeToIPFS(meme);
console.log(ipfsData);
// Output: { imageCID: "QmXyZ...", metadataCID: "QmAbc...", imageUrl: "https://gateway.pinata.cloud/ipfs/QmXyZ...", metadataUrl: "https://gateway.pinata.cloud/ipfs/QmAbc..." }
```

### Accessing IPFS Content

```javascript
import { getIPFSGatewayURL } from '../services/pinata';

// Get the gateway URL for a CID
const gatewayUrl = getIPFSGatewayURL("QmXyZ...");
console.log(gatewayUrl);
// Output: "https://gateway.pinata.cloud/ipfs/QmXyZ..."
```

## Troubleshooting

Common issues and their solutions:

1. **API Key Issues**: Ensure the Pinata API key and secret are correctly set in the environment variables.
2. **Rate Limiting**: Implement exponential backoff for retries when rate limits are hit.
3. **File Size Limits**: Be aware of Pinata's file size limits and implement file compression if necessary.
4. **Gateway Availability**: Use multiple gateways or implement fallback mechanisms for gateway unavailability.
5. **Content Addressing**: Understand that IPFS uses content addressing, so identical files will have the same CID.

