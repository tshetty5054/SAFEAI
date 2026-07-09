import React, { useState } from 'react';
import { 
  FaAddressBook, FaPlus, FaTrash, FaEdit, FaPhone, 
  FaCommentAlt, FaWhatsapp, FaUser, FaEnvelope, FaStar 
} from 'react-icons/fa';
import { useEmergency } from '../contexts/EmergencyContext';

export const ContactsPage = () => {
  const { contacts, addContact, editContact, deleteContact } = useEmergency();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Friend',
    phone: '',
    email: '',
    priority: 'Secondary'
  });

  const [simulatedAction, setSimulatedAction] = useState(null);

  const resetForm = () => {
    setFormData({ name: '', relationship: 'Friend', phone: '', email: '', priority: 'Secondary' });
    setEditingId(null);
    setFormOpen(false);
  };

  const handleEditClick = (contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email || '',
      priority: contact.priority || 'Secondary'
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingId) {
      await editContact(editingId, formData);
    } else {
      await addContact(formData);
    }
    resetForm();
  };

  // Mock Communication dispatch alerts
  const triggerAction = (type, contact) => {
    setSimulatedAction({
      type,
      name: contact.name,
      phone: contact.phone
    });
    setTimeout(() => setSimulatedAction(null), 4000);
  };

  return (
    <div className="space-y-6 text-left relative">
      
      {/* simulated warning triggers overlays */}
      {simulatedAction && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border-l-4 border-red-500 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in max-w-sm">
          <span className="text-xl">
            {simulatedAction.type === 'call' && '📞'}
            {simulatedAction.type === 'sms' && '💬'}
            {simulatedAction.type === 'whatsapp' && '🟢'}
          </span>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              {simulatedAction.type === 'call' && 'Initiating Call Link'}
              {simulatedAction.type === 'sms' && 'Sending Distress SMS'}
              {simulatedAction.type === 'whatsapp' && 'Dispatching WhatsApp GPS'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Simulating alert package to <strong className="text-white">{simulatedAction.name}</strong> ({simulatedAction.phone}).
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaAddressBook className="text-red-500 text-xl" />
          <h2 className="text-xl font-extrabold text-white">Emergency Contacts</h2>
        </div>
        <button
          onClick={() => { resetForm(); setFormOpen(true); }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
        >
          <FaPlus size={10} />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Grid of contacts */}
      {contacts.length === 0 ? (
        <div className="glass-panel border-safety-border rounded-2xl p-12 text-center text-gray-500">
          <p className="text-sm italic">No emergency contacts saved yet.</p>
          <p className="text-xs text-gray-600 mt-1">Please register at least one contact to notify during SOS states.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map(c => (
            <div key={c.id} className="glass-panel border-safety-border rounded-2xl p-6 flex flex-col justify-between hover:border-red-500/20 transition duration-300">
              
              {/* Info Area */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                      {c.name}
                      {c.priority === 'Primary' && (
                        <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase font-bold">
                          <FaStar size={8} /> Primary
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-semibold">{c.relationship} Relationship</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditClick(c)}
                      className="text-gray-400 hover:text-white p-1"
                      title="Edit Contact"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => deleteContact(c.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      title="Delete Contact"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-400 font-mono">
                  <p className="flex items-center gap-2">📞 {c.phone}</p>
                  {c.email && <p className="flex items-center gap-2">✉️ {c.email}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-6 border-t border-safety-border/40 pt-4">
                <button
                  onClick={() => triggerAction('call', c)}
                  className="bg-safety-border hover:bg-gray-700 text-gray-200 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <FaPhone size={10} className="text-blue-500" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => triggerAction('sms', c)}
                  className="bg-safety-border hover:bg-gray-700 text-gray-200 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <FaCommentAlt size={10} className="text-amber-500" />
                  <span>SMS</span>
                </button>
                <button
                  onClick={() => triggerAction('whatsapp', c)}
                  className="bg-safety-border hover:bg-gray-700 text-gray-200 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <FaWhatsapp size={10} className="text-emerald-500" />
                  <span>WhatsApp</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal dialog overlay */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="glass-panel border-safety-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">
              {editingId ? 'Edit Emergency Contact' : 'Register New Contact'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Contact Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Guardian / Mother"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
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
                <div>
                  <label className="text-xs text-gray-400 font-bold block mb-1">Priority Alert Level</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                  >
                    <option value="Secondary">Secondary (Low priority)</option>
                    <option value="Primary">Primary SOS target</option>
                  </select>
                </div>
              </div>

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
                <label className="text-xs text-gray-400 font-bold block mb-1">Email (Optional)</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4 py-2 text-xs outline-none transition"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 text-xs">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-safety-border hover:bg-gray-700 text-gray-300 font-semibold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl"
                >
                  {editingId ? 'Save Changes' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
