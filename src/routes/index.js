const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')
const reminder = require('./reminder.routes')

router.use('/auth', require('./auth.routes'));
router.use('/reminder' ,authMiddleware.authenticate,reminder);

module.exports = router;