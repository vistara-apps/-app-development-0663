import React from 'react'
import { useMeme } from '../context/MemeContext'

const HumorSlider = () => {
  const { humorStyle, setHumorStyle } = useMeme()

  const humorStyles = [
    {
      id: 'witty',
      name: 'Witty',
      description: 'Clever and sharp humor',
      emoji: '🧠'
    },
    {
      id: 'absurd',
      name: 'Absurd',
      description: 'Random and surreal comedy',
      emoji: '🤪'
    },
    {
      id: 'dry',
      name: 'Dry',
      description: 'Deadpan and subtle humor',
      emoji: '😐'
    },
    {
      id: 'edgy',
      name: 'Edgy',
      description: 'Bold and provocative',
      emoji: '😈'
    }
  ]

  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Humor Style</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {humorStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => setHumorStyle(style.id)}
            className={`p-4 rounded-lg transition-all duration-200 text-left ${
              humorStyle === style.id
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-white/5 hover:bg-white/10 text-white'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{style.emoji}</span>
              <span className="font-semibold">{style.name}</span>
            </div>
            <p className={`text-sm ${
              humorStyle === style.id ? 'text-white/90' : 'text-white/60'
            }`}>
              {style.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-white/80 text-sm font-medium">Selected:</span>
          <span className="text-white font-semibold capitalize">{humorStyle}</span>
        </div>
        <p className="text-white/60 text-sm">
          AI will generate captions matching this humor style
        </p>
      </div>
    </div>
  )
}

export default HumorSlider