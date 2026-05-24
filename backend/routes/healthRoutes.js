const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/health', (req, res) => {
  // mongoose.connection.readyState returns 1 if fully connected
  const isDbConnected = mongoose.connection.readyState === 1;

  const healthData = {
    uptime: process.uptime(), // Seconds since the server process started
    status: isDbConnected ? 'OK' : 'ERROR',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: isDbConnected ? 'connected' : 'disconnected',
    },
    memory: {
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
    }
  };

  // If the database drops, tell the hosting platform the app is struggling
  if (!isDbConnected) {
    return res.status(503).json(healthData); // 503 Service Unavailable
  }

  res.status(200).json(healthData);
});

module.exports = router;