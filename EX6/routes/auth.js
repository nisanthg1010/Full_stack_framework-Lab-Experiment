const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Home route
router.get('/', (req, res) => {
  res.send('Welcome! Go to /signup or /login to begin.');
});

// Signup form
router.get('/signup', (req, res) => res.render('signup'));

// Signup POST
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  res.redirect('/login');
});

// Login form
router.get('/login', (req, res) => res.render('login'));

// Login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    res.cookie('user', user.username, { maxAge: 3600000 });
    res.redirect('/home');
  } else {
    res.send('Invalid Email or Password.');
  }
});

// Home page
router.get('/home', (req, res) => {
  if (!req.cookies.user) return res.redirect('/login');
  res.render('home', { user: req.cookies.user });
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/login');
});

module.exports = router;
