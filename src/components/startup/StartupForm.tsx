// client/src/components/startup/StartupForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStartup } from '../../context/StartupContext';
import { Startup } from '../../types';

interface StartupFormProps {
  isEditing?: boolean;
}

const StartupForm: React.FC<StartupFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { 
    startup, 
    loading, 
    error: contextError, 
    getStartup, 
    createStartup, 
    updateStartup 
  } = useStartup();
  
  // Define initial state with proper typing based on the Startup interface
  const initialState: Omit<Startup, '_id' | 'createdBy' | 'isVerified' | 'createdAt' | 'updatedAt' | 'metrics.connections' | 'metrics.views'> = {
    name: '',
    logo: '',
    tagline: '',
    description: '',
    website: '',
    category: '',
    subCategory: '',
    country: '',
    city: '',
    foundingDate: '',
    stage: '',
    metrics: {
      fundingTotal: 0,
      employees: 1,
      connections: 0,
      views: 0,
      revenue: 0
    },
    socialProfiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    founders: [{ name: '', role: '', linkedin: '' }]
  };

  // Use a typed form state that matches what we expect for API operations
  const [formData, setFormData] = useState<Omit<Startup, '_id' | 'createdBy' | 'isVerified' | 'createdAt' | 'updatedAt'>>(initialState);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('basic');

  useEffect(() => {
    if (isEditing && id) {
      fetchStartupData(id);
    }
  }, [isEditing, id]);

  useEffect(() => {
    // Update form data when startup data is loaded from context
    if (startup && isEditing) {
      // Format date for input field
      const formattedStartup = {...startup};
      if (formattedStartup.foundingDate) {
        const date = new Date(formattedStartup.foundingDate);
        formattedStartup.foundingDate = date.toISOString().split('T')[0];
      }
      
      // Convert metrics.revenue from string to number if needed
      if (typeof formattedStartup.metrics.revenue === 'string') {
        formattedStartup.metrics = {
          ...formattedStartup.metrics,
          revenue: parseRevenueToNumber(formattedStartup.metrics.revenue as unknown as string)
        };
      }
      
      setFormData(formattedStartup);
    }
  }, [startup, isEditing]);

  // Helper function to convert revenue string to number
  const parseRevenueToNumber = (revenue: string): number => {
    // This is a simple conversion - adjust based on your actual revenue format
    if (revenue === 'Pre-revenue') return 0;
    if (revenue === 'Undisclosed') return 0;
    
    // For values like "$1K-$10K", return the average
    if (revenue.includes('-')) {
      const parts = revenue.replace(/[^0-9K.M-]/g, '').split('-');
      const min = parseRevenueValue(parts[0]);
      const max = parseRevenueValue(parts[1]);
      return (min + max) / 2;
    }
    
    return parseRevenueValue(revenue.replace(/[^0-9K.M+]/g, ''));
  };

  const parseRevenueValue = (value: string): number => {
    if (value.includes('K')) {
      return parseFloat(value.replace('K', '')) * 1000;
    } else if (value.includes('M')) {
      return parseFloat(value.replace('M', '')) * 1000000;
    }
    return parseFloat(value);
  };

  // Convert number back to revenue range string for display
  const formatRevenueForDisplay = (revenue: number): string => {
    if (revenue === 0) return 'Pre-revenue';
    if (revenue <= 10000) return '$1K-$10K';
    if (revenue <= 100000) return '$10K-$100K';
    if (revenue <= 1000000) return '$100K-$1M';
    if (revenue <= 10000000) return '$1M-$10M';
    return '$10M+';
  };

  const fetchStartupData = async (startupId: string) => {
    try {
      await getStartup(startupId);
    } catch (error) {
      console.error('Error fetching startup:', error);
      setError('Failed to load startup data.');
    }
  };

  // Fixed handleChange function to properly handle nested properties
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      setFormData(prev => {
        // Create a safe copy of the nested object, defaulting to empty object if undefined
        const parentObject = prev[parent as keyof typeof prev] || {};
        
        // Type guard to ensure we're dealing with an object
        if (typeof parentObject === 'object' && parentObject !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentObject,
              [child]: parent === 'metrics' ? 
                (child === 'fundingTotal' || child === 'employees' || child === 'revenue' ? 
                  Number(value) : value) : 
                value
            }
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFounderChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFounders = [...formData.founders];
    updatedFounders[index] = { ...updatedFounders[index], [name]: value };
    
    setFormData(prev => ({
      ...prev,
      founders: updatedFounders
    }));
  };

  const addFounder = () => {
    setFormData(prev => ({
      ...prev,
      founders: [...prev.founders, { name: '', role: '', linkedin: '' }]
    }));
  };

  const removeFounder = (index: number) => {
    if (formData.founders.length > 1) {
      const updatedFounders = formData.founders.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        founders: updatedFounders
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const submissionData = {...formData};
      
      // Make sure metrics is properly formatted as numbers
      submissionData.metrics = {
        fundingTotal: Number(submissionData.metrics.fundingTotal),
        employees: Number(submissionData.metrics.employees),
        revenue: Number(submissionData.metrics.revenue),
        connections: submissionData.metrics.connections || 0,
        views: submissionData.metrics.views || 0
      };
      
      if (isEditing && id) {
        await updateStartup(id, submissionData);
      } else {
        await createStartup(submissionData);
      }
      
      setSuccess(true);
      
      // Show success message with smooth animation
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Redirect after a delay
      setTimeout(() => {
        navigate(isEditing ? `/startup/${id}` : '/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving startup:', error);
      setError('Failed to save startup. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionClasses = (section: string) => 
    `py-2 px-4 cursor-pointer rounded-md transition-all duration-300 ${
      activeSection === section 
        ? 'bg-indigo-600 text-white font-medium' 
        : 'hover:bg-indigo-100 text-gray-700'
    }`;

  if (loading && isEditing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-medium">Loading startup data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 transition-all duration-300 transform hover:shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 border-b pb-4">
        {isEditing ? 'Edit Startup Profile' : 'List Your Startup'}
      </h2>
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow animate-fade-in">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">Startup {isEditing ? 'updated' : 'created'} successfully!</p>
          </div>
        </div>
      )}
      
      {(error || contextError) && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow animate-fade-in">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">{error || contextError}</p>
          </div>
        </div>
      )}
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        <button 
          type="button" 
          onClick={() => setActiveSection('basic')} 
          className={sectionClasses('basic')}
        >
          Basic Info
        </button>
        <button 
          type="button" 
          onClick={() => setActiveSection('location')} 
          className={sectionClasses('location')}
        >
          Category & Location
        </button>
        <button 
          type="button" 
          onClick={() => setActiveSection('metrics')} 
          className={sectionClasses('metrics')}
        >
          Funding & Metrics
        </button>
        <button 
          type="button" 
          onClick={() => setActiveSection('social')} 
          className={sectionClasses('social')}
        >
          Social
        </button>
        <button 
          type="button" 
          onClick={() => setActiveSection('founders')} 
          className={sectionClasses('founders')}
        >
          Founders
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className={`transition-opacity duration-300 ease-in-out ${activeSection === 'basic' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter startup name"
                />
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="https://..."
                />
              </div>
              
              <div className="md:col-span-2 transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline / One-liner*
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Describe your startup in one sentence"
                />
                <div className="mt-1 text-xs text-right text-gray-500">
                  {formData.tagline.length}/100 characters
                </div>
              </div>
              
              <div className="md:col-span-2 transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Tell us about your startup's mission, vision, and what problem you're solving"
                />
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="https://..."
                />
              </div>

              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Founding Date
                </label>
                <input
                  type="date"
                  name="foundingDate"
                  value={formData.foundingDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Category and Location */}
        <div className={`transition-opacity duration-300 ease-in-out ${activeSection === 'location' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Category & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category*
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">Select category</option>
                  {['Fintech', 'Healthtech', 'Edtech', 'Agritech', 'E-commerce', 'Clean Energy', 'Logistics', 'AI & ML', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="e.g., Payment Processing, Telemedicine"
                />
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country*
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">Select country</option>
                  {['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana', 'Rwanda', 'Ethiopia', 'Senegal', 'Morocco', 'Tanzania', 'Uganda', 'Ivory Coast', 'Other'].map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter city name"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Funding & Metrics */}
        <div className={`transition-opacity duration-300 ease-in-out ${activeSection === 'metrics' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Funding & Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage*
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">Select stage</option>
                  {['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Established'].map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Funding (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="metrics.fundingTotal"
                    value={formData.metrics.fundingTotal}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Employees
                </label>
                <input
                  type="number"
                  name="metrics.employees"
                  value={formData.metrics.employees}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="1"
                />
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Range
                </label>
                <select
                  name="metrics.revenue"
                  value={typeof formData.metrics.revenue === 'number' ? 
                    formatRevenueForDisplay(formData.metrics.revenue) : 
                    formData.metrics.revenue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="Pre-revenue">Pre-revenue</option>
                  <option value="$1K-$10K">$1K-$10K</option>
                  <option value="$10K-$100K">$10K-$100K</option>
                  <option value="$100K-$1M">$100K-$1M</option>
                  <option value="$1M-$10M">$1M-$10M</option>
                  <option value="$10M+">$10M+</option>
                  <option value="Undisclosed">Undisclosed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Profiles */}
        <div className={`transition-opacity duration-300 ease-in-out ${activeSection === 'social' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </span>
                </label>
                <input
                  type="url"
                  name="socialProfiles.linkedin"
                  value={formData.socialProfiles.linkedin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </span>
                </label>
                <input
                  type="url"
                  name="socialProfiles.twitter"
                  value={formData.socialProfiles.twitter}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="https://twitter.com/..."
                />
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                    </svg>
                    Facebook
                  </span>
                </label>
                <input
                  type="url"
                  name="socialProfiles.facebook"
                  value={formData.socialProfiles.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="https://facebook.com/..."
                />
              </div>
              
              <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                    Instagram
                  </span>
                </label>
                <input
                  type="url"
                  name="socialProfiles.instagram"
                  value={formData.socialProfiles.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Founders */}
        <div className={`transition-opacity duration-300 ease-in-out ${activeSection === 'founders' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-indigo-600">Founders</h3>
              <button
                type="button"
                onClick={addFounder}
                className="flex items-center text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors duration-300 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Founder
              </button>
            </div>
            
            {formData.founders.map((founder, index) => (
              <div 
                key={index} 
                className="mb-6 p-5 border border-gray-200 rounded-lg shadow-sm transition-all duration-300 transform hover:shadow-md hover:border-indigo-200"
              >
                <div className="flex justify-between mb-4">
                  <h4 className="font-medium text-lg text-indigo-700">Founder {index + 1}</h4>
                  {formData.founders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFounder(index)}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors duration-300 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="transition-all duration-300 transform hover:scale-105">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={founder.name}
                      onChange={(e) => handleFounderChange(index, e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  
                  <div className="transition-all duration-300 transform hover:scale-105">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={founder.role}
                      onChange={(e) => handleFounderChange(index, e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="CEO, CTO, etc."
                    />
                  </div>
                  
                  <div className="transition-all duration-300 transform hover:scale-105">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn Profile
                      </span>
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={founder.linkedin}
                      onChange={(e) => handleFounderChange(index, e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Submit */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </div>
            ) : (
              isEditing ? 'Update Startup' : 'List Startup'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StartupForm;