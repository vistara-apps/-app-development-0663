import React from 'react'
import { Image, Type, Sparkles, BarChart3 } from 'lucide-react'

const QuickActions = ({ setCurrentView }) => {
  const actions = [
    {
      title: 'Upload Image',
      description: 'Create meme from your image',
      icon: Image,
      color: 'from-blue-400 to-blue-600',
      action: () => setCurrentView('generator')
    },
    {
      title: 'Text Prompt',
      description: 'Generate from description',
      icon: Type,
      color: 'from-purple-400 to-purple-600',
      action: () => setCurrentView('generator')
    },
    {
      title: 'Style Tuner',
      description: 'Customize humor style',
      icon: Sparkles,
      color: 'from-pink-400 to-pink-600',
      action: () => setCurrentView('generator')
    },
    {
      title: 'Analytics',
      description: 'View engagement insights',
      icon: BarChart3,
      color: 'from-green-400 to-green-600',
      action: () => alert('Analytics coming soon!')
    }
  ]

  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={action.action}
              className="flex items-center space-x-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 transform hover:scale-105 text-left"
            >
              <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">{action.title}</h4>
                <p className="text-white/60 text-sm">{action.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions