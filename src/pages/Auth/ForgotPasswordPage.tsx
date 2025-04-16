import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { forgotPassword, loading, error, clearError } = useAuth();
  
  // Set form error if auth error exists
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
    
    // Clear auth errors when component unmounts
    return () => {
      clearError();
    };
  }, [error, clearError]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
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
        <h2 className="text-3xl font-bold text-center mb-8">Forgot Password</h2>
        
        {isSubmitted ? (
          <div>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
              <p className="font-medium">Check your email</p>
              <p className="mt-1">
                We've sent a password reset link to {email}. Please check your inbox.
              </p>
            </div>
            <div className="text-center">
              <Link 
                to="/login" 
                className="text-black hover:text-gray-800"
              >
                Return to login
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link to="/login" className="text-black hover:text-gray-800">
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;