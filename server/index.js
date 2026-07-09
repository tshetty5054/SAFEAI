const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load Config & Mock DB check
const dbService = require('./config/db');

// Root/Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'SAFEAI Personal Safety Companion API Server is running.',
    database: dbService.isMock ? 'Mock In-Memory Storage' : 'Firebase Firestore Live'
  });
});

// Import Routes
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const alertRoutes = require('./routes/alertRoutes');
const unsafeZoneRoutes = require('./routes/unsafeZoneRoutes');

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/unsafezones', unsafeZoneRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong on the server'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[SAFEAI Server] Running on http://localhost:${PORT}`);
  console.log(`[SAFEAI Server] Mode: ${dbService.isMock ? 'MOCK / OFFLINE-READY' : 'FIREBASE ACTIVE'}`);
});
