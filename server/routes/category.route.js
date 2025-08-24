const router = require('express').Router();
const { CategoryController } = require('../controller/category.controller');

// Middleware to verify if user is authenticated
const { verify, verifyAdmin } = require('../middlewares/auth.middleware');

// Route to create a new category
router.post('/', verify, verifyAdmin, CategoryController.createCategory);
// Route to get all categories
router.get('/', verify, CategoryController.getCategories);
// Route to get a category by ID
router.get('/:id', CategoryController.getCategoryById);
// Route to update a category by ID
router.put('/:id',verify, verifyAdmin, CategoryController.updateCategory);
// Route to delete a category by ID
router.delete('/:id',verify, verifyAdmin, CategoryController.deleteCategory);

module.exports = router;