import React from 'react';
import { FaShieldAlt, FaLightbulb, FaInfoCircle, FaFileCode, FaLink } from 'react-icons/fa';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-2">
          <FaShieldAlt className="text-red-500 animate-pulse" />
          About SAFEAI Security System
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Final-Year Engineering Project demonstrating a patented sensory-integrated personal safety architecture.
        </p>
      </div>

      {/* Concept Overview */}
      <section className="glass-panel border-safety-border p-8 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" />
          Patented Sensor-Fusion Philosophy
        </h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          Traditional personal safety applications fail because they require a manual trigger (like typing a PIN or opening an app during an active assault) or trigger false alarms. 
        </p>
        <p className="text-xs text-gray-400 leading-relaxed">
          SAFEAI resolves this by implementing a **passive sensor-fusion layer** using standard Web browser APIs. When Safety Mode is active, it coordinates location data streams, geofenced boundaries, microphone recognition streams, and motion vectors to calculate threat status.
        </p>
      </section>

      {/* Modular Architecture Layout */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white text-center">System Integration Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-safety-card border border-safety-border p-6 rounded-2xl text-center space-y-3">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">1. Sensory Inputs</span>
            <p className="text-xs text-gray-400">
              Web Speech API parses continuous audio keywords, Geolocation tracks coords, and MediaRecorder prepares a recording stream.
            </p>
          </div>
          <div className="bg-safety-card border border-safety-border p-6 rounded-2xl text-center space-y-3">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wide">2. Threat Engine</span>
            <p className="text-xs text-gray-400">
              Assesses night schedules, user movement rates, unsafe zone intersection records, and calculates a percentage threat score.
            </p>
          </div>
          <div className="bg-safety-card border border-safety-border p-6 rounded-2xl text-center space-y-3">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wide">3. Action Protocols</span>
            <p className="text-xs text-gray-400">
              Launches local sound sirens, files log alerts to Firestore, records audio evidence, and initiates mock SMS notifications.
            </p>
          </div>
        </div>
      </section>

      {/* Engineering Project Details */}
      <section className="glass-panel border-safety-border p-8 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FaInfoCircle className="text-blue-500" />
          Technical Execution Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400 leading-relaxed">
          <div>
            <strong className="text-white">Frontend Web Client:</strong>
            <p>Vite + React (JavaScript ES6), Tailwind CSS framework. Built with responsive viewport grids for mobile layouts.</p>
          </div>
          <div>
            <strong className="text-white">Backend APIs:</strong>
            <p>Node.js & Express.js. Implements endpoints matching client data models with dynamic database fallbacks.</p>
          </div>
          <div>
            <strong className="text-white">PWA Features:</strong>
            <p>Custom Service Worker, dynamic cache manifest, install triggers, standalone manifest navigation, and offline routes.</p>
          </div>
          <div>
            <strong className="text-white">API Mock Fallbacks:</strong>
            <p>Standalone local simulation if keys/credentials are empty, preserving functional presentations and viva demonstrations.</p>
          </div>
        </div>
      </section>

      {/* GitHub Section */}
      <div className="text-center">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-safety-border border border-safety-border hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-xs font-semibold transition"
        >
          <FaFileCode />
          <span>View Source Code on GitHub</span>
        </a>
      </div>
    </div>
  );
};
