import React from 'react'
import { useMeme } from '../context/MemeContext'
import { Download, Share2, RotateCcw, Heart, AlertCircle } from 'lucide-react'

const MemeDisplay = () => {
  const { generatedMeme, isGenerating, error, regenerateMeme } = useMeme()

  const handleDownload = () => {
    if (!generatedMeme) return;
    
    // Create a temporary canvas to combine image and text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Add caption text
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      
      // Split caption into lines if needed
      const maxWidth = canvas.width - 40;
      const words = generatedMeme.caption.split(' ');
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
      const lineHeight = 30;
      const y = canvas.height - (lines.length * lineHeight) - 20;
      
      lines.forEach((line, index) => {
        const lineY = y + (index * lineHeight);
        ctx.strokeText(line, canvas.width / 2, lineY);
        ctx.fillText(line, canvas.width / 2, lineY);
      });
      
      // Convert canvas to data URL and trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `meme-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    };
    
    img.onerror = () => {
      alert('Failed to load image for download. Please try again.');
    };
    
    img.src = generatedMeme.image;
  }

  const handleShare = () => {
    if (!generatedMeme) return;
    
    // Check if Web Share API is available
    if (navigator.share) {
      // Create a blob from the image
      fetch(generatedMeme.image)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'meme.png', { type: 'image/png' });
          
          navigator.share({
            title: 'Check out this meme I created with MemeMaster AI!',
            text: generatedMeme.caption,
            files: [file]
          }).catch(err => {
            console.error('Share failed:', err);
            // Fallback to clipboard
            copyToClipboard();
          });
        })
        .catch(err => {
          console.error('Failed to fetch image:', err);
          // Fallback to clipboard
          copyToClipboard();
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  }
  
  const copyToClipboard = () => {
    const shareText = `"${generatedMeme.caption}" - Created with MemeMaster AI`;
    navigator.clipboard.writeText(shareText)
      .then(() => alert('Meme caption copied to clipboard!'))
      .catch(err => alert('Failed to copy to clipboard. Please try again.'));
  }

  const handleRegenerate = () => {
    if (generatedMeme) {
      regenerateMeme();
    }
  }

  if (isGenerating) {
    return (
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Generated Meme</h3>
        <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/60">AI is crafting your meme...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Generated Meme</h3>
        <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-red-400/40">
          <div className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Error</p>
            <p className="text-white/60">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!generatedMeme) {
    return (
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Generated Meme</h3>
        <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-white/20">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-white/60">Your generated meme will appear here</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Generated Meme</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-white/60 text-sm">
            <Heart className="h-4 w-4" />
            <span>Fresh</span>
          </div>
        </div>
      </div>

      {/* Meme Container */}
      <div className="relative bg-white rounded-lg p-4 mb-6">
        <img 
          src={generatedMeme.image}
          alt="Generated meme"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <div className="text-center">
          <p className="text-black font-bold text-lg leading-tight">
            {generatedMeme.caption}
          </p>
        </div>
      </div>

      {/* Meme Info */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/60">Style:</span>
            <span className="text-white font-medium ml-2 capitalize">
              {generatedMeme.humorStyle}
            </span>
          </div>
          <div>
            <span className="text-white/60">Created:</span>
            <span className="text-white font-medium ml-2">Just now</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button
          onClick={handleRegenerate}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Retry</span>
        </button>
      </div>
    </div>
  )
}

export default MemeDisplay
