import React from 'react'
import { Zap, User, Settings } from 'lucide-react'

const Header = ({ currentView, setCurrentView }) => {
  return (
    <header className="glass-card border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">MemeMaster AI</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('generator')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === 'generator'
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Create Meme
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white text-sm font-medium">Free Tier</span>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header