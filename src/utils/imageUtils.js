/**
 * Utility functions for image processing
 */

/**
 * Convert a data URL to a Blob
 * @param {string} dataUrl - The data URL
 * @returns {Blob} - The Blob object
 */
export const dataURLtoBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Convert a Blob to a data URL
 * @param {Blob} blob - The Blob object
 * @returns {Promise<string>} - The data URL
 */
export const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Resize an image to a maximum width and height
 * @param {string} dataUrl - The data URL of the image
 * @param {number} maxWidth - The maximum width
 * @param {number} maxHeight - The maximum height
 * @returns {Promise<string>} - The resized image as a data URL
 */
export const resizeImage = (dataUrl, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = Math.round(width * (maxHeight / height));
        height = maxHeight;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

/**
 * Add text to an image
 * @param {string} dataUrl - The data URL of the image
 * @param {string} text - The text to add
 * @param {Object} options - Options for text rendering
 * @returns {Promise<string>} - The image with text as a data URL
 */
export const addTextToImage = (dataUrl, text, options = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Set text style
      ctx.fillStyle = options.fillStyle || 'white';
      ctx.strokeStyle = options.strokeStyle || 'black';
      ctx.lineWidth = options.lineWidth || 2;
      ctx.font = options.font || 'bold 24px Arial';
      ctx.textAlign = options.textAlign || 'center';
      
      // Split text into lines if needed
      const maxWidth = canvas.width - 40;
      const words = text.split(' ');
      const lines = [];
      let currentLine = words[0];
      
      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);
      
      // Draw text with stroke (outline)
      const lineHeight = options.lineHeight || 30;
      const y = options.y || (canvas.height - (lines.length * lineHeight) - 20);
      
      lines.forEach((line, index) => {
        const lineY = y + (index * lineHeight);
        ctx.strokeText(line, canvas.width / 2, lineY);
        ctx.fillText(line, canvas.width / 2, lineY);
      });
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};

/**
 * Create a meme image with text
 * @param {string} imageUrl - The URL of the base image
 * @param {string} caption - The meme caption
 * @returns {Promise<string>} - The meme as a data URL
 */
export const createMemeImage = async (imageUrl, caption) => {
  try {
    // Fetch the image and convert to data URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const dataUrl = await blobToDataURL(blob);
    
    // Add caption to the image
    const memeDataUrl = await addTextToImage(dataUrl, caption);
    
    return memeDataUrl;
  } catch (error) {
    console.error('Error creating meme image:', error);
    throw error;
  }
};

export default {
  dataURLtoBlob,
  blobToDataURL,
  resizeImage,
  addTextToImage,
  createMemeImage
};

