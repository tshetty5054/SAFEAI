import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaShieldAlt, FaHome, FaUser, FaAddressBook, FaMapMarkedAlt, 
  FaMicrophone, FaHistory, FaCog, FaLock, FaExclamationTriangle,
  FaBars, FaTimes, FaSignOutAlt, FaBullhorn
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useEmergency } from '../contexts/EmergencyContext';
import { useThreat } from '../contexts/ThreatContext';

export const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const { safetyMode, setSafetyMode, currentZoneAlert, setCurrentZoneAlert } = useEmergency();
  const { threatLevel, threatConfidence, statusColor } = useThreat();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const location = useLocation();
  const navigate = useNavigate();

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'User Profile', path: '/profile', icon: <FaUser /> },
    { name: 'Emergency Contacts', path: '/contacts', icon: <FaAddressBook /> },
    { name: 'Live GPS Map', path: '/tracking', icon: <FaMapMarkedAlt /> },
    { name: 'Unsafe Zones', path: '/unsafezones', icon: <FaExclamationTriangle /> },
    { name: 'Voice Assistant', path: '/voice', icon: <FaMicrophone /> },
    { name: 'Trigger SOS', path: '/sos', icon: <FaBullhorn className="text-red-500" /> },
    { name: 'Alert History', path: '/alerts', icon: <FaHistory /> },
    { name: 'Settings', path: '/settings', icon: <FaCog /> },
    { name: 'Admin Dashboard', path: '/admin', icon: <FaLock /> }
  ];

  return (
    <div className="flex h-screen bg-safety-bg text-safety-text overflow-hidden">
      
      {/* Geofence Breach Warning Popup Modal */}
      {currentZoneAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel border-red-500/40 rounded-2xl p-6 max-w-sm w-full text-center alert-glow-red">
            <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-2">⚠️ Geofence Breach Alert!</h3>
            <p className="text-xs text-gray-300 mb-4">
              You have entered a designated unsafe zone: <strong className="text-red-400">"{currentZoneAlert.name}"</strong>.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSafetyMode(true);
                  setCurrentZoneAlert(null);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs"
              >
                Enable Safety Monitoring
              </button>
              <button
                onClick={() => setCurrentZoneAlert(null)}
                className="w-full bg-safety-border hover:bg-gray-700 text-gray-300 py-2 rounded-xl text-xs"
              >
                Acknowledge Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 glass-panel border-r border-safety-border shrink-0">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-safety-border">
          <FaShieldAlt className="text-red-500 text-2xl animate-pulse" />
          <span className="font-black text-white tracking-widest text-lg">SAFEAI</span>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/20' 
                    : 'text-gray-400 hover:bg-safety-card hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile overview footer inside sidebar */}
        <div className="p-4 border-t border-safety-border bg-safety-card/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <img 
              src={currentUser?.photoURL} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-safety-border shrink-0 object-cover" 
            />
            <div className="truncate text-left">
              <p className="text-xs font-bold text-white truncate">{currentUser?.fullName}</p>
              <p className="text-[10px] text-gray-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition"
            title="Sign Out"
          >
            <FaSignOutAlt size={14} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        
        {/* Top bar header */}
        <header className="h-16 glass-panel border-b border-safety-border flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg"
            >
              <FaBars size={20} />
            </button>
            
            {/* User welcome */}
            <div className="hidden sm:block text-left">
              <h1 className="text-sm font-bold text-white">Welcome, {currentUser?.fullName}!</h1>
              <p className="text-[10px] text-gray-500 font-medium">
                {currentTime.toLocaleDateString()} &bull; {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Quick Stats Widget Panel */}
          <div className="flex items-center gap-4">
            
            {/* Safety Mode Toggle switch */}
            <div className="flex items-center gap-2 bg-safety-card/60 px-3 py-1.5 rounded-xl border border-safety-border">
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Safety Mode</span>
              <button
                onClick={() => setSafetyMode(prev => !prev)}
                className={`relative w-8 h-5 rounded-full transition duration-300 ${safetyMode ? 'bg-emerald-500' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${safetyMode ? 'translate-x-3' : 'translate-x-0'}`}></span>
              </button>
            </div>

            {/* Threat indicator tag */}
            <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-xl font-bold text-[10px] tracking-wider uppercase animate-pulse ${statusColor}`}>
              <span>Threat: {threatLevel} ({threatConfidence}%)</span>
            </div>
          </div>
        </header>

        {/* Dynamic content rendering frame */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-safety-bg/30">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Mobile Overlay Navigation */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop click closer */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setSidebarOpen(false)}
          />
          
          <div className="relative w-64 bg-safety-card border-r border-safety-border flex flex-col h-full z-50">
            <div className="h-16 flex items-center justify-between px-6 border-b border-safety-border">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-red-500 text-2xl" />
                <span className="font-extrabold text-white tracking-widest text-lg">SAFEAI</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:bg-safety-bg hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-safety-border bg-safety-bg/60 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <img 
                  src={currentUser?.photoURL} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-safety-border object-cover" 
                />
                <div className="truncate text-left">
                  <p className="text-xs font-bold text-white truncate">{currentUser?.fullName}</p>
                </div>
              </div>
              <button 
                onClick={() => { handleLogout(); setSidebarOpen(false); }}
                className="text-gray-400 hover:text-red-500"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
