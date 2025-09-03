import React, { useState } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import MemeGenerator from './components/MemeGenerator'
import { MemeProvider } from './context/MemeContext'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')

  return (
    <MemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="container mx-auto px-4 py-6">
          {currentView === 'dashboard' ? (
            <Dashboard setCurrentView={setCurrentView} />
          ) : (
            <MemeGenerator />
          )}
        </main>
      </div>
    </MemeProvider>
  )
}

export default App