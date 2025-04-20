import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

interface JobPosting {
  title: string;
  department: string;
  location: string;
  type: string;
}

const CareersPage: React.FC = () => {
  const jobOpenings: JobPosting[] = [
    {
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Backend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    // {
    //   title: 'Customer Success Manager',
    //   department: 'Sales',
    //   location: 'London',
    //   type: 'Full-time'
    // },
    // {
    //   title: 'Marketing Specialist',
    //   department: 'Marketing',
    //   location: 'Remote',
    //   type: 'Contract'
    // }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-black py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Join Our Team</h1>
          <p className="text-white text-lg">
            We're building the future of Africa Startup Data and Infrastructure and we need talented people like you.
            Explore our open positions and find your next opportunity.
          </p>
        </div>
      </div>
      
      {/* Values Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">We constantly push the boundaries and think outside the box to create solutions that transform the industry.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">We believe in the power of teamwork and fostering an inclusive environment where everyone's voice is heard.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">We maintain the highest standards of honesty, transparency and ethical behavior in everything we do.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Open Positions Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {jobOpenings.map((job, index) => (
              <div key={index} className={`border-b border-gray-200 ${index === jobOpenings.length - 1 ? 'border-b-0' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                  <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.department} • {job.location} • {job.type}</p>
                  </div>
                  <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Don't see a position that matches your skills?</p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
              Send Open Application
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CareersPage;