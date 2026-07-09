let admin;
let db;
let isMock = true;

// Mock database structures for backend demo persistence
const mockDb = {
  users: {},
  contacts: {},
  alerts: {},
  unsafeZones: {}
};

try {
  // Check if Firebase service account or variables are configured
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin = require('firebase-admin');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    db = admin.firestore();
    isMock = false;
    console.log('[SAFEAI Server] Firebase Admin successfully initialized.');
  } else {
    console.log('[SAFEAI Server] No Firebase credentials found. Running in MOCK Mode.');
  }
} catch (error) {
  console.warn('[SAFEAI Server] Error initializing Firebase Admin. Falling back to MOCK mode:', error.message);
}

module.exports = {
  admin,
  db,
  isMock,
  mockDb
};
