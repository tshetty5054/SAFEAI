import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaBars, FaTimes, FaDownload } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-safety-bg text-safety-text">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-safety-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-white">
              <FaShieldAlt className="text-red-500 text-2xl animate-pulse" />
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                SAFEAI
              </span>
            </Link>

            {/* Desktop Navbar Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-300 hover:text-white text-sm font-medium transition duration-200">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-white text-sm font-medium transition duration-200">About System</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white text-sm font-medium transition duration-200">Contact Us</Link>
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-bold transition duration-200 shadow-md">
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white text-sm font-medium transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition duration-200">Login</Link>
                  <Link to="/register" className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-bold transition duration-200 shadow-md">
                    Register Free
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none p-2"
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-safety-card border-b border-safety-border py-4 px-6 space-y-3">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white text-sm font-medium"
            >
              About System
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white text-sm font-medium"
            >
              Contact Us
            </Link>
            <hr className="border-safety-border" />
            {currentUser ? (
              <div className="space-y-2">
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-red-500 hover:bg-red-600 text-white text-xs py-2.5 rounded-lg font-bold"
                >
                  Go to Dashboard
                </Link>
                <button 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-center text-gray-400 hover:text-white text-sm py-2.5 block"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-gray-300 border border-safety-border hover:bg-safety-border text-xs py-2 rounded-lg"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-red-500 hover:bg-red-600 text-white text-xs py-2 rounded-lg font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-safety-bg border-t border-safety-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-400 flex items-center justify-center gap-1">
            <FaShieldAlt className="text-red-500" />
            SAFEAI Personal Safety System &copy; {new Date().getFullYear()}
          </p>
          <p>Patented personal security technologies. Final year engineering project viva submission.</p>
        </div>
      </footer>
    </div>
  );
};
