const { AuthController } = require('../controller/auth.controller');

const router = require('express').Router();

router.post('/signin', AuthController.signin);
router.post('/signup', AuthController.signup);

module.exports = router;