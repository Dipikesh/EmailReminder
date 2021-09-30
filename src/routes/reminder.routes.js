const router = require('express').Router();
const { reminderController } = require('../controller')
const valMiddleware = require('../middleware/userVal.middleware.js')



// router.get('/', );
router.post('/create',valMiddleware.userData, reminderController.create);
router.post('/update',valMiddleware.userPrevData, reminderController.update);
router.delete('/remove', reminderController.remove);


module.exports = router;