import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { Startup } from '../types';

// Define startups state interface
interface StartupsState {
  startups: Startup[];
  startup: Startup | null;
  loading: boolean;
  error: string | null;
}

// Define context interface
interface StartupContextType extends StartupsState {
  getStartups: (query?: string) => Promise<void>;
  getStartup: (id: string) => Promise<void>;
  createStartup: (startupData: Partial<Startup>) => Promise<void>;
  updateStartup: (id: string, startupData: Partial<Startup>) => Promise<void>;
  deleteStartup: (id: string) => Promise<void>;
  clearStartupError: () => void;
  clearStartup: () => void;
}

// Create context
const StartupContext = createContext<StartupContextType | undefined>(undefined);

// Provider component
interface StartupProviderProps {
  children: ReactNode;
}

export const StartupProvider: React.FC<StartupProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [startupsState, setStartupsState] = useState<StartupsState>({
    startups: [],
    startup: null,
    loading: false,
    error: null
  });

  // Load startups on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getStartups();
    }
  }, [isAuthenticated]);

  // // Get all startups
  const getStartups = async (query: string = '') => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      const url = query ? `/startups?${query}` : '/startups';
      const response = await api.get(url);
      
      setStartupsState(prev => ({
        ...prev,
        startups: response.data.data,
        loading: false,
        error: null
      }));
      
      return response.data;
    } catch (err: any) {
      setStartupsState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch startups'
      }));
      throw err;
    }
  };

  // Get single startup
  const getStartup = async (id: string) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      const response = await api.get(`/startups/${id}`);
      
      setStartupsState(prev => ({
        ...prev,
        startup: response.data.data,
        loading: false,
        error: null
      }));
      
      return response.data;
    } catch (err: any) {
      setStartupsState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch startup'
      }));
      throw err;
    }
  };

  // Create new startup
  const createStartup = async (startupData: Partial<Startup>) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      const response = await api.post('/startups', startupData);
      
      setStartupsState(prev => ({
        ...prev,
        startups: [...prev.startups, response.data.data],
        startup: response.data.data,
        loading: false,
        error: null
      }));
      
      return response.data;
    } catch (err: any) {
      setStartupsState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to create startup'
      }));
      throw err;
    }
  };

  // Update startup
  const updateStartup = async (id: string, startupData: Partial<Startup>) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      const response = await api.put(`/startups/${id}`, startupData);
      
      setStartupsState(prev => ({
        ...prev,
        startups: prev.startups.map(startup =>
          startup._id === id ? response.data.data : startup
        ),
        startup: response.data.data,
        loading: false,
        error: null
      }));
      
      return response.data;
    } catch (err: any) {
      setStartupsState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to update startup'
      }));
      throw err;
    }
  };

  // Delete startup
  const deleteStartup = async (id: string) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      await api.delete(`/startups/${id}`);
      
      setStartupsState(prev => ({
        ...prev,
        startups: prev.startups.filter(startup => startup._id !== id),
        startup: prev.startup?._id === id ? null : prev.startup,
        loading: false,
        error: null
      }));
    } catch (err: any) {
      setStartupsState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to delete startup'
      }));
      throw err;
    }
  };

  // Clear error
  const clearStartupError = useCallback(() => {
    setStartupsState(prev => ({ ...prev, error: null }));
  }, []);

  // Clear current startup
  const clearStartup = useCallback(() => {
    setStartupsState(prev => ({ ...prev, startup: null }));
  }, []);

  return (
    <StartupContext.Provider
      value={{
        ...startupsState,
        getStartups,
        getStartup,
        createStartup,
        updateStartup,
        deleteStartup,
        clearStartupError,  
        clearStartup
      }}
    >
      {children}
    </StartupContext.Provider>
  );
};

// Custom hook to use startup context
export const useStartup = () => {
  const context = useContext(StartupContext);
  if (context === undefined) {
    throw new Error('useStartup must be used within a StartupProvider');
  }
  return context;
};