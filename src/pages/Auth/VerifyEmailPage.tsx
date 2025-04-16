import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const VerifyEmailPage: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { token } = useParams<{ token: string }>();
  const { verifyEmail, clearError } = useAuth();
  
  useEffect(() => {
    const verify = async () => {
      try {
        if (token) {
          await verifyEmail(token);
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
          setErrorMessage('Verification token is missing.');
        }
      } catch (err: any) {
        setVerificationStatus('error');
        setErrorMessage(err?.response?.data?.message || 'Email verification failed.');
      }
    };
    
    verify();
    
    return () => {
      clearError();
    };
  }, [token, verifyEmail, clearError]);
  
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
      <div className="bg-white p-8 shadow-md rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-8">Email Verification</h2>
        
        {verificationStatus === 'verifying' && (
          <div className="mb-6">
            <p className="text-gray-600">Verifying your email address...</p>
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
            </div>
          </div>
        )}
        
        {verificationStatus === 'success' && (
          <div className="mb-6">
            <div className="mb-4 w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-lg">Email Verified Successfully!</p>
            <p className="text-gray-600 mt-2">Your email has been verified. You can now log in to your account.</p>
          </div>
        )}
        
        {verificationStatus === 'error' && (
          <div className="mb-6">
            <div className="mb-4 w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <p className="text-gray-700 font-medium text-lg">Verification Failed</p>
            <p className="text-gray-600 mt-2">{errorMessage}</p>
          </div>
        )}
        
        <div className="mt-6">
          <Link 
            to="/login" 
            className="inline-block bg-black text-white py-2 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;