const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const getJwtSecret = () => {
  if (
    config.nodeEnv === 'production' &&
    (!config.jwtSecret || config.jwtSecret === 'your_secret_key' || config.jwtSecret === 'your_super_secret_jwt_key_change_this_in_production')
  ) {
    throw new Error('JWT secret is not securely configured for production');
  }
  return config.jwtSecret;
};

// Register user
exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: 'Email, password, and name are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({
      email,
      password,
      name,
    });

    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: config.jwtExpiresIn });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, getJwtSecret(), { expiresIn: config.jwtExpiresIn });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        settings: user.settings,
      },
    });
  } catch (error) {
    next(error);
  }
};
