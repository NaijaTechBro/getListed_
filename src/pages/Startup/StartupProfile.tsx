import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStartup } from '../../context/StartupContext';
import { formatDate } from '../../utils/helpers';
import { motion } from 'framer-motion';

const StartupProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    startup, 
    loading, 
    error, 
    getStartup, 
    clearStartup,
    deleteStartup,
    clearStartupError
  } = useStartup();
  
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Function to fetch startup with retry logic
  const fetchStartupWithRetry = useCallback(async () => {
    if (!id) return;
    
    setIsRetrying(true);
    setLocalError(null);
    
    try {
      await getStartup(id);
      setIsRetrying(false);
    } catch (err: any) {
      console.error('Error fetching startup details:', err);
      setIsRetrying(false);
      
      // Set a user-friendly error message
      if (err.message === 'Network Error') {
        setLocalError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setLocalError(err.response?.data?.message || 'Failed to load startup details.');
      }
    }
  }, [id, getStartup]);

  // Initial fetch on component mount
  useEffect(() => {
    if (id) {
      fetchStartupWithRetry();
    }
    
    // Clean up by clearing startup data when component unmounts
    return () => {
      clearStartup();
      clearStartupError();
    };
  }, [id, fetchStartupWithRetry, clearStartup, clearStartupError]);

  // Retry mechanism when the button is clicked
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchStartupWithRetry();
  };

  // Check if the current user is the owner of this startup
  const isOwner = user && startup && user._id === startup.createdBy;

  // Handle delete action
  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    try {
      await deleteStartup(id);
      setShowDeleteModal(false);
      navigate('/directory', { state: { message: 'Startup deleted successfully' } });
    } catch (err: any) {
      console.error('Error deleting startup:', err);
      if (err.message === 'Network Error') {
        setLocalError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setLocalError(err.response?.data?.message || 'Failed to delete startup.');
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12
      }
    }
  };

  // Loading state
  if (loading || isRetrying) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
        <p className="text-gray-600 text-lg animate-pulse">
          {isRetrying ? 'Retrying connection...' : 'Loading startup details...'}
        </p>
      </div>
    );
  }

  // Error state
  if (error || localError || !startup) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="bg-red-50 p-8 rounded-xl text-center shadow-lg">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-red-800 mb-3">Oops!</h2>
          <p className="text-red-700 mb-6 text-lg">{localError || error || 'Startup not found'}</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-5 mt-6">
            <motion.button 
              onClick={handleRetry}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              Retry Loading
            </motion.button>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/directory" 
                className="bg-white text-indigo-600 border-2 border-indigo-600 py-3 px-6 rounded-xl hover:bg-indigo-50 transition-colors inline-block shadow-md"
              >
                Back to Directory
              </Link>
            </motion.div>
          </div>
          
          {retryCount > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 mt-8"
            >
              If the problem persists, the server might be down or experiencing issues. Please try again later.
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  }

  // Format funding amount for display
  const formatFunding = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  // Sort funding rounds by date (newest first)
  const sortedFundingRounds = startup.fundingRounds 
    ? [...startup.fundingRounds].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ) 
    : [];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen py-8 md:py-12"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <motion.div 
                className="flex flex-col sm:flex-row sm:items-center mb-6 md:mb-0"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl overflow-hidden flex-shrink-0 mr-5 p-2 shadow-md border border-gray-100 mb-4 sm:mb-0">
                  <img 
                    src={startup.logo || '/assets/images/placeholder-logo.svg'} 
                    alt={startup.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/placeholder-logo.svg';
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">{startup.name}</h1>
                  <div className="flex flex-wrap items-center text-gray-500 mt-2">
                    <span>{startup.city ? `${startup.city}, ` : ''}{startup.country}</span>
                    {startup.foundingDate && (
                      <>
                        <span className="mx-2 hidden sm:inline">•</span>
                        <span>Founded {new Date(startup.foundingDate).getFullYear()}</span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {isOwner && (
                <div className="flex space-x-3">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to={`/startup/edit/${startup._id}`} 
                      className="bg-white text-indigo-600 border-2 border-indigo-600 px-5 py-2 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm font-medium"
                    >
                      Edit Profile
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-white text-red-600 border-2 border-red-600 px-5 py-2 rounded-xl hover:bg-red-50 transition-colors shadow-sm font-medium"
                  >
                    Delete
                  </motion.button>
                </div>
              )}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {startup.category && (
                <span className="bg-indigo-100 text-indigo-800 px-4 py-1.5 rounded-full text-sm font-medium border border-indigo-200">
                  {startup.category}
                </span>
              )}
              {startup.subCategory && (
                <span className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200">
                  {startup.subCategory}
                </span>
              )}
              {startup.stage && (
                <span className="bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-medium border border-purple-200">
                  {startup.stage}
                </span>
              )}
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-700 mb-8 italic"
            >
              {startup.tagline}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6"
            >
              {startup.website && (
                <motion.a 
                  whileHover={{ scale: 1.05, color: "#4338CA" }}
                  href={startup.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 hover:text-indigo-800 group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  Website
                </motion.a>
              )}
              
              {startup.socialProfiles && Object.entries(startup.socialProfiles).map(([platform, url]) => {
                if (!url) return null;
                
                return (
                  <motion.a 
                    key={platform}
                    whileHover={{ scale: 1.05, color: "#4338CA" }}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-800 group"
                  >
                    <svg className="w-4 h-4 mr-1 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </motion.a>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main content */}
          <motion.div 
            variants={containerVariants}
            className="lg:col-span-2 space-y-6 lg:space-y-8"
          >
            {/* About */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </h2>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{startup.description}</p>
              </div>
            </motion.div>
            
            {/* Team */}
            {startup.founders && startup.founders.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Team
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {startup.founders.map((founder, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                      whileHover={{ scale: 1.02, backgroundColor: "#EEF2FF" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                        {founder.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{founder.name}</h3>
                        {founder.role && (
                          <p className="text-indigo-600 font-medium">{founder.role}</p>
                        )}
                        {founder.bio && (
                          <p className="text-gray-600 text-sm mt-2 leading-relaxed">{founder.bio}</p>
                        )}
                        {founder.linkedin && (
                          <motion.a 
                            whileHover={{ scale: 1.05, color: "#4338CA" }}
                            href={founder.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-2 group"
                          >
                            <svg className="w-4 h-4 mr-1 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                            LinkedIn
                          </motion.a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Funding Rounds */}
            {sortedFundingRounds.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Funding History
                </h2>
                <div className="space-y-6">
                  {sortedFundingRounds.map((round, index) => (
                    <motion.div 
                      key={index} 
                      className="border-l-4 border-indigo-500 pl-5 py-2 hover:bg-indigo-50 hover:rounded-r-xl transition-colors duration-300"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex justify-between items-start flex-wrap">
                        <h3 className="text-lg font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full mb-2">{round.stage} Round</h3>
                        <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">{formatDate(round.date)}</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 my-2">
                        ${(round.amount / 1000000).toFixed(2)}M
                        {round.valuation && (
                          <span className="text-sm font-normal text-gray-500 ml-2">
                            at ${(round.valuation / 1000000).toFixed(1)}M valuation
                          </span>
                        )}
                      </p>
                      {round.investors && round.investors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-600">Investors:</p>
                          <p className="text-gray-700">{round.investors.join(', ')}</p>
                        </div>
                      )}
                      {round.notes && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">{round.notes}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Products Section - Only show if available */}
            {startup.products && (
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Products & Services
                </h2>
                <div className="prose prose-indigo max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{startup.products}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Sidebar */}
          <motion.div variants={containerVariants} className="space-y-6">
            {/* Metrics */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Metrics
              </h2>
              <div className="space-y-5">
                <motion.div 
                  className="bg-gray-50 p-3 rounded-xl"
                  whileHover={{ scale: 1.03, backgroundColor: "#EEF2FF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm font-medium text-gray-500 mb-1">Funding Total</p>
                  <p className="text-xl font-semibold text-indigo-700">
                    {startup.metrics?.fundingTotal > 0 
                      ? formatFunding(startup.metrics.fundingTotal)
                      : 'Not disclosed'}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 p-3 rounded-xl"
                  whileHover={{ scale: 1.03, backgroundColor: "#EEF2FF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm font-medium text-gray-500 mb-1">Employees</p>
                  <p className="text-xl font-semibold text-indigo-700">{startup.metrics?.employees || 'Not disclosed'}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 p-3 rounded-xl"
                  whileHover={{ scale: 1.03, backgroundColor: "#EEF2FF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm font-medium text-gray-500 mb-1">Revenue Range</p>

                  <p className="text-xl font-semibold text-indigo-700">{startup.metrics?.revenue ? `$${startup.metrics.revenue}` : 'Not disclosed'}</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-50 p-3 rounded-xl"
                  whileHover={{ scale: 1.03, backgroundColor: "#EEF2FF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm font-medium text-gray-500 mb-1">Connections</p>
                  <p className="text-xl font-semibold text-indigo-700">{startup.metrics?.connections || 0}</p>
                </motion.div>

                <motion.div 
                  className="bg-gray-50 p-3 rounded-xl"
                  whileHover={{ scale: 1.03, backgroundColor: "#EEF2FF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm font-medium text-gray-500 mb-1">Profile Views</p>
                  <p className="text-xl font-semibold text-indigo-700">{startup.metrics?.views || 0}</p>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Contact */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-lg p-6 border border-indigo-500 text-white hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </h2>
              <p className="text-indigo-100 mb-5">
                Interested in connecting with {startup.name}?
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-indigo-700 py-3 px-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-md font-medium"
              >
                Request Introduction
              </motion.button>
            </motion.div>
            
            {/* Similar Startups */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Similar Startups
              </h2>
              <div className="bg-gray-50 rounded-xl p-4 text-center animate-pulse">
                <p className="text-gray-500 text-sm">Coming soon...</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
          >
            <div className="flex justify-center mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6 text-center">
              Are you sure you want to delete <span className="font-semibold">{startup.name}</span>? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium order-2 sm:order-1"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeleteConfirm}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium order-1 sm:order-2"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StartupProfile;