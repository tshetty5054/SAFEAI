const { db, isMock, mockDb } = require('../config/db');

// Get all contacts for a user
exports.getContacts = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ status: 'error', message: 'userId is required' });
    }

    if (isMock) {
      const userContacts = Object.values(mockDb.contacts).filter(c => c.userId === userId);
      return res.json({ status: 'success', data: userContacts });
    }

    const snapshot = await db.collection('EmergencyContacts')
      .where('userId', '==', userId)
      .get();
    
    const contacts = [];
    snapshot.forEach(doc => {
      contacts.push({ id: doc.id, ...doc.data() });
    });
    res.json({ status: 'success', data: contacts });
  } catch (error) {
    next(error);
  }
};

// Create a new contact
exports.createContact = async (req, res, next) => {
  try {
    const { userId, name, relationship, phone, email, priority } = req.body;
    if (!userId || !name || !phone) {
      return res.status(400).json({ status: 'error', message: 'userId, name, and phone are required' });
    }

    const contactData = {
      userId,
      name,
      relationship: relationship || '',
      phone,
      email: email || '',
      priority: priority || 'Secondary',
      createdAt: new Date().toISOString()
    };

    if (isMock) {
      const id = 'contact_' + Math.random().toString(36).substr(2, 9);
      contactData.id = id;
      mockDb.contacts[id] = contactData;
      return res.status(201).json({ status: 'success', data: contactData });
    }

    const docRef = await db.collection('EmergencyContacts').add(contactData);
    res.status(201).json({ status: 'success', data: { id: docRef.id, ...contactData } });
  } catch (error) {
    next(error);
  }
};

// Update contact
exports.updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isMock) {
      if (!mockDb.contacts[id]) {
        return res.status(404).json({ status: 'error', message: 'Contact not found' });
      }
      mockDb.contacts[id] = { ...mockDb.contacts[id], ...updateData };
      return res.json({ status: 'success', data: mockDb.contacts[id] });
    }

    const contactRef = db.collection('EmergencyContacts').doc(id);
    await contactRef.update(updateData);
    const updated = await contactRef.get();
    res.json({ status: 'success', data: { id, ...updated.data() } });
  } catch (error) {
    next(error);
  }
};

// Delete contact
exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMock) {
      if (!mockDb.contacts[id]) {
        return res.status(404).json({ status: 'error', message: 'Contact not found' });
      }
      delete mockDb.contacts[id];
      return res.json({ status: 'success', message: 'Contact deleted successfully' });
    }

    await db.collection('EmergencyContacts').doc(id).delete();
    res.json({ status: 'success', message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};
