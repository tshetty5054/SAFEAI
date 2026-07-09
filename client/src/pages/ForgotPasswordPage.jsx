import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { isMock, auth } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isMock) {
        // Simulate password reset email
        setTimeout(() => {
          setMessage('Check your email inbox for instructions to reset your password (MOCK).');
          setLoading(false);
          setEmail('');
        }, 1500);
      } else {
        await sendPasswordResetEmail(auth, email);
        setMessage('Check your email inbox for instructions to reset your password.');
        setLoading(false);
        setEmail('');
      }
    } catch (err) {
      setError(err.message || 'Error processing request. Please verify email.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel border-safety-border p-8 rounded-2xl">
        <div className="flex flex-col items-center mb-8">
          <FaShieldAlt className="text-red-500 text-4xl animate-pulse mb-3" />
          <h2 className="text-xl font-bold text-white">Reset Credentials</h2>
          <p className="text-xs text-gray-500 mt-1 text-center">Provide registered email link to request recovery directions.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs font-semibold mb-6 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs font-semibold mb-6 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200 mt-4"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Send Recovery Email'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-8 text-center font-medium">
          Remembered your password? <Link to="/login" className="text-red-500 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
