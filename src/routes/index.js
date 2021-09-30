const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/reminder', require('./reminder.routes'));

module.exports = router;