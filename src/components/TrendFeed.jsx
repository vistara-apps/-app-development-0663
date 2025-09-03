import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const TrendFeed = ({ trends }) => {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <Minus className="h-4 w-4 text-yellow-400" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-400'
      case 'down':
        return 'text-red-400'
      default:
        return 'text-yellow-400'
    }
  }

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Trending Topics</h3>
        <div className="text-sm text-white/60">Updated 5 min ago</div>
      </div>
      
      <div className="space-y-4">
        {trends.map((trend, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {getTrendIcon(trend.trend)}
                <span className={`text-sm font-medium ${getTrendColor(trend.trend)}`}>
                  {trend.score}
                </span>
              </div>
              <span className="text-white font-medium">{trend.topic}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-white/10 rounded-full h-2">
                <div 
                  className={`h-full bg-gradient-to-r ${
                    trend.trend === 'up' ? 'from-green-400 to-green-500' :
                    trend.trend === 'down' ? 'from-red-400 to-red-500' :
                    'from-yellow-400 to-yellow-500'
                  } rounded-full transition-all duration-300`}
                  style={{ width: `${trend.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendFeed