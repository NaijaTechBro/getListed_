import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto my-16 px-4 text-center">
      <div className="mb-8">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mt-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page not found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to home
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Log in
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <p className="text-gray-600">
          Need help? <a href="#" className="text-indigo-600 hover:text-indigo-800">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;