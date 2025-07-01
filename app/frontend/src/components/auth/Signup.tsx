import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from './api';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authApi.signup({ name, email, password });
      // Handle successful signup (e.g., redirect, show success message)
    } catch (err) {
      setError('Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">Sign Up</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Username"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 