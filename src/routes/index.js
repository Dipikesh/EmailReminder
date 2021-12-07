const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const reminder = require('./reminder.routes');


router.use('/api/auth', require('./auth.routes'));
router.use('/api/reminder', authMiddleware.authenticate, reminder);
router.use('/', require('./static.routes'));

module.exports = router;