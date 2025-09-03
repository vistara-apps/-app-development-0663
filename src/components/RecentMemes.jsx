import React from 'react'
import { useMeme } from '../context/MemeContext'
import { Clock, Heart, Share2 } from 'lucide-react'

const RecentMemes = () => {
  const { generatedMeme } = useMeme()

  // Mock recent memes for demo
  const mockMemes = [
    {
      id: 1,
      caption: "When AI writes better code than you",
      image: "https://via.placeholder.com/200x150/667eea/ffffff?text=Meme+1",
      engagement: 89,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      caption: "Debugging at 3 AM be like",
      image: "https://via.placeholder.com/200x150/764ba2/ffffff?text=Meme+2",
      engagement: 76,
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      caption: "Frontend vs Backend developers",
      image: "https://via.placeholder.com/200x150/f093fb/ffffff?text=Meme+3",
      engagement: 92,
      timestamp: "1 day ago"
    }
  ]

  const memes = generatedMeme ? [generatedMeme, ...mockMemes] : mockMemes

  return (
    <div className="glass-card rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Recent Memes</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {memes.slice(0, 5).map((meme, index) => (
          <div key={meme.id || index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <div className="flex space-x-3">
              <img 
                src={meme.image} 
                alt="Meme thumbnail"
                className="w-16 h-16 rounded-lg object-cover bg-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm line-clamp-2 mb-2">
                  {meme.caption}
                </p>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{meme.timestamp || 'Just now'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{meme.engagement || '0'}%</span>
                    </div>
                    <Share2 className="h-3 w-3 cursor-pointer hover:text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentMemes