// client/src/components/startup/StartupForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStartup } from '../../context/StartupContext';
import { useAuth } from '../../context/AuthContext';
import { Startup, Founder, User } from '../../types';

interface StartupFormProps {
  isEditing?: boolean;
}

const StartupForm: React.FC<StartupFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
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
      connections: 0, // Adding default values for all required fields
      views: 0, // Adding default values for all required fields
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: parent === 'metrics' ? 
            (child === 'fundingTotal' || child === 'employees' || child === 'revenue' ? 
              Number(value) : value) : 
            value
        }
      }));
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
      
      // Redirect after a delay
      setTimeout(() => {
        navigate(isEditing ? `/startup/${id}` : '/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving startup:', error);
      setError('Failed to save startup. Please try again.');
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Startup Profile' : 'List Your Startup'}
      </h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Startup {isEditing ? 'updated' : 'created'} successfully!
        </div>
      )}
      
      {(error || contextError) && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error || contextError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Startup Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline / One-liner*
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your startup in one sentence"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tell us about your startup's mission, vision, and what problem you're solving"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Founding Date
              </label>
              <input
                type="date"
                name="foundingDate"
                value={formData.foundingDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        {/* Category and Location */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Category & Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select category</option>
                {['Fintech', 'Healthtech', 'Edtech', 'Agritech', 'E-commerce', 'Clean Energy', 'Logistics', 'AI & ML', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-category
              </label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Payment Processing, Telemedicine"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country*
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select country</option>
                {['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana', 'Rwanda', 'Ethiopia', 'Senegal', 'Morocco', 'Tanzania', 'Uganda', 'Ivory Coast', 'Other'].map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        
        {/* Funding & Metrics */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Funding & Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage*
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select stage</option>
                {['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Established'].map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Funding (USD)
              </label>
              <input
                type="number"
                name="metrics.fundingTotal"
                value={formData.metrics.fundingTotal}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Employees
              </label>
              <input
                type="number"
                name="metrics.employees"
                value={formData.metrics.employees}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Revenue Range
              </label>
              <select
                name="metrics.revenue"
                value={typeof formData.metrics.revenue === 'number' ? 
                  formatRevenueForDisplay(formData.metrics.revenue) : 
                  formData.metrics.revenue}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        
        {/* Social Profiles */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Social Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                name="socialProfiles.linkedin"
                value={formData.socialProfiles.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://linkedin.com/company/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="url"
                name="socialProfiles.twitter"
                value={formData.socialProfiles.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://twitter.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                name="socialProfiles.facebook"
                value={formData.socialProfiles.facebook}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                name="socialProfiles.instagram"
                value={formData.socialProfiles.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>
        
        {/* Founders */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Founders</h3>
            <button
              type="button"
              onClick={addFounder}
              className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors"
            >
              + Add Founder
            </button>
          </div>
          
          {formData.founders.map((founder, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">Founder {index + 1}</h4>
                {formData.founders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFounder(index)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={founder.name}
                    onChange={(e) => handleFounderChange(index, e)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={founder.role}
                    onChange={(e) => handleFounderChange(index, e)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="CEO, CTO, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={founder.linkedin}
                    onChange={(e) => handleFounderChange(index, e)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Startup' : 'List Startup'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StartupForm;