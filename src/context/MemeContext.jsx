import React, { createContext, useContext, useState } from 'react'

const MemeContext = createContext()

export const useMeme = () => {
  const context = useContext(MemeContext)
  if (!context) {
    throw new Error('useMeme must be used within a MemeProvider')
  }
  return context
}

export const MemeProvider = ({ children }) => {
  const [generatedMeme, setGeneratedMeme] = useState(null)
  const [humorStyle, setHumorStyle] = useState('witty')
  const [engagementScore, setEngagementScore] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationCount, setGenerationCount] = useState(3) // Free tier limit

  // Mock trending topics
  const [trendingTopics] = useState([
    { topic: 'AI Revolution', score: 95, trend: 'up' },
    { topic: 'Space Exploration', score: 87, trend: 'up' },
    { topic: 'Climate Tech', score: 78, trend: 'stable' },
    { topic: 'Gaming Culture', score: 92, trend: 'up' },
    { topic: 'Remote Work', score: 65, trend: 'down' }
  ])

  const generateMeme = async (input, type = 'text') => {
    if (generationCount <= 0) {
      alert('Generation limit reached! Upgrade to Pro for more.')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock meme generation based on humor style
      const mockCaptions = {
        witty: [
          "When you realize AI is better at making memes than you",
          "That moment when the code works on the first try",
          "Me explaining why I need 47 browser tabs open"
        ],
        absurd: [
          "Potato contemplating the meaning of french fries",
          "When your coffee machine judges your life choices",
          "Local man discovers gravity, falls down immediately"
        ],
        dry: [
          "Another day, another existential crisis",
          "Productivity: 0%. Procrastination: Legendary.",
          "Success is 1% inspiration, 99% caffeine"
        ],
        edgy: [
          "Breaking: Local person has controversial opinion",
          "Plot twist: Nobody asked",
          "Certified chaos merchant at your service"
        ]
      }

      const captions = mockCaptions[humorStyle] || mockCaptions.witty
      const randomCaption = captions[Math.floor(Math.random() * captions.length)]
      
      // Calculate engagement score based on humor style and trending topics
      const baseScore = Math.floor(Math.random() * 40) + 60
      const trendBonus = trendingTopics.some(topic => 
        input.toLowerCase().includes(topic.topic.toLowerCase())
      ) ? 15 : 0
      
      const finalScore = Math.min(baseScore + trendBonus, 99)
      
      setGeneratedMeme({
        id: Date.now(),
        caption: randomCaption,
        image: type === 'upload' ? input : 'https://via.placeholder.com/400x300/667eea/ffffff?text=Generated+Meme',
        prompt: type === 'text' ? input : 'Uploaded image',
        humorStyle,
        timestamp: new Date().toISOString()
      })
      
      setEngagementScore(finalScore)
      setGenerationCount(prev => prev - 1)
      
    } catch (error) {
      console.error('Meme generation failed:', error)
      alert('Failed to generate meme. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const value = {
    generatedMeme,
    setGeneratedMeme,
    humorStyle,
    setHumorStyle,
    engagementScore,
    setEngagementScore,
    isGenerating,
    generateMeme,
    generationCount,
    trendingTopics
  }

  return (
    <MemeContext.Provider value={value}>
      {children}
    </MemeContext.Provider>
  )
}