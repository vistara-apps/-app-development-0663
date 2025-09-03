import React from 'react'
import { useMeme } from '../context/MemeContext'
import StatsCards from './StatsCards'
import TrendFeed from './TrendFeed'
import RecentMemes from './RecentMemes'
import QuickActions from './QuickActions'

const Dashboard = ({ setCurrentView }) => {
  const { generationCount, trendingTopics } = useMeme()

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-card rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to MemeMaster AI
            </h2>
            <p className="text-white/80 text-lg">
              Craft viral memes with AI, powered by your unique humor.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('generator')}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Create Meme
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trends and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <TrendFeed trends={trendingTopics} />
          <QuickActions setCurrentView={setCurrentView} />
        </div>

        {/* Right Column - Recent Memes */}
        <div className="lg:col-span-1">
          <RecentMemes />
        </div>
      </div>
    </div>
  )
}

export default Dashboard