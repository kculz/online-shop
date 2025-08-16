const { Category } = require('../models');

const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = await Category.create({ name, description });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        category.name = name || category.name;
        category.description = description || category.description;

        await category.save();
        res.status(200).json(category);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        await category.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

module.exports.CategoryController = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};