const router = require('express').Router();
const { authController } = require('../controller');
const authMiddleware = require('../middleware/auth.middleware')

router.post('/register', authMiddleware.validateRegister, authController.register);
router.post('/cnfrm-register',authMiddleware.validateCnfrmRegister, authController.cnfrmRegister)
router.post('/login',authMiddleware.validateLogin, authController.login);

module.exports = router;

