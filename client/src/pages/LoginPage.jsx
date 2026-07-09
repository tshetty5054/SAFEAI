import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel border-safety-border p-8 rounded-2xl">
        <div className="flex flex-col items-center mb-8">
          <FaShieldAlt className="text-red-500 text-4xl animate-pulse mb-3" />
          <h2 className="text-2xl font-black text-white tracking-wide">Access Companion</h2>
          <p className="text-xs text-gray-500 mt-1">Provide your credentials to secure safety mode.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs font-semibold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="text-xs text-gray-400 font-bold block mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
              required
            />
          </div>

          <div className="text-left">
            <label className="text-xs text-gray-400 font-bold block mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-gray-400 font-semibold select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="accent-red-500 rounded focus:ring-0" 
              />
              <span>Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-red-500 hover:underline font-bold">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200 mt-4"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Acknowledge & Sign In'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-8 text-center font-medium">
          Not registered yet? <Link to="/register" className="text-red-500 font-bold hover:underline">Create Profile</Link>
        </p>
      </div>
    </div>
  );
};
