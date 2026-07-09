import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, FaMicrophone, FaMapMarkerAlt, FaFileAudio, 
  FaUserFriends, FaExclamationTriangle, FaDownload, FaChartLine, FaArrowRight 
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage = () => {
  const { currentUser } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Monitor PWA Install prompt trigger
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('[SAFEAI] PWA install accepted by user.');
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const faqs = [
    {
      q: "What is SAFEAI - Personal Safety Companion?",
      a: "SAFEAI is a patented, intelligent safety application designed to act as an active guardian. It continuously monitors voice keywords, unsafe geofences, and manual SOS triggers to provide immediate, automated alerts, audio evidence logs, and dispatching to emergency services."
    },
    {
      q: "How does the Voice Assistant command trigger work?",
      a: "When Safety Mode is enabled, the app uses the Web Speech API to listen in the background. If you say a key emergency phrase like 'Help Me', 'SOS', or 'Emergency', the app immediately logs your GPS, records surrounding audio as evidence, and warns contacts."
    },
    {
      q: "What are Unsafe Zones (Geofencing)?",
      a: "Unsafe Zones are circular boundaries created by users on their maps (e.g. dark alleys or high-crime areas). If you enter one of these boundaries, the app increases your threat level, alerts you via sound/vibration, and logs a defensive warning."
    },
    {
      q: "Is it really running offline?",
      a: "Yes. As a Progressive Web Application (PWA), SAFEAI caches core pages and code, meaning that even if you completely lose cellular data, the app will open and you can activate local alarms, timers, and store recordings in queue."
    }
  ];

  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <div className="bg-safety-bg text-safety-text">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-safety-bg to-safety-bg">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2e4c11_1px,transparent_1px),linear-gradient(to_bottom,#1f2e4c11_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/30 border border-red-500/30 text-red-500 text-xs font-bold tracking-widest uppercase animate-pulse">
            <FaShieldAlt /> Patented Personal Safety Network
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Your Intelligent Personal Safety <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">Companion</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto font-medium">
            Active guard protection combining voice trigger recognition, geofencing coordinates, audio recording verification, and intelligent automated emergency dispatches.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {currentUser ? (
              <Link 
                to="/dashboard" 
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition duration-200 shadow-lg flex items-center gap-2"
              >
                Go to Dashboard <FaArrowRight />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition duration-200 shadow-lg"
                >
                  Get Protected Now
                </Link>
                <Link 
                  to="/login" 
                  className="bg-safety-card border border-safety-border hover:bg-safety-border text-white font-bold px-8 py-3.5 rounded-xl text-sm transition duration-200"
                >
                  Access Account
                </Link>
              </>
            )}

            {isInstallable && (
              <button 
                onClick={handleInstallApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition duration-200 flex items-center gap-2 shadow-lg"
              >
                <FaDownload /> Install App (PWA)
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Safety Statistics Banner */}
      <section className="py-12 border-y border-safety-border bg-safety-card/25">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">5s</p>
            <p className="text-xs text-gray-500 uppercase mt-1">SOS Hold Countdown</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-red-500">100%</p>
            <p className="text-xs text-gray-500 uppercase mt-1">Local Mock Encrypted</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">0s</p>
            <p className="text-xs text-gray-500 uppercase mt-1">Voice Activation Latency</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-500">Offline</p>
            <p className="text-xs text-gray-500 uppercase mt-1">PWA Caching Capability</p>
          </div>
        </div>
      </section>

      {/* 3. Core Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl font-bold text-white">Advanced System Capabilities</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Intelligent sensors and Web APIs work in tandem to monitor, alert, and protect you during critical incidents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel border-safety-border p-8 rounded-2xl space-y-4 hover:border-red-500/30 transition duration-300">
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl w-fit">
              <FaMicrophone size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Voice Command Assistant</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Actively processes environmental speech for key terms like "SOS" or "Help Me" to trigger Safety Mode and alert contacts completely hands-free.
            </p>
          </div>

          <div className="glass-panel border-safety-border p-8 rounded-2xl space-y-4 hover:border-blue-500/30 transition duration-300">
            <div className="bg-blue-500/10 text-blue-500 p-4 rounded-xl w-fit">
              <FaMapMarkerAlt size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Geofencing & Unsafe Zones</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Designate dangerous boundaries on the interactive map. When you cross them, alarms trigger, threat meters escalate, and alerts log immediately.
            </p>
          </div>

          <div className="glass-panel border-safety-border p-8 rounded-2xl space-y-4 hover:border-purple-500/30 transition duration-300">
            <div className="bg-purple-500/10 text-purple-500 p-4 rounded-xl w-fit">
              <FaFileAudio size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Audio Evidence Capture</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Automatically captures high-fidelity audio logs during emergency incidents, storing metadata for legal compliance or contact reviews.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Project Overview */}
      <section className="py-20 bg-safety-card/20 border-y border-safety-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Patented Safety Companion</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              SAFEAI is developed as a final-year engineering design combining sensory Web API integrations. Unlike standard safety apps that rely solely on sending SMS link updates, SAFEAI implements a rule-based AI Threat Confidence Engine.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              By assessing variables such as night time status, user speed, and geofence locations, the system updates active monitoring thresholds continuously.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <FaChartLine className="text-red-500" />
                Real-Time Threat Score
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <FaUserFriends className="text-emerald-500" />
                Trusted Contacts Notification
              </div>
            </div>
          </div>
          <div className="glass-panel border-safety-border p-8 rounded-2xl flex flex-col justify-center space-y-6 max-w-md mx-auto">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Calculated Indicators</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-1">
                  <span>Voice Trigger Alert</span>
                  <span>+30%</span>
                </div>
                <div className="h-2 bg-safety-bg rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-1">
                  <span>Geofence Boundary breach</span>
                  <span>+40%</span>
                </div>
                <div className="h-2 bg-safety-bg rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-white mb-1">
                  <span>SOS Countdown Activation</span>
                  <span>+55%</span>
                </div>
                <div className="h-2 bg-safety-bg rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm">Everything you need to know about the SAFEAI platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-panel border-safety-border rounded-xl overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                className="w-full text-left p-5 text-sm font-semibold text-white flex justify-between items-center hover:bg-safety-card/40 transition"
              >
                <span>{faq.q}</span>
                <span className="text-red-500 font-bold">{faqOpen === index ? '−' : '+'}</span>
              </button>
              {faqOpen === index && (
                <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-safety-border/30 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
