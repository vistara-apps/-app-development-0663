/**
 * Utility functions for sharing content
 */

/**
 * Share content using the Web Share API if available
 * @param {Object} shareData - The data to share
 * @param {string} shareData.title - The title of the shared content
 * @param {string} shareData.text - The text to share
 * @param {string} shareData.url - The URL to share
 * @param {File[]} shareData.files - Files to share (optional)
 * @returns {Promise<boolean>} - Whether the share was successful
 */
export const shareContent = async (shareData) => {
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return true;
    } else {
      // Fallback for browsers that don't support Web Share API
      return false;
    }
  } catch (error) {
    console.error('Error sharing content:', error);
    return false;
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - Whether the copy was successful
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Share a meme on social media
 * @param {Object} meme - The meme object
 * @param {string} platform - The social media platform (twitter, facebook, etc.)
 * @returns {boolean} - Whether the share was initiated
 */
export const shareMemeOnSocialMedia = (meme, platform) => {
  try {
    const text = `"${meme.caption}" - Created with MemeMaster AI`;
    const url = window.location.origin;
    
    let shareUrl;
    
    switch (platform.toLowerCase()) {
      case 'twitter':
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent('Check out this meme!')}&summary=${encodeURIComponent(text)}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
      default:
        return false;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    return true;
  } catch (error) {
    console.error(`Error sharing on ${platform}:`, error);
    return false;
  }
};

/**
 * Share a meme via Web Share API
 * @param {Object} meme - The meme object
 * @returns {Promise<boolean>} - Whether the share was successful
 */
export const shareMeme = async (meme) => {
  try {
    // Try to share with files if the meme has an image
    if (meme.image) {
      try {
        const response = await fetch(meme.image);
        const blob = await response.blob();
        const file = new File([blob], 'meme.png', { type: 'image/png' });
        
        const shareData = {
          title: 'Check out this meme!',
          text: meme.caption,
          files: [file]
        };
        
        const success = await shareContent(shareData);
        if (success) return true;
      } catch (err) {
        console.error('Error sharing with file:', err);
        // Fall back to sharing without file
      }
    }
    
    // Share without file
    const shareData = {
      title: 'Check out this meme!',
      text: `"${meme.caption}" - Created with MemeMaster AI`,
      url: window.location.origin
    };
    
    return await shareContent(shareData);
  } catch (error) {
    console.error('Error sharing meme:', error);
    return false;
  }
};

export default {
  shareContent,
  copyToClipboard,
  shareMemeOnSocialMedia,
  shareMeme
};

