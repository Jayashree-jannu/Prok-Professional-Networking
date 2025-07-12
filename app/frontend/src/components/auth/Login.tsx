import React, { useState } from 'react';
import { FiUser, FiLock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from './api';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Use identifier as email or username for login
      const payload: { username?: string; email?: string; password: string } = identifier.includes('@')
        ? { email: identifier, password }
        : { username: identifier, password };
      const result = await loginUser(payload);
      if (result && (result.token || result.access_token)) {
        setSuccess(true);
        localStorage.setItem('token', result.token || result.access_token);
        navigate('/profile');
      } else {
        setError(result?.message || result?.msg || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  // Add logout button for user to clear token and refresh authentication
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6 tracking-tight drop-shadow-sm">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiUser size={20} />
              </span>
              <input
                type="text"
                style={{ color: 'black' }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black dark:text-black bg-white placeholder-gray-400 transition-all shadow-sm hover:shadow-md"
                placeholder="Username or Email"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiLock size={20} />
              </span>
              <input
                type="password"
                style={{ color: 'black' }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black dark:text-black bg-white placeholder-gray-400 transition-all shadow-sm hover:shadow-md"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className="text-red-500 text-center text-sm mt-2 animate-pulse">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm mt-2 animate-bounce">Login successful!</div>}
        </form>
        <div className="text-center text-sm mt-4 text-black">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Logout (Clear Token)
        </button>
        
        {/* Auto-login button for testing */}
        <button
          onClick={() => {
            setIdentifier('testuser4');
            setPassword('Password123!');
            setTimeout(() => {
              const form = document.querySelector('form');
              if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
            }, 100);
          }}
          className="w-full mt-2 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Auto Login (Test User)
        </button>
        
        {/* Direct login button */}
        <button
          onClick={() => {
            // Set token directly and redirect
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MjMwNzYwNCwianRpIjoiMmJmZGQzYzYtNmIzYy00YmEzLTg2OGYtNjFhZWEyODJmODRmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjYiLCJuYmYiOjE3NTIzMDc2MDQsImV4cCI6MTc1MjMxMTIwNH0.LXmOwhuDtoqEF3a6fGS5V-4eNB2D9Rv-EkyOfG7yKSM');
            window.location.href = '/profile';
          }}
          className="w-full mt-2 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Direct Login (Skip Form)
        </button>
      </div>
    </div>
  );
};

export default Login; 