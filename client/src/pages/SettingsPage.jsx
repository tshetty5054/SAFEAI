import React from 'react';
import { 
  FaCog, FaMicrophone, FaMapMarkerAlt, FaBell, FaGlobe, 
  FaEyeSlash, FaUndoAlt, FaShieldAlt 
} from 'react-icons/fa';
import { useSettings } from '../contexts/SettingsContext';
import { useEmergency } from '../contexts/EmergencyContext';

export const SettingsPage = () => {
  const { 
    theme, toggleTheme, notifications, updateNotifications, 
    permissions, requestMicrophonePermission, requestLocationPermission,
    language, setLanguage, resetPreferences
  } = useSettings();

  const { safetyMode, setSafetyMode } = useEmergency();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all preferences? This will log you out of any mock session.")) {
      resetPreferences();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left">
      <div className="flex items-center gap-2">
        <FaCog className="text-red-500 text-xl" />
        <h2 className="text-xl font-extrabold text-white">System Settings</h2>
      </div>

      {/* Grid Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: UI & Theme */}
        <div className="space-y-6">
          
          {/* Theme & Display */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-lg">🌗</span>
              Display & Safety Mode
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center bg-safety-bg/30 p-3 rounded-xl border border-safety-border">
                <div>
                  <p className="font-bold text-white">Active Theme Mode</p>
                  <p className="text-[10px] text-gray-500">Toggle dark slate or clean light mode.</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="bg-safety-border hover:bg-gray-700 text-white font-bold px-4 py-2 rounded-xl text-[10px]"
                >
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>

              <div className="flex justify-between items-center bg-safety-bg/30 p-3 rounded-xl border border-safety-border">
                <div>
                  <p className="font-bold text-white">Sensor Safety Mode</p>
                  <p className="text-[10px] text-gray-500">Enable voice and geofence tracking.</p>
                </div>
                <button
                  onClick={() => setSafetyMode(!safetyMode)}
                  className={`font-bold px-4 py-2 rounded-xl text-[10px] text-white ${safetyMode ? 'bg-emerald-600' : 'bg-gray-700'}`}
                >
                  {safetyMode ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>

          {/* Hardware Device Permissions */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              Hardware Permissions
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-safety-bg/30 p-3 rounded-xl border border-safety-border">
                <div className="flex items-center gap-2">
                  <FaMicrophone className={permissions.microphone ? 'text-red-500 animate-pulse' : 'text-gray-500'} />
                  <div>
                    <p className="font-bold text-white">Microphone Captures</p>
                    <p className="text-[10px] text-gray-500">Required for active voice keywords.</p>
                  </div>
                </div>
                {permissions.microphone ? (
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Granted</span>
                ) : (
                  <button
                    onClick={requestMicrophonePermission}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-4.5 py-1.5 rounded-lg text-[9px]"
                  >
                    Authorize
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center bg-safety-bg/30 p-3 rounded-xl border border-safety-border">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className={permissions.location ? 'text-blue-500 animate-pulse' : 'text-gray-500'} />
                  <div>
                    <p className="font-bold text-white">GPS Geolocation</p>
                    <p className="text-[10px] text-gray-500">Required for active geofences.</p>
                  </div>
                </div>
                {permissions.location ? (
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Granted</span>
                ) : (
                  <button
                    onClick={requestLocationPermission}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-4.5 py-1.5 rounded-lg text-[9px]"
                  >
                    Authorize
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Notifications & Language */}
        <div className="space-y-6">
          
          {/* Notification dispatches */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FaBell className="text-amber-500" />
              Emergency Dispatch Channels
            </h3>

            <div className="space-y-3.5 text-xs text-gray-400">
              <label className="flex items-center justify-between cursor-pointer">
                <span>Dispatch coordinates via simulated SMS</span>
                <input 
                  type="checkbox" 
                  checked={notifications.sms} 
                  onChange={e => updateNotifications('sms', e.target.checked)}
                  className="accent-red-500" 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Dispatch secure packet link via WhatsApp</span>
                <input 
                  type="checkbox" 
                  checked={notifications.whatsapp} 
                  onChange={e => updateNotifications('whatsapp', e.target.checked)}
                  className="accent-red-500" 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Dispatch warning alerts via Email logs</span>
                <input 
                  type="checkbox" 
                  checked={notifications.email} 
                  onChange={e => updateNotifications('email', e.target.checked)}
                  className="accent-red-500" 
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Play acoustic countdown alarms</span>
                <input 
                  type="checkbox" 
                  checked={notifications.sound} 
                  onChange={e => updateNotifications('sound', e.target.checked)}
                  className="accent-red-500" 
                />
              </label>
            </div>
          </div>

          {/* Regional Settings & Reset */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FaGlobe className="text-blue-500" />
              Regional Preferences & Maintenance
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Application Language</span>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="bg-safety-bg border border-safety-border text-white text-[10px] px-3 py-1.5 rounded-xl outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                </select>
              </div>

              <div className="border-t border-safety-border/30 pt-4">
                <button
                  onClick={handleReset}
                  className="w-full bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-900/20 font-bold py-2.5 rounded-xl text-[10px] flex items-center justify-center gap-2 transition"
                >
                  <FaUndoAlt size={10} />
                  <span>Wipe and Reset Preferences</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
