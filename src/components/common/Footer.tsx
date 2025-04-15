import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Resources Column */}
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/success-stories" className="hover:underline">Success Stories</Link></li>
              <li><Link to="/partners" className="hover:underline">Partners <span className="text-xs bg-blue-100 px-1 py-0.5 rounded">Popular</span></Link></li>
              <li><Link to="/reports" className="hover:underline">Reports</Link></li>
              <li><Link to="/demo" className="hover:underline">Demo</Link></li>
            </ul>
          </div>

          {/* Startups Column */}
          <div>
            <h3 className="font-bold mb-4">Startups</h3>
            <ul className="space-y-2">
              <li><Link to="/directory" className="hover:underline">All Startups</Link></li>
                <li><Link to="/profiles" className="hover:underline">Profiles<span className="text-xs bg-blue-100 px-1 py-0.5 rounded">Popular</span></Link></li>
              <li><Link to="/integrations" className="hover:underline">Integrations </Link></li>
              <li><Link to="/pitch-deck" className="hover:underline">Pitch Deck Builder<span className="text-xs bg-green-100 px-1 py-0.5 rounded">New</span></Link></li>
              <li><Link to="/featured" className="hover:underline">Get Featured</Link></li>
            </ul>
          </div>

          {/* Sectors Column */}
          <div>
            <h3 className="font-bold mb-4">Sectors</h3>
            <ul className="space-y-2">
              <li><Link to="/fintech" className="hover:underline">Fintech</Link></li>
              <li><Link to="/healthtech" className="hover:underline">Healthtech</Link></li>
              <li><Link to="/edtech" className="hover:underline">Edtech</Link></li>
              <li><Link to="/agritech" className="hover:underline">Web3</Link></li>
              <li><Link to="/ecommerce" className="hover:underline">E-commerce</Link></li>
              <li><Link to="/all-sectors" className="hover:underline">All Sectors</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact us</Link></li>
            </ul>
          </div>

          {/* Regions & Blog Column */}
          <div>
            <div className="mb-8">
              <h3 className="font-bold mb-4">Regions</h3>
              <ul className="space-y-2">
                <li><Link to="/west-africa" className="hover:underline">West Africa</Link></li>
                <li><Link to="/east-africa" className="hover:underline">East Africa</Link></li>
                <li><Link to="/north-africa" className="hover:underline">North Africa</Link></li>
                <li><Link to="/southern-africa" className="hover:underline">Southern Africa</Link></li>
                <li><Link to="/central-africa" className="hover:underline">Central Africa</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="11" fill="#4f46e5" />
                  <circle cx="12" cy="12" r="8" fill="white" />
                  <circle cx="12" cy="12" r="4" fill="#4f46e5" />
                </svg>
                <span className="ml-2 font-bold">GetListed</span>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-center md:text-left mt-4">
            © 2025 GetListed Technologies, Inc. All rights reserved.
          </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;