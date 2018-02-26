const express = require('express');

const router = express.Router();
const journal = require('./journal');
const money = require('./money');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET', 'PUT, POST, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Для проверки токена
router.use((req, res, next) => {
  // if (req.headers['xxx-token']) {
  next();
  // } else res.status(403).json({ error: 'No token' })
});

router.use('/journal', journal);
router.use('/money', money);

module.exports = router;
