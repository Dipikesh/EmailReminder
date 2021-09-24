const router = require('express').Router();
const { reminderController }   = require('./controller')




router.post('/create', reminderController.create);
router.put('/update', reminderController.update);
router.delete('/remove', reminderController.remove);


module.exports = router;