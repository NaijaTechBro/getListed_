import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStartup } from '../../context/StartupContext';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { loading, getStartups, startups } = useStartup();
  const [stats, setStats] = useState({
    totalStartups: 0,
    pendingVerification: 0,
    views: 0,
    connections: 0
  });

  // Fetch user's startups when component mounts
  useEffect(() => {
    const fetchUserStartups = async () => {
      if (user?._id) {
        try {
          // Using the context's getStartups with a query param to filter by user
          await getStartups({createdBy: user._id});
        } catch (error) {
          console.error('Error fetching user startups:', error);
        }
      }
    };

    fetchUserStartups();
  }, [user, getStartups]);

  // Update stats based on user startups
  useEffect(() => {
    if (startups.length > 0) {
      setStats({
        totalStartups: startups.length,
        pendingVerification: startups.filter(s => !s.isVerified).length,
        views: startups.reduce((sum, startup) => sum + (startup.metrics?.views || 0), 0),
        connections: startups.reduce((sum, startup) => sum + (startup.metrics?.connections || 0), 0)
      });
    }
  }, [startups]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
        stiffness: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div className="h-8 w-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="p-2 md:p-4"
    >
      <motion.div 
        variants={itemVariants}
        className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
      >
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-indigo-100 mt-2">Welcome back, {user?.firstName || 'Founder'}!</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Startups</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">All</span>
          </div>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800">{stats.totalStartups}</div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Pending Verification</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full">Verification</span>
          </div>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800">{stats.pendingVerification}</div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Profile Views</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">30 Days</span>
          </div>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800">{formatNumber(stats.views)}</div>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Connections</h3>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full">Total</span>
          </div>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800">{formatNumber(stats.connections)}</div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-md p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b pb-2">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/add-startup"
            className="group"
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-xl bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow group-hover:border-solid"
            >
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 group-hover:bg-indigo-200 transition-colors duration-300">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="font-medium text-gray-900">Add Startup</p>
                <p className="text-sm text-gray-500 mt-1">List a new startup on GetListed</p>
              </div>
            </motion.div>
          </Link>

          <Link
            to="/dashboard/my-startups"
            className="group"
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-xl bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow group-hover:border-solid"
            >
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4 group-hover:bg-green-200 transition-colors duration-300">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="font-medium text-gray-900">Manage Startups</p>
                <p className="text-sm text-gray-500 mt-1">Update your startup listings</p>
              </div>
            </motion.div>
          </Link>

          <Link
            to="/directory"
            className="group"
          >
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-xl bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow group-hover:border-solid"
            >
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="font-medium text-gray-900">Browse Directory</p>
                <p className="text-sm text-gray-500 mt-1">Discover other African startups</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Recent Startups */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-lg font-semibold mb-6 text-gray-800 border-b pb-2">Your Recent Startups</h2>
        
        {startups.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="h-24 w-24 mx-auto mb-6 text-gray-400">
              <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No startups yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't added any startups to GetListed. Create your first one to get started!</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard/add-startup"
                className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Add Your First Startup
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 rounded-lg">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {startups.slice(0, 5).map((startup, index) => (
                  <motion.tr 
                    key={startup._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 flex items-center justify-center mr-4 shadow-sm">
                          {startup.logo ? (
                            <img src={startup.logo} alt={startup.name} className="h-12 w-12 rounded-full object-cover" />
                          ) : (
                            <span className="text-gray-700 font-semibold text-lg">{startup.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{startup.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {startup.country}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                        {startup.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {startup.isVerified ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {startup.metrics?.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/startup-profile/${startup._id}`}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center group"
                        >
                          <span>View</span>
                          <svg className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                        <Link
                          to={`/dashboard/edit-startup/${startup._id}`}
                          className="text-gray-600 hover:text-gray-900 flex items-center group"
                        >
                          <span>Edit</span>
                          <svg className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {startups.length > 5 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-right"
              >
                <Link to="/dashboard/my-startups" className="inline-flex items-center text-indigo-600 hover:text-indigo-900 text-sm font-medium group">
                  View all startups
                  <svg className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;