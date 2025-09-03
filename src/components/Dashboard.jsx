import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMeme } from '../context/MemeContext';
import { useAuth } from '../context/AuthContext';
import { Zap, Plus, Trash2, Share2, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { shareMeme } from '../utils/shareUtils';
import { dataURLtoBlob } from '../utils/imageUtils';

const Dashboard = () => {
  const { userMemes, deleteMeme, trendingTopics } = useMeme();
  const { user, subscription } = useAuth();
  const [shareStatus, setShareStatus] = useState({});
  
  const handleShare = async (meme) => {
    try {
      setShareStatus(prev => ({ ...prev, [meme.id]: 'sharing' }));
      
      const success = await shareMeme(meme);
      
      if (success) {
        setShareStatus(prev => ({ ...prev, [meme.id]: 'success' }));
      } else {
        setShareStatus(prev => ({ ...prev, [meme.id]: 'error' }));
      }
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setShareStatus(prev => ({ ...prev, [meme.id]: null }));
      }, 2000);
    } catch (error) {
      console.error('Error sharing meme:', error);
      setShareStatus(prev => ({ ...prev, [meme.id]: 'error' }));
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setShareStatus(prev => ({ ...prev, [meme.id]: null }));
      }, 2000);
    }
  };
  
  const handleDownload = async (meme) => {
    try {
      // Convert data URL to blob
      const blob = await fetch(meme.imageUrl).then(r => r.blob());
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `meme-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading meme:', error);
    }
  };
  
  const handleDelete = async (memeId) => {
    if (window.confirm('Are you sure you want to delete this meme?')) {
      try {
        await deleteMeme(memeId);
      } catch (error) {
        console.error('Error deleting meme:', error);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-white/80">Welcome back, {user?.email?.split('@')[0] || 'User'}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Stats */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Your Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Subscription</span>
                <span className="text-white font-medium">
                  {subscription?.tier ? `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}` : 'Free'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Memes Created</span>
                <span className="text-white font-medium">{userMemes?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70">Generations Left</span>
                <span className="text-white font-medium">
                  {subscription?.tier === 'viral' ? 'Unlimited' : '3'}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/generator"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Meme</span>
              </Link>
            </div>
          </div>
          
          {/* Trending Topics */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Trending Topics</h3>
            
            <div className="flex flex-wrap gap-2">
              {trendingTopics.slice(0, 8).map((topic, index) => (
                <div
                  key={index}
                  className="bg-white/10 text-white px-3 py-1 rounded-full text-sm"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Meme Gallery */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Your Memes</h3>
            
            {userMemes?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userMemes.map((meme) => (
                  <div key={meme.id} className="bg-white/5 rounded-lg overflow-hidden">
                    <div className="relative aspect-video bg-black/20">
                      <img
                        src={meme.imageUrl}
                        alt={meme.caption}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="p-4">
                      <p className="text-white font-medium mb-2">{meme.caption}</p>
                      
                      <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                        <span>{format(new Date(meme.createdAt), 'MMM d, yyyy')}</span>
                        <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                          {meme.humorStyle}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleShare(meme)}
                            className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                            disabled={shareStatus[meme.id] === 'sharing'}
                          >
                            {shareStatus[meme.id] === 'sharing' ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full" />
                            ) : shareStatus[meme.id] === 'success' ? (
                              <div className="text-green-400">✓</div>
                            ) : shareStatus[meme.id] === 'error' ? (
                              <div className="text-red-400">✗</div>
                            ) : (
                              <Share2 className="h-4 w-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDownload(meme)}
                            className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          
                          {meme.ipfsCid && (
                            <a
                              href={`https://gateway.pinata.cloud/ipfs/${meme.ipfsCid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleDelete(meme.id)}
                          className="text-red-400/70 hover:text-red-400 p-1.5 rounded-full hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/5 rounded-full p-3 inline-flex mb-4">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">No memes yet</h4>
                <p className="text-white/60 mb-6">
                  Create your first meme to see it here
                </p>
                <Link
                  to="/generator"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create New Meme</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

