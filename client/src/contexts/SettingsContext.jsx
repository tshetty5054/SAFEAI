import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : { sms: true, email: true, whatsapp: true, sound: true };
  });
  const [permissions, setPermissions] = useState({
    microphone: false,
    location: false
  });
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'English');

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save Notifications
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Save Language
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Check initial permissions
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' }).then(result => {
        setPermissions(prev => ({ ...prev, microphone: result.state === 'granted' }));
        result.onchange = () => {
          setPermissions(prev => ({ ...prev, microphone: result.state === 'granted' }));
        };
      }).catch(() => {});

      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setPermissions(prev => ({ ...prev, location: result.state === 'granted' }));
        result.onchange = () => {
          setPermissions(prev => ({ ...prev, location: result.state === 'granted' }));
        };
      }).catch(() => {});
    }
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const updateNotifications = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissions(prev => ({ ...prev, microphone: true }));
      return true;
    } catch (err) {
      console.warn('Microphone permission denied', err);
      setPermissions(prev => ({ ...prev, microphone: false }));
      return false;
    }
  };

  const requestLocationPermission = async () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setPermissions(prev => ({ ...prev, location: false }));
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissions(prev => ({ ...prev, location: true }));
          resolve(true);
        },
        () => {
          setPermissions(prev => ({ ...prev, location: false }));
          resolve(false);
        }
      );
    });
  };

  const resetPreferences = () => {
    setTheme('dark');
    setNotifications({ sms: true, email: true, whatsapp: true, sound: true });
    setLanguage('English');
    localStorage.clear();
  };

  return (
    <SettingsContext.Provider value={{
      theme,
      toggleTheme,
      notifications,
      updateNotifications,
      permissions,
      requestMicrophonePermission,
      requestLocationPermission,
      language,
      setLanguage,
      resetPreferences
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
