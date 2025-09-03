import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MemeProvider } from './context/MemeContext';

// Components
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MemeGenerator from './components/MemeGenerator';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PasswordReset from './components/auth/PasswordReset';
import PlanSelector from './components/subscription/PlanSelector';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Auth layout component
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
};

// App layout component
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

// Auth container component
const AuthContainer = () => {
  const [authView, setAuthView] = useState('login');
  
  const handleToggleView = (view) => {
    setAuthView(view);
  };
  
  return (
    <AuthLayout>
      {authView === 'login' && <Login onToggleView={handleToggleView} />}
      {authView === 'signup' && <Signup onToggleView={handleToggleView} />}
      {authView === 'reset-password' && <PasswordReset onToggleView={handleToggleView} />}
    </AuthLayout>
  );
};

// Main app component
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <AuthContainer />
        } />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/generator" element={
          <ProtectedRoute>
            <AppLayout>
              <MemeGenerator />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/subscription" element={
          <ProtectedRoute>
            <AppLayout>
              <PlanSelector />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E1E2E',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
};

// App wrapper with providers
const App = () => {
  return (
    <AuthProvider>
      <MemeProvider>
        <AppContent />
      </MemeProvider>
    </AuthProvider>
  );
};

export default App;

