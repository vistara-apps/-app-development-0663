import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// In production, you should use environment variables for these values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Authentication functions
 */

// Sign up a new user
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Sign in a user
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Sign out the current user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user;
};

// Get the current session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

// Reset password
export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
};

// Update user password
export const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
};

/**
 * Database functions
 */

// Save a generated meme to the database
export const saveMeme = async (memeData) => {
  const { data, error } = await supabase
    .from('memes')
    .insert([memeData])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Get all memes for the current user
export const getUserMemes = async (userId) => {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get a specific meme by ID
export const getMemeById = async (memeId) => {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .eq('id', memeId)
    .single();
  
  if (error) throw error;
  return data;
};

// Delete a meme
export const deleteMeme = async (memeId) => {
  const { error } = await supabase
    .from('memes')
    .delete()
    .eq('id', memeId);
  
  if (error) throw error;
};

// Get user subscription information
export const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('userId', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
  return data;
};

// Update user subscription
export const updateUserSubscription = async (userId, subscriptionData) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert([{ userId, ...subscriptionData }])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Get user profile
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert([{ id: userId, ...profileData }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export default {
  supabase,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  resetPassword,
  updatePassword,
  saveMeme,
  getUserMemes,
  getMemeById,
  deleteMeme,
  getUserSubscription,
  updateUserSubscription,
  getUserProfile,
  updateUserProfile
};

