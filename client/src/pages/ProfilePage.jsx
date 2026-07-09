import React, { useState } from 'react';
import { FaUser, FaUpload, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    gender: currentUser?.gender || 'Other',
    emergencyContactName: currentUser?.emergencyContactName || '',
    emergencyContactNumber: currentUser?.emergencyContactNumber || '',
    relationship: currentUser?.relationship || 'Friend',
    photoBase64: currentUser?.photoURL || ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photoBase64: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      await updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactNumber: formData.emergencyContactNumber,
        relationship: formData.relationship,
        photoURL: formData.photoBase64
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <div className="flex items-center gap-2">
        <FaUser className="text-red-500 text-xl" />
        <h2 className="text-xl font-extrabold text-white">Edit Security Profile</h2>
      </div>

      <div className="glass-panel border-safety-border p-6 rounded-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
              <FaCheckCircle />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          {/* Profile Photo */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest pb-1 border-b border-safety-border">
              Profile Identification Avatar
            </h4>
            <div className="flex items-center gap-4 py-2">
              {formData.photoBase64 ? (
                <img 
                  src={formData.photoBase64} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full border border-safety-border object-cover" 
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-safety-bg border border-safety-border flex items-center justify-center text-xs text-gray-500">Avatar</div>
              )}
              <label className="bg-safety-border hover:bg-gray-700 text-gray-300 text-xs font-semibold px-4 py-2 rounded-xl border border-safety-border cursor-pointer flex items-center gap-2 transition duration-200">
                <FaUpload /> Upload Photo
                <input type="file" onChange={handlePhotoUpload} accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest pb-1 border-b border-safety-border">
              1. Personal Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-bold block mb-1">Gender Identification</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-fit min-w-[200px] bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Non-binary</option>
                <option value="PreferNot">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Section 2: Primary Emergency Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest pb-1 border-b border-safety-border">
              2. Primary Guardian Connection
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Contact Name</label>
                <input 
                  type="text" 
                  value={formData.emergencyContactName}
                  onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.emergencyContactNumber}
                  onChange={e => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Relationship</label>
                <select
                  value={formData.relationship}
                  onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
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
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-800 text-white font-bold py-3 px-8 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200"
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
