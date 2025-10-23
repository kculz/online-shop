const { AuthController } = require('../controller/auth.controller');
const { verify } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.post('/signin', AuthController.signin);
router.post('/signup', AuthController.signup);
// Add this route to verify tokens
router.get('/verify', verify, (req, res) => {
  res.json({ 
    user: req.user,
    message: 'Token is valid'
  });
});

// Add this route to get current user profile
router.get('/me', verify, AuthController.getCurrentUser);

module.exports = router;