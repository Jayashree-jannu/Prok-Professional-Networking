import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const token = localStorage.getItem('token');
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex gap-6 items-center">
            <Link to="/" className="font-bold text-xl text-blue-700">Prok Network</Link>
            {token ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
                <Link to="/" className="text-gray-700 hover:text-blue-600">Feed</Link>
                <Link to="/posts" className="text-gray-700 hover:text-blue-600">Post Listing</Link>
                <Link to="/jobs" className="text-gray-700 hover:text-blue-600">Jobs</Link>
                <Link to="/messages" className="text-gray-700 hover:text-blue-600">Messages</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link to="/signup" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 