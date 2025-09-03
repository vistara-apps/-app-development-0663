import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend service
});

/**
 * Generate a meme caption based on a prompt and humor style
 * @param {string} prompt - The prompt to generate a caption for
 * @param {string} humorStyle - The humor style to use (witty, absurd, dry, edgy)
 * @returns {Promise<string>} - The generated caption
 */
export const generateMemeCaption = async (prompt, humorStyle) => {
  try {
    const styleDescriptions = {
      witty: "clever and sharp humor with wordplay and intelligent references",
      absurd: "random, surreal, and nonsensical comedy that defies logic",
      dry: "deadpan, subtle, and understated humor delivered with a straight face",
      edgy: "bold, provocative, and boundary-pushing humor that challenges norms"
    };

    const styleDescription = styleDescriptions[humorStyle] || styleDescriptions.witty;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a meme caption generator specializing in ${styleDescription}. 
          Create a short, punchy meme caption (maximum 2 lines) that would work well with an image.
          The caption should be in the style of popular internet memes and match the requested humor style.`
        },
        {
          role: "user",
          content: `Generate a ${humorStyle} meme caption for: ${prompt}`
        }
      ],
      max_tokens: 60,
      temperature: 0.8,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating meme caption:", error);
    throw new Error("Failed to generate meme caption. Please try again.");
  }
};

/**
 * Generate a description for an image
 * @param {string} imageUrl - The URL of the image to describe
 * @returns {Promise<string>} - The generated description
 */
export const generateImageDescription = async (imageUrl) => {
  try {
    // In a real implementation, this would use OpenAI's vision capabilities
    // For now, we'll return a placeholder
    return "An image that appears to show [image description]";
  } catch (error) {
    console.error("Error generating image description:", error);
    throw new Error("Failed to generate image description. Please try again.");
  }
};

/**
 * Predict the engagement potential of a meme
 * @param {string} caption - The meme caption
 * @param {string} prompt - The original prompt
 * @param {string} humorStyle - The humor style used
 * @param {Array} trendingTopics - Array of trending topics
 * @returns {Promise<Object>} - Engagement prediction data
 */
export const predictEngagement = async (caption, prompt, humorStyle, trendingTopics = []) => {
  try {
    // In a real implementation, this would use OpenAI to analyze the meme
    // For now, we'll use a simple algorithm
    
    // Base score between 60-90
    const baseScore = Math.floor(Math.random() * 30) + 60;
    
    // Check if the meme references trending topics
    const trendBonus = trendingTopics.some(topic => 
      prompt.toLowerCase().includes(topic.toLowerCase()) || 
      caption.toLowerCase().includes(topic.toLowerCase())
    ) ? 15 : 0;
    
    // Humor style bonus (witty and absurd tend to perform better)
    const styleBonus = humorStyle === 'witty' || humorStyle === 'absurd' ? 5 : 0;
    
    // Calculate final score (capped at 99)
    const finalScore = Math.min(baseScore + trendBonus + styleBonus, 99);
    
    // Generate metrics
    const metrics = {
      shareability: Math.floor(Math.random() * 20) + finalScore - 10,
      relatability: Math.floor(Math.random() * 20) + finalScore - 10,
      timing: Math.floor(Math.random() * 20) + finalScore - 10,
      humorScore: Math.floor(Math.random() * 20) + finalScore - 10
    };
    
    // Generate insights
    let insights = "";
    if (finalScore >= 80) {
      insights = "This meme has excellent viral potential! The humor style and timing align well with current trends.";
    } else if (finalScore >= 60) {
      insights = "Good meme with decent shareability. Consider adjusting the humor style for better engagement.";
    } else {
      insights = "This meme might need some tweaks. Try a different humor style or trending topic for better results.";
    }
    
    return {
      score: finalScore,
      metrics,
      insights
    };
  } catch (error) {
    console.error("Error predicting engagement:", error);
    throw new Error("Failed to predict engagement. Please try again.");
  }
};

/**
 * Get trending topics for memes
 * @returns {Promise<Array>} - Array of trending topics
 */
export const getTrendingTopics = async () => {
  try {
    // In a real implementation, this would fetch trending topics from an API
    // For now, we'll return mock data
    return [
      "AI",
      "crypto",
      "programming",
      "remote work",
      "social media",
      "metaverse",
      "NFTs",
      "climate change",
      "space exploration",
      "virtual reality"
    ];
  } catch (error) {
    console.error("Error getting trending topics:", error);
    throw new Error("Failed to get trending topics. Please try again.");
  }
};

export default {
  generateMemeCaption,
  generateImageDescription,
  predictEngagement,
  getTrendingTopics
};

