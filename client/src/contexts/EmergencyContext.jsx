import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { calculateDistance } from '../utils/helpers';

const EmergencyContext = createContext();

export const useEmergency = () => useContext(EmergencyContext);

const API_URL = 'http://localhost:5000/api';

export const EmergencyProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [safetyMode, setSafetyMode] = useState(() => {
    const saved = localStorage.getItem('safety_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [contacts, setContacts] = useState([]);
  const [unsafeZones, setUnsafeZones] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [location, setLocation] = useState({
    lat: 12.9716, // Default Bangalore
    lng: 77.5946,
    accuracy: null,
    timestamp: new Date().toLocaleTimeString(),
    speed: 0
  });

  const [currentZoneAlert, setCurrentZoneAlert] = useState(null); // Active geofence violation popup trigger
  const [isLoading, setIsLoading] = useState(false);
  const [activeSOS, setActiveSOS] = useState(false);

  // Sync safety mode in storage
  useEffect(() => {
    localStorage.setItem('safety_mode', JSON.stringify(safetyMode));
  }, [safetyMode]);

  // Fetch Contacts
  const fetchContacts = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${API_URL}/contacts?userId=${currentUser.uid}`);
      if (res.data.status === 'success') {
        setContacts(res.data.data);
      }
    } catch (err) {
      console.warn('Backend contacts fetch failed, loading mock local storage');
      const local = localStorage.getItem(`mock_contacts_${currentUser.uid}`);
      setContacts(local ? JSON.parse(local) : []);
    }
  }, [currentUser]);

  // Add Contact
  const addContact = async (contactData) => {
    if (!currentUser) return;
    try {
      const res = await axios.post(`${API_URL}/contacts`, { ...contactData, userId: currentUser.uid });
      if (res.data.status === 'success') {
        setContacts(prev => [...prev, res.data.data]);
        return res.data.data;
      }
    } catch (err) {
      const id = 'contact_' + Math.random().toString(36).substr(2, 9);
      const newContact = { id, userId: currentUser.uid, ...contactData, createdAt: new Date().toISOString() };
      const updated = [...contacts, newContact];
      setContacts(updated);
      localStorage.setItem(`mock_contacts_${currentUser.uid}`, JSON.stringify(updated));
      return newContact;
    }
  };

  // Edit Contact
  const editContact = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/contacts/${id}`, updatedData);
      if (res.data.status === 'success') {
        setContacts(prev => prev.map(c => c.id === id ? res.data.data : c));
      }
    } catch (err) {
      const updated = contacts.map(c => c.id === id ? { ...c, ...updatedData } : c);
      setContacts(updated);
      if (currentUser) {
        localStorage.setItem(`mock_contacts_${currentUser.uid}`, JSON.stringify(updated));
      }
    }
  };

  // Delete Contact
  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/contacts/${id}`);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      if (currentUser) {
        localStorage.setItem(`mock_contacts_${currentUser.uid}`, JSON.stringify(updated));
      }
    }
  };

  // Fetch Geofences / Unsafe Zones
  const fetchUnsafeZones = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${API_URL}/unsafezones?userId=${currentUser.uid}`);
      if (res.data.status === 'success') {
        setUnsafeZones(res.data.data);
      }
    } catch (err) {
      console.warn('Backend unsafezones fetch failed, loading mock local storage');
      const local = localStorage.getItem(`mock_zones_${currentUser.uid}`);
      setUnsafeZones(local ? JSON.parse(local) : [
        { id: 'zone_demo1', name: 'Alleyway 42 (Demo)', lat: 12.973, lng: 77.595, radius: 150, threatLevel: 'High' }
      ]);
    }
  }, [currentUser]);

  // Add Unsafe Zone
  const addUnsafeZone = async (zoneData) => {
    if (!currentUser) return;
    try {
      const res = await axios.post(`${API_URL}/unsafezones`, { ...zoneData, userId: currentUser.uid });
      if (res.data.status === 'success') {
        setUnsafeZones(prev => [...prev, res.data.data]);
        return res.data.data;
      }
    } catch (err) {
      const id = 'zone_' + Math.random().toString(36).substr(2, 9);
      const newZone = { id, userId: currentUser.uid, ...zoneData, createdAt: new Date().toISOString() };
      const updated = [...unsafeZones, newZone];
      setUnsafeZones(updated);
      localStorage.setItem(`mock_zones_${currentUser.uid}`, JSON.stringify(updated));
      return newZone;
    }
  };

  // Delete Unsafe Zone
  const deleteUnsafeZone = async (id) => {
    try {
      await axios.delete(`${API_URL}/unsafezones/${id}`);
      setUnsafeZones(prev => prev.filter(z => z.id !== id));
    } catch (err) {
      const updated = unsafeZones.filter(z => z.id !== id);
      setUnsafeZones(updated);
      if (currentUser) {
        localStorage.setItem(`mock_zones_${currentUser.uid}`, JSON.stringify(updated));
      }
    }
  };

  // Fetch Alert History
  const fetchAlerts = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${API_URL}/alerts?userId=${currentUser.uid}`);
      if (res.data.status === 'success') {
        setAlerts(res.data.data);
      }
    } catch (err) {
      const local = localStorage.getItem(`mock_alerts_${currentUser.uid}`);
      setAlerts(local ? JSON.parse(local) : []);
    }
  }, [currentUser]);

  // Create Emergency Alert
  const createAlert = useCallback(async (alertDetails) => {
    if (!currentUser) return;
    const details = {
      userId: currentUser.uid,
      userName: currentUser.fullName || 'Anonymous User',
      location: `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`,
      lat: location.lat,
      lng: location.lng,
      ...alertDetails
    };

    try {
      const res = await axios.post(`${API_URL}/alerts`, details);
      if (res.data.status === 'success') {
        setAlerts(prev => [res.data.data, ...prev]);
        // Trigger vibration simulation (haptics)
        if (navigator.vibrate) {
          navigator.vibrate([500, 200, 500, 200, 500]);
        }
        return res.data.data;
      }
    } catch (err) {
      const id = 'alert_' + Math.random().toString(36).substr(2, 9);
      const now = new Date();
      const mockAlert = {
        id,
        ...details,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        createdAt: now.toISOString()
      };
      const updated = [mockAlert, ...alerts];
      setAlerts(updated);
      localStorage.setItem(`mock_alerts_${currentUser.uid}`, JSON.stringify(updated));
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500]);
      }
      return mockAlert;
    }
  }, [currentUser, location, alerts]);

  // Update Location continuously
  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            speed: pos.coords.speed || 0,
            timestamp: new Date().toLocaleTimeString()
          };
          setLocation(newLoc);
        },
        (err) => {
          console.warn('Geolocation watching error:', err.message);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Monitor location entry to Unsafe Zones
  useEffect(() => {
    if (unsafeZones.length === 0 || !location.lat) return;

    let enteredZone = null;
    for (const zone of unsafeZones) {
      const dist = calculateDistance(location.lat, location.lng, zone.lat, zone.lng);
      if (dist <= zone.radius) {
        enteredZone = zone;
        break;
      }
    }

    if (enteredZone) {
      // If user wasn't flagged for this zone yet, trigger warning
      if (!currentZoneAlert || currentZoneAlert.id !== enteredZone.id) {
        setCurrentZoneAlert(enteredZone);
        
        // Sound warning alert
        if (typeof Audio !== 'undefined') {
          const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        }

        // Generate auto alert
        createAlert({
          threatLevel: enteredZone.threatLevel,
          threatConfidence: 80,
          notes: `AUTOMATED SYSTEM: User entered Geofenced Unsafe Zone: "${enteredZone.name}".`
        });
      }
    } else {
      setCurrentZoneAlert(null);
    }
  }, [location, unsafeZones, currentZoneAlert, createAlert]);

  // Load all initial user data on login
  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      Promise.all([fetchContacts(), fetchUnsafeZones(), fetchAlerts()])
        .finally(() => setIsLoading(false));
    } else {
      setContacts([]);
      setUnsafeZones([]);
      setAlerts([]);
    }
  }, [currentUser, fetchContacts, fetchUnsafeZones, fetchAlerts]);

  return (
    <EmergencyContext.Provider value={{
      safetyMode,
      setSafetyMode,
      contacts,
      addContact,
      editContact,
      deleteContact,
      unsafeZones,
      addUnsafeZone,
      deleteUnsafeZone,
      alerts,
      createAlert,
      location,
      setLocation, // Allow mock location setting
      currentZoneAlert,
      setCurrentZoneAlert,
      isLoading,
      activeSOS,
      setActiveSOS
    }}>
      {children}
    </EmergencyContext.Provider>
  );
};
