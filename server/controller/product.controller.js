const { Product, Category } = require('../models');

const ProductController = {
    // Create a new product
    async create(req, res) {
        try {
            const { categoryId, ...productData } = req.body;
            
            // Verify category exists
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }

            // Validate rental fields if product can be rented
            if (productData.canBeRented) {
                if (!productData.rentalPricePerDay || !productData.minRentalDays) {
                    return res.status(400).json({ 
                        error: 'Rental products require rentalPricePerDay and minRentalDays' 
                    });
                }
            } else {
                // Clear rental fields if product can't be rented
                productData.rentalPricePerDay = null;
                productData.rentalDeposit = null;
                productData.minRentalDays = null;
                productData.maxRentalDays = null;
            }

            const product = await Product.create({
                ...productData,
                categoryId
            });

            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all products
    async getAll(req, res) {
        try {
            const { rentalOnly } = req.query;
            let where = {};
            
            if (rentalOnly === 'true') {
                where.canBeRented = true;
            }

            const products = await Product.findAll({
                where,
                include: [{
                    model: Category,
                    attributes: ['id', 'name']
                }]
            });
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get product by ID
    async getById(req, res) {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [{
                    model: Category,
                    attributes: ['id', 'name']
                }]
            });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update product
    async update(req, res) {
        try {
            const { id } = req.params;
            const { categoryId, ...productData } = req.body;

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Verify category exists if being updated
            if (categoryId) {
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    return res.status(404).json({ error: 'Category not found' });
                }
                productData.categoryId = categoryId;
            }

            // Handle rental fields update
            if (productData.canBeRented === false) {
                productData.rentalPricePerDay = null;
                productData.rentalDeposit = null;
                productData.minRentalDays = null;
                productData.maxRentalDays = null;
            } else if (productData.canBeRented === true) {
                if (!productData.rentalPricePerDay || !productData.minRentalDays) {
                    return res.status(400).json({ 
                        error: 'Rental products require rentalPricePerDay and minRentalDays' 
                    });
                }
            }

            await product.update(productData);
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete product
    async delete(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await product.destroy();
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get products by category
    async getByCategory(req, res) {
        try {
            const { id } = req.params;
            const { rentalOnly } = req.query;
            
            let where = { categoryId: id };
            if (rentalOnly === 'true') {
                where.canBeRented = true;
            }

            const products = await Product.findAll({
                where,
                include: [{
                    model: Category,
                    attributes: ['id', 'name']
                }]
            });

            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Toggle product availability
    async toggleAvailability(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await product.update({ isAvailable: !product.isAvailable });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getRentalProducts(req, res) {
        try {
            const { minPrice, maxPrice, categoryId } = req.query;
            
            // Base filter for rental products
            const where = {
                canBeRented: true,
                isAvailable: true
            };
            
            // Add optional filters
            if (minPrice) {
                where.rentalPricePerDay = {
                    [Op.gte]: parseFloat(minPrice)
                };
            }
            
            if (maxPrice) {
                where.rentalPricePerDay = {
                    ...where.rentalPricePerDay,
                    [Op.lte]: parseFloat(maxPrice)
                };
            }
            
            if (categoryId) {
                where.categoryId = categoryId;
            }
            
            const rentalProducts = await Product.findAll({
                where,
                include: [{
                    model: Category,
                    attributes: ['id', 'name']
                }],
                order: [['rentalPricePerDay', 'ASC']] // Sort by rental price ascending
            });
            
            res.json(rentalProducts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

};

module.exports = ProductController;