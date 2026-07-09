import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaHome } from 'react-icons/fa';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="space-y-2">
        <FaShieldAlt className="text-6xl text-red-500 mx-auto animate-bounce" />
        <h1 className="text-6xl font-black text-white">404</h1>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Requested Area Unsecured</h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
          The safety protocol routing path you requested does not exist or has been shifted. Let's return to protection control.
        </p>
      </div>

      <Link
        to="/"
        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition duration-200 shadow-md"
      >
        <FaHome />
        <span>Return to Home base</span>
      </Link>
    </div>
  );
};
