import React, { useState } from 'react'
import { useMeme } from '../context/MemeContext'
import { Upload, Type, Sparkles } from 'lucide-react'

const MemeGeneratorForm = () => {
  const [inputType, setInputType] = useState('text')
  const [textPrompt, setTextPrompt] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const { generateMeme, isGenerating, generationCount } = useMeme()

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = () => {
    if (inputType === 'text' && textPrompt.trim()) {
      generateMeme(textPrompt, 'text')
    } else if (inputType === 'upload' && uploadedImage) {
      generateMeme(uploadedImage, 'upload')
    } else {
      alert('Please provide input before generating a meme.')
    }
  }

  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Create Your Meme</h3>
      
      {/* Input Type Selector */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setInputType('text')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            inputType === 'text'
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <Type className="h-4 w-4" />
          <span>Text Prompt</span>
        </button>
        <button
          onClick={() => setInputType('upload')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            inputType === 'upload'
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <Upload className="h-4 w-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Input Area */}
      {inputType === 'text' ? (
        <div className="mb-6">
          <label className="block text-white/80 text-sm font-medium mb-2">
            Describe your meme idea
          </label>
          <textarea
            value={textPrompt}
            onChange={(e) => setTextPrompt(e.target.value)}
            placeholder="e.g., A cat wearing a business suit looking confused at a computer..."
            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-white/80 text-sm font-medium mb-2">
            Upload your image
          </label>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
            {uploadedImage ? (
              <div className="space-y-4">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="max-h-48 mx-auto rounded-lg"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-white/60 hover:text-white text-sm underline"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-white/40 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-white/60">Click to upload or drag and drop</p>
                  <p className="text-white/40 text-sm">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Generation Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-white/60">
          Generations remaining: <span className="text-white font-medium">{generationCount}</span>
        </div>
        {generationCount <= 1 && (
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || generationCount <= 0}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            <span>Generate Meme</span>
          </>
        )}
      </button>
    </div>
  )
}

export default MemeGeneratorForm