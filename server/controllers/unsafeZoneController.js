const { db, isMock, mockDb } = require('../config/db');

// Get all unsafe zones
exports.getUnsafeZones = async (req, res, next) => {
  try {
    const { userId } = req.query;
    
    if (isMock) {
      const zones = Object.values(mockDb.unsafeZones).filter(z => !userId || z.userId === userId);
      return res.json({ status: 'success', data: zones });
    }

    let query = db.collection('UnsafeZones');
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    const snapshot = await query.get();
    const zones = [];
    snapshot.forEach(doc => {
      zones.push({ id: doc.id, ...doc.data() });
    });
    res.json({ status: 'success', data: zones });
  } catch (error) {
    next(error);
  }
};

// Create a new unsafe zone
exports.createUnsafeZone = async (req, res, next) => {
  try {
    const { userId, name, lat, lng, radius, threatLevel } = req.body;
    if (!userId || !name || lat === undefined || lng === undefined || !radius) {
      return res.status(400).json({ status: 'error', message: 'userId, name, lat, lng, and radius are required' });
    }

    const zoneData = {
      userId,
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radius: parseFloat(radius),
      threatLevel: threatLevel || 'High',
      createdAt: new Date().toISOString()
    };

    if (isMock) {
      const id = 'zone_' + Math.random().toString(36).substr(2, 9);
      zoneData.id = id;
      mockDb.unsafeZones[id] = zoneData;
      return res.status(201).json({ status: 'success', data: zoneData });
    }

    const docRef = await db.collection('UnsafeZones').add(zoneData);
    res.status(201).json({ status: 'success', data: { id: docRef.id, ...zoneData } });
  } catch (error) {
    next(error);
  }
};

// Delete unsafe zone
exports.deleteUnsafeZone = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMock) {
      if (!mockDb.unsafeZones[id]) {
        return res.status(404).json({ status: 'error', message: 'Zone not found' });
      }
      delete mockDb.unsafeZones[id];
      return res.json({ status: 'success', message: 'Zone deleted successfully' });
    }

    await db.collection('UnsafeZones').doc(id).delete();
    res.json({ status: 'success', message: 'Zone deleted successfully' });
  } catch (error) {
    next(error);
  }
};
