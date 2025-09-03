import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getSession, 
  signIn, 
  signUp, 
  signOut, 
  getUserSubscription 
} from '../services/supabase';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get current session
        const currentSession = await getSession();
        setSession(currentSession);
        
        if (currentSession) {
          // Get user data
          const userData = await getCurrentUser();
          setUser(userData);
          
          // Get subscription data
          try {
            const subscriptionData = await getUserSubscription(userData.id);
            setSubscription(subscriptionData);
          } catch (err) {
            console.error('Error fetching subscription:', err);
            // Don't set error here, as the user might not have a subscription yet
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Handle user login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: userData, session: sessionData } = await signIn(email, password);
      
      setUser(userData);
      setSession(sessionData);
      
      // Get subscription data
      try {
        const subscriptionData = await getUserSubscription(userData.id);
        setSubscription(subscriptionData);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        // Don't set error here, as the user might not have a subscription yet
      }
      
      return { user: userData, session: sessionData };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle user registration
  const register = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: userData, session: sessionData } = await signUp(email, password);
      
      // If email confirmation is required, user will be null
      if (userData) {
        setUser(userData);
        setSession(sessionData);
      }
      
      return { user: userData, session: sessionData };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await signOut();
      
      setUser(null);
      setSession(null);
      setSubscription(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update subscription data
  const updateSubscription = (newSubscription) => {
    setSubscription(newSubscription);
  };

  // Check if user has a specific subscription tier
  const hasSubscription = (tier) => {
    if (!subscription) return false;
    return subscription.tier === tier;
  };

  // Get remaining generations based on subscription tier
  const getRemainingGenerations = () => {
    if (!subscription) return 3; // Free tier default
    
    switch (subscription.tier) {
      case 'pro':
        return 50;
      case 'viral':
        return Infinity; // Unlimited
      default:
        return 3; // Free tier
    }
  };

  // Context value
  const value = {
    user,
    session,
    subscription,
    loading,
    error,
    login,
    register,
    logout,
    updateSubscription,
    hasSubscription,
    getRemainingGenerations,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

