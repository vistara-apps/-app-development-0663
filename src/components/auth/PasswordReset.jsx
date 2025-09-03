import React, { useState } from 'react';
import { resetPassword } from '../../services/supabase';
import { Zap, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

const PasswordReset = ({ onToggleView }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await resetPassword(email);
      setSuccessMessage('Password reset instructions have been sent to your email');
    } catch (err) {
      setError(err.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="glass-card rounded-lg p-8 max-w-md mx-auto">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
          <Zap className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white text-center mb-2">
        Reset your password
      </h2>
      <p className="text-white/60 text-center mb-6">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      
      {error && (
        <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-white/90 text-sm">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
          <p className="text-white/90 text-sm">{successMessage}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-white/40" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              <span>Sending instructions...</span>
            </>
          ) : (
            <span>Send Reset Instructions</span>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => onToggleView('login')}
          className="text-white/60 hover:text-white text-sm flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to login
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;

