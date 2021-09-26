const router = require('express').Router();
const { reminderController } = require('./controller')
const valMiddleware = require('./middleware/userVal.middleware.js')




router.post('/create',valMiddleware.userData, reminderController.create);
router.post('/update', reminderController.update);
router.delete('/remove', reminderController.remove);


module.exports = router;