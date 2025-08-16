const router = require('express').Router();
const  ProductController  = require('../controller/product.controller');

const { verify, verifyAdmin } = require('../middlewares/auth.middleware');

// Route to create a new product
router.post('/', verify, ProductController.create);
// Route to get all products
router.get('/', verify, ProductController.getAll);
// Route to get a product by ID
router.get('/:id', verify, ProductController.getById);
// Route to update a product by ID
router.put('/:id', verify, ProductController.update);
// Route to delete a product by ID
router.delete('/:id', verify, ProductController.delete);
// Route to toggle product availability
router.patch('/:id/availability', verify, ProductController.toggleAvailability);
// Route to get product by category ID
router.get('/category/:id', verify, ProductController.getByCategory);
// Route to get rental products
router.get('/rental/get', verify, ProductController.getRentalProducts);
module.exports = router;
