const { User } = require('../models');
const bcrypt = require('bcryptjs');

const UserController = {
  // Get all users (admin only)
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }, // Don't return passwords
        order: [['createdAt', 'DESC']]
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Users can only view their own profile unless they're admin
      if (req.user.id !== user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, password, role } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Users can only update their own profile unless they're admin
      if (req.user.id !== user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Only admins can change roles
      if (role && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can change user roles' });
      }

      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (role && req.user.role === 'admin') updateData.role = role;

      // Handle password update with hashing
      if (password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      await user.update(updateData);

      // Return updated user without password
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Users can only delete their own account unless they're admin
      if (req.user.id !== user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      await user.destroy();
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update current user profile
  async updateProfile(req, res) {
    try {
      const { username, email, password } = req.body;

      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;

      // Handle password update with hashing
      if (password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      await User.update(updateData, {
        where: { id: req.user.id }
      });

      // Return updated user without password
      const updatedUser = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = UserController;