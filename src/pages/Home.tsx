import React from 'react';
import { Link } from 'react-router-dom';
import StartupShowcase from '../components/startup/StartupShowcase';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <Navbar />
      <div className="bg-white py-16 px-8 text-center">
        <h1 className="text-5xl font-bold mb-6 max-w-4xl mx-auto">Discover African Startups Ready to Change the World</h1>
        <p className="text-xl max-w-3xl mx-auto mb-8">
          GetListed connects investors with promising African startups across all sectors and stages.
        </p>
        <Link to="/register" className="bg-black text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-800">
          Get Listed Today
        </Link>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {['Fintech', 'Healthtech', 'Edtech', 'Agritech', 'E-commerce', 'Clean Energy', 'Logistics', 'AI & ML'].map((category) => (
              <Link 
                key={category}
                to={`/directory?category=${category.toLowerCase()}`} 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-b-4 border-transparent hover:border-indigo-500"
              >
                <div className="text-xl font-medium text-indigo-700">{category}</div>
                <div className="text-sm text-gray-500 mt-1">Explore startups</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Startups - Updated with Green Background */}
      <section className="py-16 bg-green-200">
        <div className="container mx-auto px-4">
          <StartupShowcase />
        </div>
      </section>

      {/* For Investors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-indigo-50 rounded-xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-8 md:mb-0 md:pr-10">
                <h2 className="text-3xl font-bold mb-4">For Investors</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Discover promising African startups across various stages. Filter by sector, location, 
                  and metrics to find your next investment opportunity.
                </p>
                <Link to="/investors">
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700">
                    Investor Access
                  </button>
                </Link>
              </div>
              <div className="md:w-1/3">
                <img 
                  src="/api/placeholder/300/300" 
                  alt="Investor Illustration" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Create Your Profile',
                description: 'Sign up and create your startup profile with comprehensive details that matter to investors.',
                icon: '📝'
              },
              {
                title: 'Get Discovered',
                description: 'Your startup becomes visible to our network of investors, partners, and users across Africa.',
                icon: '🔍'
              },
              {
                title: 'Make Connections',
                description: 'Receive interest directly from verified investors and potential partners.',
                icon: '🤝'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="bg-purple-200 py-16 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <img 
              src="/api/placeholder/600/400" 
              alt="Startup Collaboration" 
              className="mx-auto"
            />
          </div>
          <h2 className="text-4xl font-bold mb-6">Ready to grow your startup with the right connections?</h2>
          <p className="text-xl mb-8">
            Join thousands of African startups already using GetListed to connect with investors and partners.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <button className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800">
                List Your Startup
              </button>
            </Link>
            <Link to="/contact">
              <button className="border border-black px-6 py-3 rounded-md bg-white font-medium hover:bg-gray-100">
                Talk to Our Team
              </button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default HomePage;