import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaUpload, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'Other',
    emergencyContactName: '',
    emergencyContactNumber: '',
    relationship: 'Friend',
    photoBase64: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // File to Base64 converter for local avatars
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photoBase64: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (!formData.emergencyContactName || !formData.emergencyContactNumber) {
      return setError('Please configure your primary emergency contact.');
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="glass-panel border-safety-border p-8 rounded-2xl">
        <div className="flex flex-col items-center mb-6">
          <FaShieldAlt className="text-red-500 text-3xl animate-pulse mb-2" />
          <h2 className="text-xl font-bold text-white">Create Security Profile</h2>
          <p className="text-xs text-gray-500 mt-1 text-center">Configure personal details and trusted primary contact.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs font-semibold mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* Section 1: User Profile */}
          <div className="text-left space-y-4">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest border-b border-safety-border pb-1">1. Personal Credentials</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+919876543210"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Gender Identification</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Non-binary</option>
                  <option value="PreferNot">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Profile Avatar Upload */}
            <div>
              <label className="text-xs text-gray-400 font-bold block mb-1.5">Profile Photo</label>
              <div className="flex items-center gap-4">
                {formData.photoBase64 ? (
                  <img src={formData.photoBase64} alt="Preview" className="w-12 h-12 rounded-full border border-safety-border object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-safety-bg border border-safety-border flex items-center justify-center text-xs text-gray-500">Avatar</div>
                )}
                <label className="bg-safety-border hover:bg-gray-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded-xl border border-safety-border cursor-pointer flex items-center gap-2 transition duration-200">
                  <FaUpload /> Upload Photo
                  <input type="file" onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Emergency Contact */}
          <div className="text-left space-y-4">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest border-b border-safety-border pb-1">2. Primary Emergency Contact</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="text-xs text-gray-400 font-bold block mb-1">Contact Name</label>
                <input 
                  type="text" 
                  value={formData.emergencyContactName}
                  onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  placeholder="e.g. Spouse / Mother"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs text-gray-400 font-bold block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.emergencyContactNumber}
                  onChange={e => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                  placeholder="e.g. +91 99999 88888"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs text-gray-400 font-bold block mb-1">Relationship</label>
                <select
                  value={formData.relationship}
                  onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                >
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Friend">Friend</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Complete Registration & Protect'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Already protected? <Link to="/login" className="text-red-500 font-bold hover:underline">Access Account</Link>
        </p>
      </div>
    </div>
  );
};
