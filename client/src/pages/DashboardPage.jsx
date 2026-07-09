import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaExclamationTriangle, FaShieldAlt, FaPhone, FaMicrophone, 
  FaUserFriends, FaMapMarkerAlt, FaAddressBook, FaHeartbeat, FaPhoneAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useEmergency } from '../contexts/EmergencyContext';
import { useThreat } from '../contexts/ThreatContext';
import { MapWidget } from '../components/MapWidget';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { 
    safetyMode, setSafetyMode, location, setLocation, 
    contacts, alerts, unsafeZones, createAlert 
  } = useEmergency();
  
  const { 
    threatConfidence, threatLevel, recommendedAction, statusColor, 
    simulateRapidMovement, setSimulateRapidMovement 
  } = useThreat();

  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [fakeCallRinging, setFakeCallRinging] = useState(false);

  // Trigger Mock Fake Incoming Call
  const triggerFakeCall = () => {
    setFakeCallRinging(true);
    if (typeof Audio !== 'undefined') {
      const ringtone = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
      ringtone.loop = true;
      ringtone.volume = 0.5;
      ringtone.play().catch(() => {});
      
      // Store ringtone ref globally to stop on accept/decline
      window.fakeRingtone = ringtone;
    }
  };

  const handleDeclineFakeCall = () => {
    if (window.fakeRingtone) {
      window.fakeRingtone.pause();
      window.fakeRingtone.currentTime = 0;
    }
    setFakeCallRinging(false);
    setFakeCallActive(false);
  };

  const handleAcceptFakeCall = () => {
    if (window.fakeRingtone) {
      window.fakeRingtone.pause();
      window.fakeRingtone.currentTime = 0;
    }
    setFakeCallRinging(false);
    setFakeCallActive(true);
  };

  // Trigger Immediate SOS Alert from dashboard
  const handleImmediateSOS = () => {
    createAlert({
      threatLevel: 'High',
      threatConfidence: 90,
      notes: 'USER EVENT: Immediate SOS Quick Trigger pressed on dashboard.'
    });
  };

  // Mock location toggle to Bengaluru central for demonstration
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
          // Hardcode a Bengaluru shift for demonstration
          const currentLat = location.lat;
          const shiftLat = currentLat === 12.9716 ? 12.9735 : 12.9716;
          setLocation(prev => ({
            ...prev,
            lat: shiftLat,
            lng: 77.5946,
            timestamp: new Date().toLocaleTimeString()
          }));
        }
      );
    }
  };

  const safetyScore = Math.max(100 - threatConfidence, 10);

  return (
    <div className="space-y-6">
      
      {/* Fake Incoming Call Overlay */}
      {fakeCallRinging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-8 shadow-2xl">
            <div className="space-y-2">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-4xl text-slate-300 mx-auto animate-pulse">
                👤
              </div>
              <h3 className="text-xl font-bold text-white">Guardian Alert</h3>
              <p className="text-xs text-gray-500 animate-bounce">Inbound Safety Escort Call...</p>
            </div>
            
            <div className="flex justify-around items-center pt-8">
              <button 
                onClick={handleDeclineFakeCall}
                className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xl shadow-lg transition duration-200"
              >
                ✕
              </button>
              <button 
                onClick={handleAcceptFakeCall}
                className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center text-xl shadow-lg animate-bounce transition duration-200"
              >
                📞
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fake Active Call Overlay */}
      {fakeCallActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6">
            <div className="space-y-1">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl text-slate-300 mx-auto">
                👤
              </div>
              <h3 className="text-lg font-bold text-white">Guardian Alert</h3>
              <p className="text-xs text-emerald-400 font-mono">00:14 (Active Mock Escape Route)</p>
            </div>
            <p className="text-xs text-gray-400 italic leading-relaxed py-4 border-y border-slate-800">
              "Yes, I am walking home now. I have shared my live location. I'm arriving in 2 minutes."
            </p>
            <button 
              onClick={handleDeclineFakeCall}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition duration-200"
            >
              End Fake Call
            </button>
          </div>
        </div>
      )}

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Safety Diagnostics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Welcome Card & Tip */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <h2 className="text-lg font-extrabold text-white">Safety Companion Status</h2>
              <p className="text-xs text-gray-400 max-w-md">
                Tip: If you enter an unfamiliar or dark street, enable <strong className="text-red-400">Safety Mode</strong> in the header to activate voice triggers.
              </p>
            </div>
            <Link 
              to="/sos"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition duration-200 alert-glow-red"
            >
              <FaExclamationTriangle />
              <span>Active SOS Interface</span>
            </Link>
          </div>

          {/* Map Section */}
          <div className="h-[430px]">
            <MapWidget 
              location={location}
              unsafeZones={unsafeZones}
              onLocationRefresh={handleRefreshLocation}
            />
          </div>

          {/* Quick Actions Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => setSafetyMode(prev => !prev)}
              className={`p-4 rounded-2xl text-left border flex flex-col justify-between h-28 transition duration-300 ${
                safetyMode 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
                  : 'glass-panel border-safety-border hover:border-gray-700 text-gray-400'
              }`}
            >
              <FaShieldAlt size={18} className={safetyMode ? 'text-emerald-400' : 'text-gray-400'} />
              <div className="text-left">
                <span className="text-[9px] font-bold block uppercase">Voice Safety Mode</span>
                <span className="text-xs font-bold text-white">{safetyMode ? 'ACTIVE' : 'STANDBY'}</span>
              </div>
            </button>

            <button
              onClick={handleImmediateSOS}
              className="glass-panel border-safety-border hover:border-red-500/30 p-4 rounded-2xl text-left flex flex-col justify-between h-28 transition duration-300 group"
            >
              <FaExclamationTriangle size={18} className="text-red-500 group-hover:animate-bounce" />
              <div className="text-left">
                <span className="text-[9px] font-bold block uppercase">Immediate Alert</span>
                <span className="text-xs font-bold text-white">Send SOS Log</span>
              </div>
            </button>

            <button
              onClick={triggerFakeCall}
              className="glass-panel border-safety-border hover:border-emerald-500/30 p-4 rounded-2xl text-left flex flex-col justify-between h-28 transition duration-300 group"
            >
              <FaPhoneAlt size={18} className="text-emerald-400 group-hover:animate-bounce" />
              <div className="text-left">
                <span className="text-[9px] font-bold block uppercase">Simulate Escape</span>
                <span className="text-xs font-bold text-white">Fake Call</span>
              </div>
            </button>

            <button
              onClick={() => setSimulateRapidMovement(prev => !prev)}
              className={`p-4 rounded-2xl text-left border flex flex-col justify-between h-28 transition duration-300 ${
                simulateRapidMovement 
                  ? 'bg-blue-950/20 border-blue-500/30 text-blue-400' 
                  : 'glass-panel border-safety-border hover:border-gray-700 text-gray-400'
              }`}
            >
              <FaHeartbeat size={18} className={simulateRapidMovement ? 'text-blue-400 animate-pulse' : 'text-gray-400'} />
              <div className="text-left">
                <span className="text-[9px] font-bold block uppercase">Sensor Simulation</span>
                <span className="text-xs font-bold text-white">{simulateRapidMovement ? 'RAPID SPEED' : 'STATIONARY'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Safety Scores & History */}
        <div className="space-y-6">
          
          {/* Safety Score Meter Card */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl text-center space-y-4">
            <h3 className="text-sm font-bold text-white">Your Safety Index</h3>
            
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="64" cy="64" r="54" 
                  stroke="#1F2E4C" strokeWidth="8" fill="transparent" 
                />
                <circle 
                  cx="64" cy="64" r="54" 
                  stroke={safetyScore > 70 ? '#10B981' : safetyScore > 40 ? '#F59E0B' : '#EF4444'} 
                  strokeWidth="8" fill="transparent"
                  strokeDasharray="339"
                  strokeDashoffset={339 - (safetyScore / 100) * 339}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{safetyScore}%</span>
                <span className="text-[8px] text-gray-500 uppercase tracking-widest">Confidence</span>
              </div>
            </div>

            <div className="text-xs text-gray-400 px-2 leading-relaxed">
              <strong>Assessment:</strong> {recommendedAction}
            </div>
          </div>

          {/* User & Contacts Brief */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4 text-left">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FaUserFriends className="text-red-500" />
              Emergency Profile Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-safety-bg/30 p-2.5 rounded-xl border border-safety-border text-xs">
                <span className="text-gray-400">Total Saved Contacts</span>
                <strong className="text-white">{contacts.length}</strong>
              </div>
              <div className="flex justify-between items-center bg-safety-bg/30 p-2.5 rounded-xl border border-safety-border text-xs">
                <span className="text-gray-400">Active Unsafe Geofences</span>
                <strong className="text-white">{unsafeZones.length}</strong>
              </div>
              {contacts[0] && (
                <div className="border border-safety-border rounded-xl p-3 bg-safety-bg/20 text-xs">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-red-500 mb-1">Primary Guardian Link</p>
                  <p className="text-white font-bold">{contacts[0].name}</p>
                  <p className="text-gray-400 text-[10px]">{contacts[0].phone} &bull; {contacts[0].relationship}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Threat Logs */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FaExclamationTriangle className="text-amber-500 animate-pulse" />
                Recent Alerts Log
              </h3>
              <Link to="/alerts" className="text-[10px] text-red-500 font-bold hover:underline">
                View All
              </Link>
            </div>

            {alerts.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-4 text-center">No security alerts logged yet.</p>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="bg-safety-bg/40 border border-safety-border rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{alert.threatLevel} Alert</span>
                      <span className="text-[10px] text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{alert.notes || 'No extra notes.'}</p>
                    <span className="bg-safety-border text-gray-300 text-[9px] px-2 py-0.5 rounded-full font-semibold">
                      {alert.status}
                    </span>
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
