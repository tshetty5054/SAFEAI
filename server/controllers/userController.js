const { db, isMock, mockDb } = require('../config/db');

// Get User Profile
exports.getProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (isMock) {
      const user = mockDb.users[userId] || {
        uid: userId,
        fullName: 'Demo User',
        email: 'demo@safeai.com',
        phone: '+15550199',
        gender: 'Other',
        emergencyContactName: 'John Doe',
        emergencyContactNumber: '+15550188',
        relationship: 'Sibling',
        photoURL: ''
      };
      return res.json({ status: 'success', data: user });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', data: userDoc.data() });
  } catch (error) {
    next(error);
  }
};

// Update User Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (isMock) {
      mockDb.users[userId] = {
        ...(mockDb.users[userId] || {}),
        ...updateData,
        uid: userId
      };
      return res.json({ status: 'success', data: mockDb.users[userId] });
    }

    const userRef = db.collection('users').doc(userId);
    await userRef.set(updateData, { merge: true });
    const updated = await userRef.get();
    res.json({ status: 'success', data: updated.data() });
  } catch (error) {
    next(error);
  }
};
