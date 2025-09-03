import React from 'react'
import { useMeme } from '../context/MemeContext'
import { Download, Share2, RotateCcw, Heart } from 'lucide-react'

const MemeDisplay = () => {
  const { generatedMeme, isGenerating } = useMeme()

  const handleDownload = () => {
    if (generatedMeme) {
      // Mock download functionality
      alert('Download feature coming soon!')
    }
  }

  const handleShare = () => {
    if (generatedMeme) {
      // Mock share functionality
      alert('Share feature coming soon!')
    }
  }

  const handleRegenerate = () => {
    if (generatedMeme) {
      alert('Regeneration feature coming soon!')
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