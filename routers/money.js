const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      id: 5
    },
    {
      id: 6
    }
  ]);
});

module.exports = router;
