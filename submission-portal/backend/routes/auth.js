const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    req.session.userId = user._id;
    res.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (e) {
    res.status(400).json({ success: false, message: 'Registration failed', error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    req.session.userId = user._id;
    res.json({ success: true, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (e) {
    res.status(400).json({ success: false, message: 'Login failed', error: e.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Session check
router.get('/me', async (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  const user = await User.findById(req.session.userId);
  if (!user) return res.json({ loggedIn: false });
  res.json({ loggedIn: true, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
});

module.exports = router; 