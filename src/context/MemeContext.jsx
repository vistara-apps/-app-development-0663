import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { generateMemeCaption, predictEngagement, getTrendingTopics } from '../services/openai';
import { createMemeImage } from '../utils/imageUtils';
import { uploadMemeToIPFS } from '../services/pinata';
import { saveMeme, getUserMemes } from '../services/supabase';

// Create the context
const MemeContext = createContext();

// Custom hook to use the meme context
export const useMeme = () => {
  const context = useContext(MemeContext);
  if (!context) {
    throw new Error('useMeme must be used within a MemeProvider');
  }
  return context;
};

// Meme provider component
export const MemeProvider = ({ children }) => {
  const { user, getRemainingGenerations } = useAuth();
  
  const [generatedMeme, setGeneratedMeme] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [humorStyle, setHumorStyle] = useState('witty');
  const [engagementScore, setEngagementScore] = useState(null);
  const [engagementMetrics, setEngagementMetrics] = useState(null);
  const [engagementInsights, setEngagementInsights] = useState(null);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [userMemes, setUserMemes] = useState([]);
  const [generationCount, setGenerationCount] = useState(3); // Default to free tier
  
  // Load trending topics
  useEffect(() => {
    const loadTrendingTopics = async () => {
      try {
        const topics = await getTrendingTopics();
        setTrendingTopics(topics);
      } catch (err) {
        console.error('Error loading trending topics:', err);
      }
    };
    
    loadTrendingTopics();
  }, []);
  
  // Load user memes
  useEffect(() => {
    const loadUserMemes = async () => {
      if (!user) return;
      
      try {
        const memes = await getUserMemes(user.id);
        setUserMemes(memes);
      } catch (err) {
        console.error('Error loading user memes:', err);
      }
    };
    
    loadUserMemes();
  }, [user]);
  
  // Update generation count based on subscription
  useEffect(() => {
    if (getRemainingGenerations) {
      setGenerationCount(getRemainingGenerations());
    }
  }, [getRemainingGenerations]);
  
  // Generate a meme
  const generateMeme = async (input, type) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Check if user has generations remaining
      if (generationCount <= 0) {
        throw new Error('You have reached your daily generation limit. Upgrade to generate more memes.');
      }
      
      let prompt, imageUrl;
      
      if (type === 'text') {
        prompt = input;
        // In a real implementation, we would generate an image based on the prompt
        // For now, we'll use a placeholder image
        imageUrl = 'https://via.placeholder.com/800x600/1a1a2e/ffffff?text=AI+Generated+Meme';
      } else if (type === 'upload') {
        // For uploaded images, we would use the image as is
        imageUrl = URL.createObjectURL(input);
        prompt = 'Uploaded image';
      } else {
        throw new Error('Invalid input type');
      }
      
      // Generate caption
      const caption = await generateMemeCaption(prompt, humorStyle);
      
      // Create meme image with caption
      const memeImageUrl = await createMemeImage(imageUrl, caption);
      
      // Predict engagement
      const engagement = await predictEngagement(caption, prompt, humorStyle, trendingTopics);
      
      // Set state
      setGeneratedMeme({
        caption,
        image: memeImageUrl,
        prompt,
        humorStyle,
        timestamp: new Date().toISOString()
      });
      setEngagementScore(engagement.score);
      setEngagementMetrics(engagement.metrics);
      setEngagementInsights(engagement.insights);
      
      // Decrement generation count
      setGenerationCount(prevCount => Math.max(0, prevCount - 1));
      
      return {
        caption,
        image: memeImageUrl,
        prompt,
        humorStyle,
        engagementScore: engagement.score,
        engagementMetrics: engagement.metrics,
        engagementInsights: engagement.insights
      };
    } catch (err) {
      console.error('Error generating meme:', err);
      setError(err.message || 'Failed to generate meme. Please try again.');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save a meme
  const saveMemeToDatabase = async (meme) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to save memes');
      }
      
      // Upload to IPFS
      const ipfsData = await uploadMemeToIPFS(meme);
      
      // Save to database
      const savedMeme = await saveMeme({
        userId: user.id,
        caption: meme.caption,
        prompt: meme.prompt,
        imageUrl: meme.image,
        ipfsCid: ipfsData.imageCID,
        ipfsMetadataCid: ipfsData.metadataCID,
        humorStyle: meme.humorStyle,
        engagementScore: meme.engagementScore
      });
      
      // Update user memes
      setUserMemes(prevMemes => [savedMeme, ...prevMemes]);
      
      return savedMeme;
    } catch (err) {
      console.error('Error saving meme:', err);
      setError(err.message || 'Failed to save meme. Please try again.');
      throw err;
    }
  };
  
  // Delete a meme
  const deleteMeme = async (memeId) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to delete memes');
      }
      
      // Delete from database
      await deleteMeme(memeId);
      
      // Update user memes
      setUserMemes(prevMemes => prevMemes.filter(meme => meme.id !== memeId));
    } catch (err) {
      console.error('Error deleting meme:', err);
      setError(err.message || 'Failed to delete meme. Please try again.');
      throw err;
    }
  };
  
  // Context value
  const value = {
    generatedMeme,
    isGenerating,
    error,
    humorStyle,
    setHumorStyle,
    engagementScore,
    engagementMetrics,
    engagementInsights,
    trendingTopics,
    userMemes,
    generationCount,
    generateMeme,
    saveMemeToDatabase,
    deleteMeme,
    setError
  };
  
  return (
    <MemeContext.Provider value={value}>
      {children}
    </MemeContext.Provider>
  );
};

export default MemeContext;

