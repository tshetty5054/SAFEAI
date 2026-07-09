import React, { useState } from 'react';
import { FaExclamationTriangle, FaPlus, FaTrash, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';
import { useEmergency } from '../contexts/EmergencyContext';
import { MapWidget } from '../components/MapWidget';

export const UnsafeZonesPage = () => {
  const { unsafeZones, addUnsafeZone, deleteUnsafeZone, location, setLocation } = useEmergency();

  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    radius: '100', // default meters
    threatLevel: 'High'
  });

  const [success, setSuccess] = useState(false);

  // Set coordinates to current user location for easy setup
  const useCurrentCoords = () => {
    if (location.lat && location.lng) {
      setFormData(prev => ({
        ...prev,
        lat: location.lat.toFixed(6),
        lng: location.lng.toFixed(6)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lat || !formData.lng || !formData.radius) return;

    await addUnsafeZone({
      name: formData.name,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      radius: parseFloat(formData.radius),
      threatLevel: formData.threatLevel
    });

    setSuccess(true);
    setFormData({ name: '', lat: '', lng: '', radius: '100', threatLevel: 'High' });
    setTimeout(() => setSuccess(false), 4000);
  };

  const getLevelColor = (lvl) => {
    if (lvl === 'Critical') return 'text-red-500 bg-red-950/20';
    if (lvl === 'High') return 'text-red-400 bg-red-950/10';
    return 'text-amber-500 bg-amber-950/10';
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <FaExclamationTriangle className="text-red-500 text-xl" />
        <h2 className="text-xl font-extrabold text-white">Geofencing & Unsafe Zones</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form and List Column */}
        <div className="space-y-6">
          
          {/* Add Zone form */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Configure Unsafe Geofence</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {success && (
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-[10px] text-center font-bold">
                  Geofence Registered Successfully!
                </div>
              )}

              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1">Zone Identifier</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alleyway Dark Corner"
                  className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-4.5 py-2 text-xs outline-none transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Latitude</label>
                  <input 
                    type="number" 
                    step="0.000001"
                    value={formData.lat}
                    onChange={e => setFormData({ ...formData, lat: e.target.value })}
                    placeholder="e.g. 12.97"
                    className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-3 py-2 text-xs outline-none transition font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Longitude</label>
                  <input 
                    type="number" 
                    step="0.000001"
                    value={formData.lng}
                    onChange={e => setFormData({ ...formData, lng: e.target.value })}
                    placeholder="e.g. 77.59"
                    className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-3 py-2 text-xs outline-none transition font-mono"
                    required
                  />
                </div>
              </div>

              {/* Set using GPS helper */}
              <button
                type="button"
                onClick={useCurrentCoords}
                className="text-[10px] text-red-500 hover:underline font-bold block"
              >
                🎯 Use current GPS Coordinates
              </button>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Radius (Meters)</label>
                  <input 
                    type="number" 
                    value={formData.radius}
                    onChange={e => setFormData({ ...formData, radius: e.target.value })}
                    placeholder="e.g. 150"
                    min="10"
                    max="1000"
                    className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-3 py-2 text-xs outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold block mb-1">Threat Level</label>
                  <select
                    value={formData.threatLevel}
                    onChange={e => setFormData({ ...formData, threatLevel: e.target.value })}
                    className="w-full bg-safety-bg border border-safety-border focus:border-red-500 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition"
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition duration-200"
              >
                <FaPlus size={9} />
                <span>Save Geofence</span>
              </button>

            </form>
          </div>
        </div>

        {/* Live Visualizer Map Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Map Preview */}
          <div className="h-[300px]">
            <MapWidget 
              location={location}
              unsafeZones={unsafeZones}
              onLocationRefresh={() => {}}
            />
          </div>

          {/* List of zones */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registered Unsafe Boundaries</h3>

            {unsafeZones.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center py-4">No custom geofences registered yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {unsafeZones.map(zone => (
                  <div key={zone.id} className="bg-safety-bg/30 border border-safety-border rounded-xl p-3.5 flex justify-between items-center gap-2">
                    <div className="text-left space-y-0.5">
                      <p className="text-xs font-bold text-white flex items-center gap-2">
                        {zone.name}
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border border-red-500/10 ${getLevelColor(zone.threatLevel)}`}>
                          {zone.threatLevel}
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono">
                        Radius: {zone.radius}m &bull; Coords: {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteUnsafeZone(zone.id)}
                      className="p-2 bg-red-950/20 text-red-400 hover:bg-red-900/40 rounded-lg text-xs"
                      title="Remove geofence boundary"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
