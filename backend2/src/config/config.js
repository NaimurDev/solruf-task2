require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT || 4002,
  uploadsDir: path.join(__dirname, '../../public/uploads'),
  cleanupInterval: 3600000, // 1 hour
  fileMaxAge: 3600000 // 1 hour
};