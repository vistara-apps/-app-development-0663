import React from 'react'
import { useMeme } from '../context/MemeContext'
import MemeGeneratorForm from './MemeGeneratorForm'
import HumorSlider from './HumorSlider'
import MemeDisplay from './MemeDisplay'
import EngagementCard from './EngagementCard'
import { AlertCircle } from 'lucide-react'

const MemeGenerator = () => {
  const { generatedMeme, isGenerating, engagementScore, error } = useMeme()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-3xl font-bold text-white mb-2">Meme Generator</h2>
        <p className="text-white/80">Create viral memes with AI-powered humor tuning</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-white text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Controls */}
        <div className="space-y-6">
          <MemeGeneratorForm />
          <HumorSlider />
        </div>

        {/* Right Column - Generated Meme & Analytics */}
        <div className="space-y-6">
          <MemeDisplay />
          <EngagementCard />
        </div>
      </div>
    </div>
  )
}

export default MemeGenerator
