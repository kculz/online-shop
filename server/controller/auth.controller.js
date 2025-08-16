const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const bcrypt = require('bcryptjs');
const {User} = require('../models');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
    });
}

const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

const signup = async (req, res) => {
    const { username, password, email, role } = req.body;

    try {
        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ msg: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            role: role || 'user' // Default to 'user' if no role is provided
        });

        const token = generateToken(newUser);

        res.status(201).json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
}

module.exports.AuthController = {
    signin,
    signup
};