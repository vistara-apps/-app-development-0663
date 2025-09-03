import React from 'react'
import { TrendingUp, Target, Users, Zap } from 'lucide-react'

const EngagementCard = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600'
    if (score >= 60) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'High Viral Potential'
    if (score >= 60) return 'Moderate Potential'
    return 'Low Viral Potential'
  }

  const metrics = [
    { label: 'Shareability', value: Math.floor(score * 0.9), icon: TrendingUp },
    { label: 'Relatability', value: Math.floor(score * 1.1), icon: Users },
    { label: 'Timing', value: Math.floor(score * 0.95), icon: Target },
    { label: 'Humor Score', value: Math.floor(score * 1.05), icon: Zap }
  ]

  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Engagement Prediction</h3>
      
      {/* Main Score */}
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray={`${score}, 100`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{score}</div>
              <div className="text-white/60 text-xs">out of 100</div>
            </div>
          </div>
        </div>
        <div className={`text-lg font-semibold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
          {getScoreLabel(score)}
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const value = Math.min(metric.value, 100)
          
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-white/60" />
                <span className="text-white text-sm font-medium">{metric.label}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-20 bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-full bg-gradient-to-r ${getScoreColor(value)} rounded-full transition-all duration-1000`}
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm font-medium w-8 text-right">{value}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h4 className="text-white font-medium mb-2">AI Insights</h4>
        <p className="text-white/70 text-sm">
          {score >= 80 ? (
            "This meme has excellent viral potential! The humor style and timing align well with current trends."
          ) : score >= 60 ? (
            "Good meme with decent shareability. Consider adjusting the humor style for better engagement."
          ) : (
            "This meme might need some tweaks. Try a different humor style or trending topic for better results."
          )}
        </p>
      </div>
    </div>
  )
}

export default EngagementCard