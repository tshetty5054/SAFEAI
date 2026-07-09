const { db, isMock, mockDb } = require('../config/db');

// Populate mockDb.alerts with some seed data for demonstrations
if (isMock && Object.keys(mockDb.alerts).length === 0) {
  const now = new Date();
  const seedAlerts = [
    {
      id: 'alert_1',
      userId: 'demo_user',
      userName: 'Demo User',
      date: now.toISOString().split('T')[0],
      time: '10:15 AM',
      location: '123 Cyber Security Blvd',
      lat: 12.9716,
      lng: 77.5946,
      threatLevel: 'High',
      threatConfidence: 85,
      audioLink: 'https://example.com/recordings/demo1.mp3',
      status: 'Acknowledged',
      notes: 'Voice trigger activated keyword: HELP ME.'
    },
    {
      id: 'alert_2',
      userId: 'demo_user2',
      userName: 'Alice Smith',
      date: new Date(now - 86400000).toISOString().split('T')[0],
      time: '11:30 PM',
      location: 'Unsafe Zone Alpha',
      lat: 12.9816,
      lng: 77.6046,
      threatLevel: 'Critical',
      threatConfidence: 95,
      audioLink: '',
      status: 'Resolved',
      notes: 'User crossed into marked geofenced unsafe zone. Contacts notified.'
    },
    {
      id: 'alert_3',
      userId: 'demo_user',
      userName: 'Demo User',
      date: new Date(now - 172800000).toISOString().split('T')[0],
      time: '02:45 AM',
      location: 'High-Risk Alleyway',
      lat: 12.9616,
      lng: 77.5846,
      threatLevel: 'Medium',
      threatConfidence: 60,
      audioLink: 'https://example.com/recordings/demo3.mp3',
      status: 'Delivered',
      notes: 'SOS Hold button activated for 5 seconds.'
    }
  ];
  seedAlerts.forEach(a => {
    mockDb.alerts[a.id] = a;
  });
}

// Get all alerts (supports queries: userId, status, threatLevel, search, sort, pagination)
exports.getAlerts = async (req, res, next) => {
  try {
    const { userId, status, threatLevel, search, sortBy = 'date', order = 'desc' } = req.query;

    if (isMock) {
      let alertsList = Object.values(mockDb.alerts);

      // Filtering
      if (userId) alertsList = alertsList.filter(a => a.userId === userId);
      if (status) alertsList = alertsList.filter(a => a.status.toLowerCase() === status.toLowerCase());
      if (threatLevel) alertsList = alertsList.filter(a => a.threatLevel.toLowerCase() === threatLevel.toLowerCase());
      
      // Search
      if (search) {
        const query = search.toLowerCase();
        alertsList = alertsList.filter(a => 
          a.userName.toLowerCase().includes(query) || 
          (a.location && a.location.toLowerCase().includes(query)) ||
          (a.notes && a.notes.toLowerCase().includes(query))
        );
      }

      // Sort
      alertsList.sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        if (typeof valA === 'string') {
          return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return order === 'asc' ? valA - valB : valB - valA;
      });

      return res.json({ status: 'success', count: alertsList.length, data: alertsList });
    }

    // Live Firebase Implementation
    let query = db.collection('Alerts');
    if (userId) query = query.where('userId', '==', userId);
    if (status) query = query.where('status', '==', status);
    if (threatLevel) query = query.where('threatLevel', '==', threatLevel);

    const snapshot = await query.get();
    let alertsList = [];
    snapshot.forEach(doc => {
      alertsList.push({ id: doc.id, ...doc.data() });
    });

    // Apply client-side filters for text searches & sorting if needed
    if (search) {
      const q = search.toLowerCase();
      alertsList = alertsList.filter(a => 
        a.userName.toLowerCase().includes(q) ||
        (a.location && a.location.toLowerCase().includes(q)) ||
        (a.notes && a.notes.toLowerCase().includes(q))
      );
    }

    alertsList.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (order === 'desc') {
        return valA > valB ? -1 : 1;
      }
      return valA < valB ? -1 : 1;
    });

    res.json({ status: 'success', count: alertsList.length, data: alertsList });
  } catch (error) {
    next(error);
  }
};

// Create a new emergency alert
exports.createAlert = async (req, res, next) => {
  try {
    const { userId, userName, location, lat, lng, threatLevel, threatConfidence, audioLink, notes } = req.body;
    if (!userId || !userName) {
      return res.status(400).json({ status: 'error', message: 'userId and userName are required' });
    }

    const now = new Date();
    const alertData = {
      userId,
      userName,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: location || 'Unknown Location',
      lat: lat !== undefined ? parseFloat(lat) : 0.0,
      lng: lng !== undefined ? parseFloat(lng) : 0.0,
      threatLevel: threatLevel || 'Medium',
      threatConfidence: threatConfidence || 50,
      audioLink: audioLink || '',
      status: 'Pending',
      notes: notes || '',
      createdAt: now.toISOString()
    };

    if (isMock) {
      const id = 'alert_' + Math.random().toString(36).substr(2, 9);
      alertData.id = id;
      mockDb.alerts[id] = alertData;
      return res.status(201).json({ status: 'success', data: alertData });
    }

    const docRef = await db.collection('Alerts').add(alertData);
    res.status(201).json({ status: 'success', data: { id: docRef.id, ...alertData } });
  } catch (error) {
    next(error);
  }
};

// Update alert status
exports.updateAlertStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ status: 'error', message: 'status is required' });
    }

    const updates = { status };
    if (notes !== undefined) updates.notes = notes;

    if (isMock) {
      if (!mockDb.alerts[id]) {
        return res.status(404).json({ status: 'error', message: 'Alert not found' });
      }
      mockDb.alerts[id] = { ...mockDb.alerts[id], ...updates };
      return res.json({ status: 'success', data: mockDb.alerts[id] });
    }

    const alertRef = db.collection('Alerts').doc(id);
    await alertRef.update(updates);
    const updated = await alertRef.get();
    res.json({ status: 'success', data: { id, ...updated.data() } });
  } catch (error) {
    next(error);
  }
};

// Get stats for Admin Dashboard
exports.getAdminStats = async (req, res, next) => {
  try {
    let totalUsers = 125; // Default demo count
    let totalAlerts = 0;
    let activeUsers = 42;
    let unsafeZonesCount = 5;
    let alertsToday = 0;

    let alertsList = [];
    if (isMock) {
      alertsList = Object.values(mockDb.alerts);
      unsafeZonesCount = Object.keys(mockDb.unsafeZones).length || 3;
    } else {
      const alertsSnapshot = await db.collection('Alerts').get();
      alertsSnapshot.forEach(doc => {
        alertsList.push(doc.data());
      });
      const zonesSnapshot = await db.collection('UnsafeZones').get();
      unsafeZonesCount = zonesSnapshot.size;
    }

    totalAlerts = alertsList.length;
    const todayStr = new Date().toISOString().split('T')[0];
    alertsToday = alertsList.filter(a => a.date === todayStr).length;

    // Distribute levels
    const threatDistribution = {
      Safe: 0,
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };
    alertsList.forEach(a => {
      if (threatDistribution[a.threatLevel] !== undefined) {
        threatDistribution[a.threatLevel]++;
      }
    });

    res.json({
      status: 'success',
      data: {
        totalUsers,
        totalAlerts,
        activeUsers,
        unsafeZonesCount,
        alertsToday,
        threatDistribution,
        recentActivity: alertsList.slice(0, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};
