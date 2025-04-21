import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { Startup, StartupFilter } from '../types';

// Define startups state interface
interface StartupsState {
  startups: Startup[];
  startup: Startup | null;
  loading: boolean;
  error: string | null;
  pagination: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  } | null;
  count: number;
}

// Define context interface
interface StartupContextType extends StartupsState {
  getStartups: (filter?: StartupFilter, page?: number, limit?: number) => Promise<void>;
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
    error: null,
    pagination: null,
    count: 0
  });

  // Load startups on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getStartups();
    }
  }, [isAuthenticated]);

  // Build query string from filter parameters
  const buildQueryString = (filter?: StartupFilter, page?: number, limit?: number): string => {
    const params = new URLSearchParams();
    
    if (filter) {
      if (filter.category) params.append('category', filter.category);
      if (filter.country) params.append('country', filter.country);
      if (filter.stage) params.append('stage', filter.stage);
      if (filter.searchTerm) params.append('name[$regex]', filter.searchTerm);
      
      if (filter.fundingRange) {
        if (filter.fundingRange.min !== undefined) 
          params.append('metrics.fundingTotal[gte]', filter.fundingRange.min.toString());
        if (filter.fundingRange.max !== undefined) 
          params.append('metrics.fundingTotal[lte]', filter.fundingRange.max.toString());
      }
      
      if (filter.employeeCount) {
        if (filter.employeeCount.min !== undefined) 
          params.append('metrics.employees[gte]', filter.employeeCount.min.toString());
        if (filter.employeeCount.max !== undefined) 
          params.append('metrics.employees[lte]', filter.employeeCount.max.toString());
      }
    }
    
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    return params.toString();
  };

  // Get all startups with optional filtering
  const getStartups = useCallback(async (filter?: StartupFilter, page?: number, limit?: number) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      const queryString = buildQueryString(filter, page, limit);
      const url = `/startups/getstartups${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      
      setStartupsState(prev => ({
        ...prev,
        startups: response.data.data,
        pagination: response.data.pagination || null,
        count: response.data.count || 0,
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
  }, []);

  // Get single startup
  const getStartup = useCallback(async (id: string) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      const response = await api.get(`/startups/getstartup/${id}`);
      
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
  }, []);

  // Create new startup
  const createStartup = useCallback (async (startupData: Partial<Startup>) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      const response = await api.post('/startups/create', startupData);
      
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
  },[]);

  // Update startup
  const updateStartup = useCallback(async (id: string, startupData: Partial<Startup>) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      const response = await api.put(`/startups/updatestartup/${id}`, startupData);
      
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
  },[]);

  // Delete startup
  const deleteStartup = useCallback(async (id: string) => {
    try {
      setStartupsState(prev => ({ ...prev, loading: true }));
      
      await api.delete(`/startups/deletestartup/${id}`);
      
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
  },[]);

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