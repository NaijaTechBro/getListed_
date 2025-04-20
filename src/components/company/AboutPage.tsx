import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

const AboutPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: 'Sodiq Baki Adeiza',
      role: 'CEO & Co-founder',
      imageUrl: '/api/placeholder/200/200'
    },
    // {
    //   name: 'Michael Chen',
    //   role: 'CTO & Co-founder',
    //   imageUrl: '/api/placeholder/200/200'
    // },
    // {
    //   name: 'Olivia Rodriguez',
    //   role: 'Head of Design',
    //   imageUrl: '/api/placeholder/200/200'
    // },
    // {
    //   name: 'David Kim',
    //   role: 'Head of Engineering',
    //   imageUrl: '/api/placeholder/200/200'
    // }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-6">About GetListed</h1>
          <p className="text-white text-lg">
            We're on a mission to transform how startups connect with investors and unlock growth opportunities across Africa.
          </p>
        </div>
      </div>
      
      {/* Our Story Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2021, GetListed began with a simple observation: despite incredible innovation happening across Africa, startups were struggling to get visibility and connect with the right investors and partners.
              </p>
              <p className="text-gray-700 mb-4">
                Our founders, having experienced these challenges firsthand, set out to build a platform that would level the playing field and create a thriving ecosystem where great ideas could find the support they need to grow.
              </p>
              <p className="text-gray-700">
                Today, GetListed has helped over 500 startups across the continent raise funding, build partnerships, and scale their operations. But this is just the beginning of our journey.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img src="/api/placeholder/600/400" alt="Team collaboration" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mission & Vision Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To empower African startups by providing them with the visibility, connections, and resources they need to build world-changing companies.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-700">
                A future where African innovation thrives on the global stage, with startups from every corner of the continent having equal opportunity to succeed and create lasting impact.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Team Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                <img src={member.imageUrl} alt={member.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Team</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about our mission.
              Check out our open positions and become part of our story.
            </p>
            <a href="/careers" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View Careers
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;