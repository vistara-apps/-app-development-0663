import React from 'react'
import { useMeme } from '../context/MemeContext'
import { Zap, TrendingUp, Target, Users } from 'lucide-react'

const StatsCards = () => {
  const { generationCount } = useMeme()

  const stats = [
    {
      title: 'Generations Left',
      value: generationCount,
      icon: Zap,
      color: 'from-blue-400 to-blue-600',
      description: 'Free tier limit'
    },
    {
      title: 'Avg. Engagement',
      value: '87%',
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      description: 'Your memes perform well!'
    },
    {
      title: 'Viral Score',
      value: '92',
      icon: Target,
      color: 'from-purple-400 to-purple-600',
      description: 'AI prediction accuracy'
    },
    {
      title: 'Community',
      value: '15.2K',
      icon: Users,
      color: 'from-pink-400 to-pink-600',
      description: 'Active creators'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="glass-card rounded-lg p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/80 font-medium text-sm mb-1">{stat.title}</p>
              <p className="text-white/60 text-xs">{stat.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards