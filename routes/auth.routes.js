const express = require('express');
const router = express.Router();
const User = require('../models/user.model');


// Register sahifasi
router.get('/register', (req,res) => {
  res.render('auth/register');
});

// Register post
router.post('/register', async (req,res) => {
  const { username, password } = req.body;
  try{
    const user = new User({username, password});
    await user.save();
    req.session.user = user;
    res.redirect('/posters');
  } catch(err) {
    res.redirect('/register');
  }
});

// Login sahifasi
router.get('/login', (req,res) => {
  res.render('/auth/login');
});

// Login post
router.post('/login', async (req,res) => {
  const { username, password } = req.body;
  try{
    const user = await User.findOne({username});
    if(user && user.comparePassword(password)) {
      req.session.user = user;
      res.redirect('/posters');
    } else {
      res.redirect('/login');
    }
  } catch(err) {
    res.redirect('/login')
  }
});

// Logout
router.post('/logout', (req,res) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
});

module.exports = router;
