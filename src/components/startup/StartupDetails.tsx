// client/src/pages/StartupDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStartup } from '../../context/StartupContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import StartupShowcase from '../startup/StartupShowcase';

interface Founder {
  name: string;
  role?: string;
  bio?: string;
  linkedin?: string;
}

interface FundingRound {
  stage: string;
  date: string;
  amount: number;
  valuation?: number;
  investors?: string[];
  notes?: string;
}

interface Startup {
  _id: string;
  name: string;
  description: string;
  tagline?: string;
  logo?: string;
  website?: string;
  category: string;
  stage: string;
  foundingDate: string;
  city?: string;
  country: string;
  createdBy: string;
  products?: string;
  founders?: Founder[];
  fundingRounds?: FundingRound[];
  metrics: {
    fundingTotal?: number;
    employees?: number;
    revenue?: string;
  };
  socialProfiles: {
    [key: string]: string;
  };
}

const StartupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getStartup, loading, error } = useStartup();
  
  const [startup, setStartup] = useState<Startup | null>(null);
  const [similarStartups, setSimilarStartups] = useState<Startup[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'funding'>('overview');
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const [contactFormData, setContactFormData] = useState({
    firstName: user?.firstName || '',
    email: user?.email || '',
    message: '',
  });

  useEffect(() => {
    if (id) {
      fetchStartupData(id);
    }
  }, [id]);

  // const fetchStartupData = async (startupId: string) => {
  //   try {
  //     // Use the getStartup method from context instead of direct API call
  //     const response = await getStartup(startupId);
  //     setStartup(response.data);
      
  //     // For similar startups, we'll need to add this functionality to our context
  //     // For now, you can use a modified query to get similar startups
  //     // This is a placeholder - you'll need to implement getSimilarStartups in your context
  //     fetchSimilarStartups(response.data);
  //   } catch (err) {
  //     console.error('Error fetching startup:', err);
  //     // Error is already handled by the context
  //   }
  // };

  const fetchSimilarStartups = async (currentStartup: Startup) => {
    try {
      // This is a placeholder - ideally, add a getSimilarStartups method to your context
      // For now, we can use the category as a filter
      if (currentStartup?.category) {
        // Using the getStartups method with a query
        const query = `category=${currentStartup.category}&limit=4&exclude=${currentStartup._id}`;
        const response = await fetch(`/api/startups?${query}`);
        const data = await response.json();
        setSimilarStartups(data.data.filter((s: Startup) => s._id !== currentStartup._id));
      }
    } catch (err) {
      console.error('Error fetching similar startups:', err);
    }
  };

  const isOwner = user && startup && user._id === startup.createdBy;

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the logic to send the contact request
    // For example, calling an API endpoint to send an email
    console.log('Contact form submitted:', contactFormData);
    
    // Show success message or handle response accordingly
    alert('Your message has been sent! The startup will contact you soon.');
    
    // Close the modal and reset form
    setContactModalOpen(false);
    setContactFormData({
      firstName: user?.firstName || '',
      email: user?.email || '',
      message: '',
    });
  };

  const renderTabContent = () => {
    if (!startup) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{startup.description}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">Product & Services</h2>
              {startup.products ? (
                <div className="prose prose-indigo max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{startup.products}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No product information available</p>
              )}
            </div>
          </div>
        );
      
      case 'team':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Leadership Team</h2>
            {startup.founders && startup.founders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {startup.founders.map((founder, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold text-xl mr-4">
                        {founder.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{founder.name}</h3>
                        {founder.role && (
                          <p className="text-gray-600">{founder.role}</p>
                        )}
                        <p className="text-gray-500 mt-1 text-sm">{startup.name}</p>
                        {founder.linkedin && (
                          <a 
                            href={founder.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-3"
                          >
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                            </svg>
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                    </div>
                    {founder.bio && (
                      <p className="mt-4 text-gray-700">{founder.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No team information available</p>
            )}
          </div>
        );
      
      case 'funding':
        return (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Funding History</h2>
            {startup.fundingRounds && startup.fundingRounds.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-indigo-100"></div>
                
                <div className="space-y-10">
                  {startup.fundingRounds.map((round, index) => (
                    <div key={index} className="relative pl-16">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold">{round.stage} Round</h3>
                          <span className="text-gray-500 text-sm">{formatDate(round.date)}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 my-2">
                          ${(round.amount / 1000000).toFixed(2)}M
                        </p>
                        
                        {round.valuation && (
                          <p className="text-sm text-gray-500 mb-4">
                            Valuation: ${(round.valuation / 1000000).toFixed(2)}M
                          </p>
                        )}
                        
                        {round.investors && round.investors.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Lead Investors:</p>
                            <div className="flex flex-wrap gap-2">
                              {round.investors.map((investor, idx) => (
                                <span 
                                  key={idx} 
                                  className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200"
                                >
                                  {investor}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {round.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-gray-700">{round.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 italic mb-4">No funding rounds recorded</p>
                {isOwner && (
                  <Link 
                    to={`/startup/edit/${startup._id}`} 
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    + Add funding information
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Oops!</h2>
          <p className="text-red-700">{error || 'Startup not found'}</p>
          <Link to="/directory" className="mt-4 inline-block text-indigo-600 hover:underline">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section */}
      <div className="bg-indigo-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-12">
              <div className="flex items-center mb-4">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium mr-2">
                  {startup.category}
                </span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {startup.stage}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{startup.name}</h1>
              <p className="text-xl text-indigo-100 mb-6">{startup.tagline}</p>
              
              <div className="flex flex-wrap items-center text-indigo-200 mb-6">
                <span>{startup.city ? `${startup.city}, ` : ''}{startup.country}</span>
                {startup.foundingDate && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Founded {new Date(startup.foundingDate).getFullYear()}</span>
                  </>
                )}
                {startup.metrics.employees && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{startup.metrics.employees} {startup.metrics.employees === 1 ? 'employee' : 'employees'}</span>
                  </>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {startup.website && (
                  <a 
                    href={startup.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center bg-white text-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    Visit Website
                  </a>
                )}
                
                <button 
                  onClick={() => setContactModalOpen(true)}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Contact
                </button>
                
                {isOwner && (
                  <Link 
                    to={`/startup/edit/${startup._id}`} 
                    className="flex items-center bg-transparent border border-white text-white px-4 py-2 rounded-lg hover:bg-white hover:text-indigo-800 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
            
            <div className="w-40 h-40 bg-white rounded-lg shadow-lg flex items-center justify-center p-4">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/placeholder-logo.svg';
                  }}
                />
              ) : (
                <div className="text-6xl font-bold text-indigo-300">{startup.name.charAt(0)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of your component remains the same */}
      {/* Tabs navigation */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'team' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setActiveTab('funding')}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 ${
                activeTab === 'funding' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Funding
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            {renderTabContent()}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Metrics</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Funding Total</p>
                  <p className="text-xl font-semibold">
                    {startup.metrics.fundingTotal 
                      ? `$${startup.metrics.fundingTotal >= 1000000 
                          ? (startup.metrics.fundingTotal / 1000000).toFixed(2) + 'M' 
                          : (startup.metrics.fundingTotal / 1000).toFixed(0) + 'K'}`
                      : 'Not disclosed'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Employees</p>
                  <p className="text-xl font-semibold">{startup.metrics.employees || 'Not disclosed'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Revenue Range</p>
                  <p className="text-xl font-semibold">{startup.metrics.revenue || 'Not disclosed'}</p>
                </div>
              </div>
            </div>
            
            {/* Rest of the component's sidebar remains the same */}
            {/* Social profiles and similar startups sections go here */}
          </div>
        </div>
      </div>
      
      {/* Similar startups showcase */}
      {similarStartups.length > 0 && (
        <div className="bg-gray-100 border-t border-gray-200 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">You Might Also Be Interested In</h2>
            <StartupShowcase startups={similarStartups.slice(0, 4)} />
          </div>
        </div>
      )}
      
      {/* Contact modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Contact {startup.name}</h3>
                <button 
                  onClick={() => setContactModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleContactSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactFormData.firstName}
                    onChange={handleContactChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactFormData.email}
                    onChange={handleContactChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactFormData.message}
                    onChange={handleContactChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Introduce yourself and explain why you're reaching out..."
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    className="mr-3 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartupDetails;