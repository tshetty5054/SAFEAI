import React from 'react';
import { FaExclamationTriangle, FaSync } from 'react-icons/fa';

export const OfflinePage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="space-y-2">
        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto animate-pulse" />
        <h1 className="text-2xl font-black text-white">System Offline</h1>
        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
          SAFEAI has detected that your device currently has no network capabilities. Local SOS alarms remain operable.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition duration-200 shadow-md"
      >
        <FaSync className="animate-spin" />
        <span>Recheck Connection</span>
      </button>
    </div>
  );
};
