const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign({ 
    id: user.id, 
    email: user.email,
    role: user.role 
  }, JWT_SECRET, {
    expiresIn: '24h', // Increased for better UX
  });
}

const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role
      } 
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const signup = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required' });
    }

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      role: role || 'user'
    });

    const token = generateToken(newUser);

    res.status(201).json({ 
      token, 
      user: { 
        id: newUser.id, 
        username: newUser.username, 
        email: newUser.email,
        role: newUser.role
      } 
    });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.json({ 
      user: req.user 
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports.AuthController = {
  signin,
  signup,
  getCurrentUser
};