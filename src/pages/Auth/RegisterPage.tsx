import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Changed to match your types
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
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
    
    // Validate form
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    
    if (!termsAccepted) {
      setFormError('You must accept the Terms and Privacy Policy');
      return;
    }
    
    try {
      await register(firstName, lastName, email, password);
      // Show success message and redirect to login
      navigate('/verification-sent', { state: { email } });
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
        <h2 className="text-3xl font-bold text-center mb-8">Create your account</h2>
        
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div className="w-1/2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
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
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
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
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="founder">Founder</option>
              <option value="investor">Investor</option>
            </select>
          </div>
          
          <div className="mb-6">
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 mt-1 text-black border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                I agree to the{' '}
                <Link to="/terms" className="text-black hover:text-gray-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-black hover:text-gray-800">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-black hover:text-gray-800">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;