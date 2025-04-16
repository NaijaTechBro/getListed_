import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';

const VerificationSentPage: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;
  
  // If no email in state, redirect to register page
  if (!email) {
    return <Navigate to="/register" replace />;
  }
  
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
        <h2 className="text-3xl font-bold mb-6">Verify Your Email</h2>
        
        <div className="mb-8 w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        
        <p className="text-gray-700 text-lg font-medium mb-2">Check your inbox</p>
        <p className="text-gray-600 mb-6">
          We've sent a verification email to <span className="font-medium">{email}</span>. 
          Please click the link in the email to verify your account.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 mb-8">
          <p>Didn't receive the email?</p>
          <ul className="mt-2 text-left list-disc pl-5">
            <li>Check your spam folder</li>
            <li>Make sure the email address is correct</li>
            <li>Wait a few minutes and check again</li>
          </ul>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link 
            to="/login" 
            className="inline-block bg-black text-white py-2 px-6 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Go to Login
          </Link>
          
          <Link 
            to="/register" 
            className="text-black hover:text-gray-800"
          >
            Return to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationSentPage;