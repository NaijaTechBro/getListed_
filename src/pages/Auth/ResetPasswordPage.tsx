import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { resetToken } = useParams<{ resetToken: string }>();
  const { resetPassword, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear auth errors when component unmounts
    return () => {
      clearError();
    };
  }, [isAuthenticated, navigate, clearError]);

  // Set form error if auth error exists
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate password
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    
    // Check passwords match
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      if (resetToken) {
        await resetPassword(resetToken, password);
        // On success, user will be redirected to dashboard by the useEffect
      }
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="11" fill="black" />
                              <circle cx="12" cy="12" r="8" fill="white" />
                              <circle cx="12" cy="12" r="4" fill="black" />
                            </svg>
                            <Link to="/"><span className="ml-2 font-bold text-xl">GetListed</span></Link>
                          </div>
      <div className="bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Set New Password</h2>
        
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-black hover:text-gray-800">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;