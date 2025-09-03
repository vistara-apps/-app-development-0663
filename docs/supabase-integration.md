# Supabase Integration Documentation

This document provides detailed information about the Supabase integration in the MemeMaster AI application.

## Overview

MemeMaster AI uses Supabase as its backend-as-a-service (BaaS) solution, providing authentication, database, and storage capabilities. This integration enables user management, data persistence, and secure access control.

## Integration Components

1. **Authentication**: User signup, login, password reset, and session management.
2. **Database**: Storage and retrieval of user profiles, generated memes, and subscription information.
3. **Storage**: Storage of meme images and related assets.
4. **Row-Level Security (RLS)**: Secure access control to ensure users can only access their own data.

## Database Schema

The application uses the following database tables:

### Profiles Table

Stores user profile information.

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);
```

### Memes Table

Stores information about generated memes.

```sql
CREATE TABLE IF NOT EXISTS memes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  caption TEXT NOT NULL,
  prompt TEXT,
  image_url TEXT NOT NULL,
  ipfs_cid TEXT,
  ipfs_metadata_cid TEXT,
  humor_style TEXT,
  engagement_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Subscriptions Table

Stores user subscription information.

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  tier TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Usage Limits Table

Tracks user usage limits based on their subscription tier.

```sql
CREATE TABLE IF NOT EXISTS usage_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  daily_generations INTEGER DEFAULT 3,
  daily_generations_used INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row-Level Security (RLS) Policies

Supabase RLS policies ensure that users can only access their own data:

### Profiles Policies

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Memes Policies

```sql
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memes"
  ON memes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memes"
  ON memes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memes"
  ON memes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memes"
  ON memes FOR DELETE
  USING (auth.uid() = user_id);
```

### Subscriptions Policies

```sql
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

### Usage Limits Policies

```sql
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage limits"
  ON usage_limits FOR SELECT
  USING (auth.uid() = user_id);
```

## Implementation Details

### Authentication

The `src/services/supabase.js` file provides functions for authentication:

```javascript
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
```

### Database Operations

The `src/services/supabase.js` file also provides functions for database operations:

```javascript
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
```

## Authentication Context

The `src/context/AuthContext.jsx` file provides a React context for managing authentication state:

```javascript
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
    // Implementation details...
  };

  // Handle user registration
  const register = async (email, password) => {
    // Implementation details...
  };

  // Handle user logout
  const logout = async () => {
    // Implementation details...
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
```

## Security Considerations

1. **API Key Management**: Supabase API keys are stored in environment variables and never exposed to the client.
2. **Row-Level Security**: RLS policies ensure users can only access their own data.
3. **JWT Validation**: Supabase handles JWT validation for authenticated requests.
4. **Password Security**: Passwords are securely hashed and stored by Supabase Auth.

## Production Considerations

For a production deployment, consider the following enhancements:

1. **Environment Configuration**: Use different Supabase projects for development, staging, and production.
2. **Migrations**: Use Supabase migrations to manage database schema changes.
3. **Backups**: Configure regular database backups.
4. **Monitoring**: Set up monitoring and alerting for database performance and errors.
5. **Rate Limiting**: Implement rate limiting for API endpoints to prevent abuse.

## Troubleshooting

Common issues and their solutions:

1. **Authentication Errors**: Check that the Supabase URL and API key are correctly configured.
2. **RLS Policy Issues**: Verify that RLS policies are correctly defined and enabled.
3. **Database Connection Issues**: Check network connectivity and Supabase service status.
4. **Query Performance**: Use indexes for frequently queried columns.
5. **Data Synchronization**: Implement optimistic UI updates with proper error handling.

