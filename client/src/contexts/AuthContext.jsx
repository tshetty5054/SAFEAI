import React, { createContext, useContext, useState, useEffect } from 'react';
import { isMock, auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as fbUpdateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionPersist, setSessionPersist] = useState(() => {
    const saved = localStorage.getItem('session_persist');
    return saved ? JSON.parse(saved) : true;
  });

  // Keep session persistence setting synced
  useEffect(() => {
    localStorage.setItem('session_persist', JSON.stringify(sessionPersist));
  }, [sessionPersist]);

  // Monitor Authentication state
  useEffect(() => {
    if (!isMock && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Get extra user info from Firestore
            const docRef = doc(db, 'Users', user.uid);
            const docSnap = await getDoc(docRef);
            
            let extraData = {};
            if (docSnap.exists()) {
              extraData = docSnap.data();
            }

            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || extraData.fullName,
              ...extraData
            };
            setCurrentUser(userData);

            // Sync with express backend profile
            await axios.put(`${API_URL}/users/${user.uid}`, userData).catch(() => {});
          } catch (err) {
            console.error('Error fetching user metadata from Firestore:', err);
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName
            });
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock Authentication Flow
      const savedUser = localStorage.getItem('mock_user');
      const isRemembered = localStorage.getItem('mock_remember');
      
      if (savedUser && (isRemembered === 'true' || sessionPersist)) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, [sessionPersist]);

  // Register
  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const { email, password, fullName, phone, gender, emergencyContactName, emergencyContactNumber, relationship, photoBase64 } = formData;
      
      let userData = {
        fullName,
        email,
        phone,
        gender,
        emergencyContactName,
        emergencyContactNumber,
        relationship,
        photoURL: photoBase64 || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
        createdAt: new Date().toISOString()
      };

      if (isMock) {
        // Mock User
        const uid = 'user_' + Math.random().toString(36).substr(2, 9);
        userData.uid = uid;
        
        // Save in localStorage mock
        localStorage.setItem('mock_user', JSON.stringify(userData));
        if (sessionPersist) {
          localStorage.setItem('mock_remember', 'true');
        }
        
        // Sync with backend API
        await axios.put(`${API_URL}/users/${uid}`, userData).catch(err => {
          console.warn('Backend sync failed, running standalone client mock:', err.message);
        });

        setCurrentUser(userData);
        setLoading(false);
        return userData;
      } else {
        // Firebase Auth Create User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Set display name
        await fbUpdateProfile(user, { displayName: fullName });

        // Save metadata to Firestore
        userData.uid = user.uid;
        await setDoc(doc(db, 'Users', user.uid), userData);

        // Sync with Express backend
        await axios.put(`${API_URL}/users/${user.uid}`, userData).catch(() => {});

        setCurrentUser({ uid: user.uid, email: user.email, displayName: fullName, ...userData });
        setLoading(false);
        return user;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Login
  const loginUser = async (email, password, rememberMe) => {
    setLoading(true);
    setSessionPersist(rememberMe);
    try {
      if (isMock) {
        // Mock Login
        const storedUser = localStorage.getItem('mock_user');
        
        let userData;
        if (storedUser) {
          userData = JSON.parse(storedUser);
          if (userData.email.toLowerCase() !== email.toLowerCase()) {
            throw new Error('User details do not match the registered user in mock storage.');
          }
        } else {
          // If no user is registered, create a default one for quick access
          userData = {
            uid: 'demo_user',
            fullName: 'Demo Safety User',
            email: email,
            phone: '+919876543210',
            gender: 'Male',
            emergencyContactName: 'Guardian Alert',
            emergencyContactNumber: '+919999988888',
            relationship: 'Parent',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('mock_user', JSON.stringify(userData));
        }

        if (rememberMe) {
          localStorage.setItem('mock_remember', 'true');
        } else {
          localStorage.removeItem('mock_remember');
        }

        // Sync with backend API
        await axios.put(`${API_URL}/users/${userData.uid}`, userData).catch(() => {});

        setCurrentUser(userData);
        setLoading(false);
        return userData;
      } else {
        // Firebase Live Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        return userCredential.user;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Logout
  const logoutUser = async () => {
    setLoading(true);
    try {
      if (isMock) {
        localStorage.removeItem('mock_remember');
        // Do not clear the user profile registration details, just clear auth session
        setCurrentUser(null);
      } else {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update Profile
  const updateUserProfile = async (updates) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const updatedUser = { ...currentUser, ...updates };

      if (isMock) {
        localStorage.setItem('mock_user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);

        // Sync backend
        await axios.put(`${API_URL}/users/${currentUser.uid}`, updatedUser).catch(() => {});
      } else {
        // Save to Firestore
        await setDoc(doc(db, 'Users', currentUser.uid), updates, { merge: true });
        
        if (updates.fullName && auth.currentUser) {
          await fbUpdateProfile(auth.currentUser, { displayName: updates.fullName });
        }
        
        setCurrentUser(updatedUser);

        // Sync backend
        await axios.put(`${API_URL}/users/${currentUser.uid}`, updatedUser).catch(() => {});
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    sessionPersist,
    setSessionPersist,
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    updateProfile: updateUserProfile,
    isMockAuth: isMock
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
