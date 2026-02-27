require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/budget-app',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  nodeEnv: process.env.NODE_ENV || 'development',
};
