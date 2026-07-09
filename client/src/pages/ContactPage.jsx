import React, { useState } from 'react';
import { FaPaperPlane, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Save to mock support database
    const supportLogs = JSON.parse(localStorage.getItem('support_messages') || '[]');
    supportLogs.push({ id: Date.now(), ...formData });
    localStorage.setItem('support_messages', JSON.stringify(supportLogs));

    setSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Contact SAFEAI Support</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Have queries about licensing, project structures, or custom integrations? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-safety-card border border-safety-border p-6 rounded-2xl flex items-start gap-4">
            <FaEnvelope className="text-red-500 text-lg shrink-0 mt-1" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Email Address</h4>
              <p className="text-xs text-gray-400 mt-1">support@safeai.org</p>
            </div>
          </div>

          <div className="bg-safety-card border border-safety-border p-6 rounded-2xl flex items-start gap-4">
            <FaPhone className="text-emerald-500 text-lg shrink-0 mt-1" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Emergency Hotline</h4>
              <p className="text-xs text-gray-400 mt-1">+91 99999 88888</p>
            </div>
          </div>

          <div className="bg-safety-card border border-safety-border p-6 rounded-2xl flex items-start gap-4">
            <FaMapMarkerAlt className="text-blue-500 text-lg shrink-0 mt-1" />
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Lab Location</h4>
              <p className="text-xs text-gray-400 mt-1">Dept of Computer Engineering, Block V</p>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="glass-panel border-safety-border p-8 rounded-2xl space-y-4">
            
            {success && (
              <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs text-center font-bold">
                Message Sent Successfully! We will respond shortly.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-left">
                <label className="text-xs text-gray-400 font-bold block mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
                  required
                />
              </div>
              <div className="text-left">
                <label className="text-xs text-gray-400 font-bold block mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="text-left">
              <label className="text-xs text-gray-400 font-bold block mb-1">Subject</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Licensing query"
                className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition"
              />
            </div>

            <div className="text-left">
              <label className="text-xs text-gray-400 font-bold block mb-1">Message Content</label>
              <textarea 
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your safety query here..."
                className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2.5 text-xs outline-none transition resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition duration-200"
            >
              <FaPaperPlane size={11} />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
