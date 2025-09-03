import React, { useState } from 'react'
import { useMeme } from '../context/MemeContext'
import MemeGeneratorForm from './MemeGeneratorForm'
import HumorSlider from './HumorSlider'
import MemeDisplay from './MemeDisplay'
import EngagementCard from './EngagementCard'

const MemeGenerator = () => {
  const { generatedMeme, isGenerating, engagementScore } = useMeme()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-3xl font-bold text-white mb-2">Meme Generator</h2>
        <p className="text-white/80">Create viral memes with AI-powered humor tuning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input Controls */}
        <div className="space-y-6">
          <MemeGeneratorForm />
          <HumorSlider />
        </div>

        {/* Right Column - Generated Meme & Analytics */}
        <div className="space-y-6">
          <MemeDisplay />
          {engagementScore && <EngagementCard score={engagementScore} />}
        </div>
      </div>
    </div>
  )
}

export default MemeGenerator