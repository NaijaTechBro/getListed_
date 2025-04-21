  import React, { useState, useEffect } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import { useStartup } from '../../context/StartupContext';
  import { Startup, FundingRound } from '../../types';
  
  const StartupForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;
    
    // Access startup context methods
    const { 
      createStartup, 
      updateStartup, 
      getStartup, 
      startup, 
      loading, 
      error, 
      clearStartupError,
      clearStartup 
    } = useStartup();
  
    // Form sections management
    const [activeSection, setActiveSection] = useState<'basic' | 'location' | 'metrics' | 'social' | 'founders' | 'funding'>('basic');
    
    // Revenue options matching the enum in Mongoose schema
    const revenueOptions = ['Pre-revenue', '$1K-$10K', '$10K-$100K', '$100K-$1M', '$1M-$10M', '$10M+', 'Undisclosed'];
    
    // Initialize form data
    const [formData, setFormData] = useState<Omit<Startup, '_id' | 'createdBy' | 'isVerified' | 'createdAt' | 'updatedAt' | 'metrics.connections' | 'metrics.views'>>({
      name: '',
      logo: '',
      tagline: '',
      description: '',
      website: '',
      foundingDate: '',
      category: '',
      subCategory: '',
      country: '',
      city: '',
      stage: '',
      products: '',
      metrics: {
        fundingTotal: 0,
        employees: 1,
        connections: 0,
        views: 0,
        revenue: 'Undisclosed' // Changed from number to string enum value
      },
      socialProfiles: {
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: ''
      },
      founders: [
        {
          name: '',
          role: '',
          linkedin: '',
          bio: ''
        }
      ],
      fundingRounds: []
    });
  
    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
    // Load existing startup data if editing
    useEffect(() => {
      if (isEditing && id) {
        getStartup(id);
      }
      
      // Cleanup function
      return () => {
        clearStartup();
        clearStartupError();
      };
    }, [isEditing, id, getStartup, clearStartup, clearStartupError]);
  
    // Populate form when startup data loads
    useEffect(() => {
      if (startup && isEditing) {
        setFormData({
          name: startup.name || '',
          logo: startup.logo || '',
          tagline: startup.tagline || '',
          description: startup.description || '',
          website: startup.website || '',
          foundingDate: startup.foundingDate || '',
          category: startup.category || '',
          subCategory: startup.subCategory || '',
          country: startup.country || '',
          city: startup.city || '',
          stage: startup.stage || '',
          products: startup.products || '',
          metrics: {
            fundingTotal: startup.metrics?.fundingTotal || 0,
            employees: startup.metrics?.employees || 1,
            connections: startup.metrics?.connections || 0,
            views: startup.metrics?.views || 0,
            revenue: startup.metrics?.revenue || 'Undisclosed' // Use the string value directly
          },
          socialProfiles: {
            linkedin: startup.socialProfiles?.linkedin || '',
            twitter: startup.socialProfiles?.twitter || '',
            facebook: startup.socialProfiles?.facebook || '',
            instagram: startup.socialProfiles?.instagram || ''
          },
          founders: startup.founders && startup.founders.length > 0 
            ? startup.founders.map(founder => ({
                name: founder.name || '',
                role: founder.role || '',
                linkedin: founder.linkedin || '',
                bio: founder.bio || ''
              }))
            : [{ name: '', role: '', linkedin: '', bio: '' }],
          fundingRounds: startup.fundingRounds || []
        });
      }
    }, [startup, isEditing]);

  
    // Fixed handleChange function to properly handle nested properties
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      // Clear validation error for this field when changed
      if (validationErrors[name]) {
        setValidationErrors(prev => {
          const updated = {...prev};
          delete updated[name];
          return updated;
        });
      }
      
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
                  (child === 'fundingTotal' || child === 'employees' ? 
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

  // Founder change handler
  const handleFounderChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFounders = [...formData.founders];
    newFounders[index] = {
      ...newFounders[index],
      [name]: value
    };
    
    setFormData(prev => ({
      ...prev,
      founders: newFounders
    }));
    
    // Clear validation errors for this field
    const errorKey = `founders[${index}].${name}`;
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  // Add new founder
  const addFounder = () => {
    setFormData(prev => ({
      ...prev,
      founders: [...prev.founders, { name: '', role: '', linkedin: '', bio: '' }]
    }));
  };

  // Remove founder
  const removeFounder = (index: number) => {
    if (formData.founders.length > 1) {
      const newFounders = [...formData.founders];
      newFounders.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        founders: newFounders
      }));
    }
  };

  // Funding round handlers
  const handleFundingRoundChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newRounds = [...(formData.fundingRounds || [])];
    
    newRounds[index] = {
      ...newRounds[index],
      [name]: name === 'amount' || name === 'valuation' ? parseFloat(value) : value
    };
    
    setFormData(prev => ({
      ...prev,
      fundingRounds: newRounds
    }));
    
    // Clear validation errors
    const errorKey = `fundingRounds[${index}].${name}`;
    if (validationErrors[errorKey]) {
      setValidationErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  // Add funding round
  const addFundingRound = () => {
    const newRound: FundingRound = {
      stage: '',
      date: '',
      amount: 0,
      valuation: 0,
      investors: [],
      notes: ''
    };
    
    setFormData(prev => ({
      ...prev,
      fundingRounds: [...(prev.fundingRounds || []), newRound]
    }));
  };

  // Remove funding round
  const removeFundingRound = (index: number) => {
    const newRounds = [...(formData.fundingRounds || [])];
    newRounds.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      fundingRounds: newRounds
    }));
  };

  // Handle investors for funding rounds
  const handleInvestorsChange = (roundIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const investors = value.split(',').map(inv => inv.trim());
    
    const newRounds = [...(formData.fundingRounds || [])];
    newRounds[roundIndex] = {
      ...newRounds[roundIndex],
      investors: investors
    };
    
    setFormData(prev => ({
      ...prev,
      fundingRounds: newRounds
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.name) errors.name = 'Startup name is required';
    if (!formData.tagline) errors.tagline = 'Tagline is required';
    if (formData.tagline.length > 100) errors.tagline = 'Tagline must be less than 100 characters';
    if (!formData.description) errors.description = 'Description is required';
    
    // URL validations
    if (formData.logo && !/^https?:\/\/.+/.test(formData.logo)) {
      errors.logo = 'Please enter a valid URL';
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'Please enter a valid URL';
    }
    
    // Category and location validations
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.country) errors.country = 'Country is required';
    
    // Stage validation
    if (!formData.stage) errors.stage = 'Stage is required';
    
    // Social profiles URL validations
    Object.entries(formData.socialProfiles).forEach(([key, value]) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        errors[`socialProfiles.${key}`] = 'Please enter a valid URL';
      }
    });
    
    // Founders validation
    formData.founders.forEach((founder, index) => {
      if (!founder.name) {
        errors[`founders[${index}].name`] = 'Founder name is required';
      }
      if (founder.linkedin && !/^https?:\/\/.+/.test(founder.linkedin)) {
        errors[`founders[${index}].linkedin`] = 'Please enter a valid LinkedIn URL';
      }
    });
    
    // Funding rounds validation
    formData.fundingRounds?.forEach((round, index) => {
      if (round.amount && round.amount < 0) {
        errors[`fundingRounds[${index}].amount`] = 'Amount cannot be negative';
      }
      if (round.valuation && round.valuation < 0) {
        errors[`fundingRounds[${index}].valuation`] = 'Valuation cannot be negative';
      }
      if (!round.stage) {
        errors[`fundingRounds[${index}].stage`] = 'Funding stage is required';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data for API
      const startupData = {
        ...formData,
        // Ensure metrics are numbers
        metrics: {
          ...formData.metrics,
          fundingTotal: Number(formData.metrics.fundingTotal),
          employees: Number(formData.metrics.employees)
        }
      };
      
      if (isEditing && id) {
        await updateStartup(id, startupData);
      } else {
        await createStartup(startupData);
      }
      
      // Navigate back to startups list or profile page
      navigate(isEditing && id ? '/dashboard/my-startups' : `/startup-profile/${id}`);
    } catch (err) {
      console.error('Error submitting form:', err);
      // Error is handled by the context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation between form sections
  const navigateToSection = (section: typeof activeSection) => {
    setActiveSection(section);
  };

  // Categories for dropdown
  const categories = [
    'SaaS', 'Fintech', 'Healthtech', 'Edtech', 'E-commerce', 
    'AI/ML', 'Blockchain', 'Cleantech', 'Hardware', 'Marketplaces',
    'Consumer Apps', 'Enterprise Software', 'IoT', 'Gaming', 'Other'
  ];

  // Stages for dropdown
  const stages = [
    'Idea', 'MVP','Pre-seed', 'Seed', 'Series A', 'Series B', 
    'Series C', 'Series D+', 'Profitable', 'Acquired', 'IPO'
  ];

  // Funding round stages
  const fundingStages = [
    'Pre-seed', 'Seed', 'Series A', 'Series B', 
    'Series C', 'Series D', 'Series E+', 'Convertible Note', 
    'Angel', 'Grant', 'Crowdfunding', 'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Section navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['basic', 'location', 'metrics', 'social', 'founders', 'funding'].map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => navigateToSection(section as typeof activeSection)}
            className={`px-4 py-2 rounded-md ${
              activeSection === section 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {/* Display any API errors at the top */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* Basic Information Section */}
      <div className={activeSection === 'basic' ? 'block' : 'hidden'}>
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
                className={`w-full px-4 py-3 border ${validationErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="Enter startup name"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
              )}
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
                className={`w-full px-4 py-3 border ${validationErrors.logo ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="https://..."
              />
              {validationErrors.logo && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.logo}</p>
              )}
            </div>

            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline* <span className="text-xs text-gray-500">(max 100 chars)</span>
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                required
                maxLength={100}
                className={`w-full px-4 py-3 border ${validationErrors.tagline ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="One-line description of your startup"
              />
              {validationErrors.tagline && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.tagline}</p>
              )}
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
                className={`w-full px-4 py-3 border ${validationErrors.website ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="https://..."
              />
              {validationErrors.website && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.website}</p>
              )}
            </div>

            <div className="transition-all duration-300 transform hover:scale-105 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className={`w-full px-4 py-3 border ${validationErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="Describe your startup in detail"
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border ${validationErrors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
              )}
            </div>

            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Category
              </label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="E.g., Marketing Automation, HR Tech"
              />
            </div>

            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stage*
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border ${validationErrors.stage ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
              >
                <option value="">Select Stage</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              {validationErrors.stage && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.stage}</p>
              )}
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

            <div className="transition-all duration-300 transform hover:scale-105 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products/Services
              </label>
              <textarea
                name="products"
                value={formData.products}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="Describe your products or services"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className={activeSection === 'location' ? 'block' : 'hidden'}>
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country*
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border ${validationErrors.country ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="Country"
              />
              {validationErrors.country && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.country}</p>
              )}
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
                placeholder="City"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className={activeSection === 'metrics' ? 'block' : 'hidden'}>
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Funding (USD)
              </label>
              <input
                type="number"
                name="metrics.fundingTotal"
                value={formData.metrics.fundingTotal}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="0"
              />
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
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="0"
              />
            </div>
            <div className="transition-all duration-300 transform hover:scale-105">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue Range
                </label>
                <select
                  name="metrics.revenue"
                  value={formData.metrics.revenue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                    {revenueOptions.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
            </div>
          </div>
        </div>
      </div>

      {/* Social Profiles Section */}
      <div className={activeSection === 'social' ? 'block' : 'hidden'}>
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">Social Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="socialProfiles.linkedin"
                value={formData.socialProfiles.linkedin}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${validationErrors['socialProfiles.linkedin'] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="https://linkedin.com/company/..."
              />
              {validationErrors['socialProfiles.linkedin'] && (
                <p className="mt-1 text-sm text-red-600">{validationErrors['socialProfiles.linkedin']}</p>
              )}
            </div>

            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                name="socialProfiles.twitter"
                value={formData.socialProfiles.twitter}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${validationErrors['socialProfiles.twitter'] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="https://twitter.com/..."
              />
              {validationErrors['socialProfiles.twitter'] && (
                <p className="mt-1 text-sm text-red-600">{validationErrors['socialProfiles.twitter']}</p>
              )}
            </div>

            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                name="socialProfiles.facebook"
                value={formData.socialProfiles.facebook}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${validationErrors['socialProfiles.facebook'] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="https://facebook.com/..."
              />
              {validationErrors['socialProfiles.facebook'] && (
                <p className="mt-1 text-sm text-red-600">{validationErrors['socialProfiles.facebook']}</p>
              )}
            </div>

            <div className="transition-all duration-300 transform hover:scale-105">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                name="socialProfiles.instagram"
                value={formData.socialProfiles.instagram}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${validationErrors['socialProfiles.instagram'] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                placeholder="https://instagram.com/..."
              />
              {validationErrors['socialProfiles.instagram'] && (
                <p className="mt-1 text-sm text-red-600">{validationErrors['socialProfiles.instagram']}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Founders Section */}
      <div className={activeSection === 'founders' ? 'block' : 'hidden'}>
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">Founders</h3>
          
          {formData.founders.map((founder, index) => (
            <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-800">Founder {index + 1}</h4>
                {formData.founders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFounder(index)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="transition-all duration-300 transform hover:scale-105">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={founder.name}
                    onChange={(e) => handleFounderChange(index, e)}
                    required
                    className={`w-full px-4 py-3 border ${validationErrors[`founders[${index}].name`] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                    placeholder="John Doe"
                  />
                  {validationErrors[`founders[${index}].name`] && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors[`founders[${index}].name`]}</p>
                  )}
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
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={founder.linkedin}
                    onChange={(e) => handleFounderChange(index, e)}
                    className={`w-full px-4 py-3 border ${validationErrors[`founders[${index}].linkedin`] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                    placeholder="https://linkedin.com/in/..."
                  />
                  {validationErrors[`founders[${index}].linkedin`] && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors[`founders[${index}].linkedin`]}</p>
                  )}
                </div>

                <div className="transition-all duration-300 transform hover:scale-105 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={founder.bio}
                    onChange={(e) => handleFounderChange(index, e)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Brief bio of the founder"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addFounder}
            className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Founder
          </button>
        </div>
      </div>

      {/* Funding Rounds Section */}
      <div className={activeSection === 'funding' ? 'block' : 'hidden'}>
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">Funding Rounds</h3>
          
          {formData.fundingRounds && formData.fundingRounds.map((round, index) => (
            <div key={index} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-800">Funding Round {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeFundingRound(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="transition-all duration-300 transform hover:scale-105">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stage*
                  </label>
                  <select
                    name="stage"
                    value={round.stage}
                    onChange={(e) => handleFundingRoundChange(index, e)}
                    required
                    className={`w-full px-4 py-3 border ${validationErrors[`fundingRounds[${index}].stage`] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                  >
                    <option value="">Select Stage</option>
                    {fundingStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                  {validationErrors[`fundingRounds[${index}].stage`] && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors[`fundingRounds[${index}].stage`]}</p>
                  )}
                </div>

                <div className="transition-all duration-300 transform hover:scale-105">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={round.date}
                    onChange={(e) => handleFundingRoundChange(index, e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>

                <div className="transition-all duration-300 transform hover:scale-105">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={round.amount}
                    onChange={(e) => handleFundingRoundChange(index, e)}
                    min="0"
                    className={`w-full px-4 py-3 border ${validationErrors[`fundingRounds[${index}].amount`] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                    placeholder="0"
                  />
                  {validationErrors[`fundingRounds[${index}].amount`] && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors[`fundingRounds[${index}].amount`]}</p>
                  )}
                </div>

                <div className="transition-all duration-300 transform hover:scale-105">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valuation (USD)
                  </label>
                  <input
                    type="number"
                    name="valuation"
                    value={round.valuation || ''}
                    onChange={(e) => handleFundingRoundChange(index, e)}
                    min="0"
                    className={`w-full px-4 py-3 border ${validationErrors[`fundingRounds[${index}].valuation`] ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200`}
                    placeholder="0"
                  />
                  {validationErrors[`fundingRounds[${index}].valuation`] && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors[`fundingRounds[${index}].valuation`]}</p>
                  )}
                </div>

                <div className="transition-all duration-300 transform hover:scale-105 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investors (comma separated)
                  </label>
                  <input
                    type="text"
                    name="investors"
                    value={round.investors?.join(', ') || ''}
                    onChange={(e) => handleInvestorsChange(index, e)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Investor A, Investor B, Investor C"
                  />
                </div>

                <div className="transition-all duration-300 transform hover:scale-105 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={round.notes || ''}
                    onChange={(e) => handleFundingRoundChange(index, e)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Additional information about this funding round"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addFundingRound}
            className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Funding Round
          </button>
        </div>
      </div>
      
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-md hover:shadow-lg flex items-center"
        >
          {(isSubmitting || loading) ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            isEditing ? 'Update Startup' : 'List Startup'
          )}
        </button>
      </div>
    </form>
  );
};

export default StartupForm;
