import React from 'react';
import { FaMapMarkedAlt, FaHospital, FaShieldAlt, FaHome, FaDirections } from 'react-icons/fa';
import { useEmergency } from '../contexts/EmergencyContext';
import { MapWidget } from '../components/MapWidget';

export const GpsTrackingPage = () => {
  const { location, unsafeZones, setLocation } = useEmergency();

  const handleRefreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            speed: pos.coords.speed || 0,
            timestamp: new Date().toLocaleTimeString()
          });
        },
        () => {
          // Hardcode Bangalore coordinates shifting
          const offset = (Math.random() - 0.5) * 0.005;
          setLocation(prev => ({
            ...prev,
            lat: 12.9716 + offset,
            lng: 77.5946 + offset,
            timestamp: new Date().toLocaleTimeString()
          }));
        }
      );
    }
  };

  const destinations = [
    { name: 'City General Hospital', type: 'hospital', phone: '+919999988811', lat: location.lat + 0.004, lng: location.lng - 0.003 },
    { name: 'Central Police Station', type: 'police', phone: '+919999988822', lat: location.lat - 0.003, lng: location.lng + 0.005 },
    { name: 'Community Safe Shelter', type: 'safe', phone: '+919999988833', lat: location.lat + 0.002, lng: location.lng + 0.003 }
  ];

  const handleDirections = (dest) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center gap-2">
        <FaMapMarkedAlt className="text-red-500 text-xl animate-pulse" />
        <h2 className="text-xl font-extrabold text-white">Live GPS Safety Tracking</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Map Widget */}
        <div className="lg:col-span-2 h-[480px]">
          <MapWidget 
            location={location}
            unsafeZones={unsafeZones}
            onLocationRefresh={handleRefreshLocation}
          />
        </div>

        {/* Right Column: Surrounding details panel */}
        <div className="space-y-6">
          
          {/* Coordinates Telemetry card */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Device Telemetry</h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center bg-safety-bg/40 p-2.5 rounded-xl border border-safety-border">
                <span className="text-gray-500">Latitude</span>
                <span className="text-white font-bold">{location.lat ? location.lat.toFixed(6) : 'Fetching...'}</span>
              </div>
              <div className="flex justify-between items-center bg-safety-bg/40 p-2.5 rounded-xl border border-safety-border">
                <span className="text-gray-500">Longitude</span>
                <span className="text-white font-bold">{location.lng ? location.lng.toFixed(6) : 'Fetching...'}</span>
              </div>
              <div className="flex justify-between items-center bg-safety-bg/40 p-2.5 rounded-xl border border-safety-border">
                <span className="text-gray-500">Speed (M/S)</span>
                <span className="text-white font-bold">{location.speed ? location.speed.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between items-center bg-safety-bg/40 p-2.5 rounded-xl border border-safety-border">
                <span className="text-gray-500">Sync Timestamp</span>
                <span className="text-white font-bold">{location.timestamp || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Surrounding Safety Points Card */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Closest Assistance Points</h3>

            <div className="space-y-3">
              {destinations.map((dest, i) => (
                <div key={i} className="bg-safety-bg/30 border border-safety-border rounded-xl p-3.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-lg shrink-0">
                      {dest.type === 'hospital' && <FaHospital className="text-red-500" />}
                      {dest.type === 'police' && <FaShieldAlt className="text-emerald-500" />}
                      {dest.type === 'safe' && <FaHome className="text-purple-500" />}
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{dest.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{dest.phone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDirections(dest)}
                    className="p-2 bg-safety-border hover:bg-gray-700 text-blue-400 hover:text-white rounded-lg text-xs"
                    title="Get Route Directions"
                  >
                    <FaDirections />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
