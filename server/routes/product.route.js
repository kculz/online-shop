const router = require('express').Router();
const productController = require('../controller/product.controller');
const { verify, verifyAdmin } = require('../middlewares/auth.middleware');

// Public routes (no authentication required)
router.get('/', productController.getAll); // GET /api/products
router.get('/:id', productController.getById); // GET /api/products/:id
router.get('/category/:id', productController.getByCategory); // GET /api/products/category/:id
router.get('/rental/available', productController.getRentalProducts); // GET /api/products/rental/available

// Admin-only routes (require authentication and admin privileges)
router.post('/', verify, verifyAdmin, productController.create); // POST /api/products
router.put('/:id', verify, verifyAdmin, productController.update); // PUT /api/products/:id
router.delete('/:id', verify, verifyAdmin, productController.delete); // DELETE /api/products/:id
router.patch('/:id/availability', verify, verifyAdmin, productController.toggleAvailability); // PATCH /api/products/:id/availability

module.exports = router;