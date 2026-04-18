const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const jwtSecret = process.env.JWT_SECRET || 'elogixa-local-dev-secret';

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '2d',
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.role === 'admin' && user.isApproved === false) {
            return res.status(401).json({ message: 'Admin account pending approval.' });
        }
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

const register = async (req, res) => {
    const { username, email, password, role = 'user' } = req.body;

    const normalizedRole = role === 'admin' ? 'admin' : 'user';
    const isApprovedFlag = normalizedRole === 'admin' ? false : true;

    let userExists = await User.findOne({ email });

    if (userExists) {
        if (normalizedRole === 'admin') {
            if (userExists.role === 'admin') {
                return res.status(400).json({ message: 'Admin account or pending request already exists.' });
            }
            userExists.role = 'admin';
            userExists.isApproved = false;
            if (password) {
                userExists.password = password;
            }
            await userExists.save();
            return res.status(200).json({ message: 'Admin access request submitted for existing user account.' });
        }
        return res.status(400).json({ message: 'User already exists with this email' });
    }

    let usernameExists = await User.findOne({ username });
    if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.create({
        username,
        email,
        password,
        role: normalizedRole,
        isApproved: isApprovedFlag,
    });

    if (user) {
        if (normalizedRole === 'admin') {
            return res.status(201).json({ message: 'Admin registration submitted for approval.' });
        }
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const googleAuth = async (req, res) => {
    const { token } = req.body;
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            const crypto = require('crypto');
            const randomPassword = crypto.randomBytes(32).toString('hex');

            let baseUsername = name || email.split('@')[0];
            let username = baseUsername;
            let counter = 1;
            
            while (await User.findOne({ username })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }

            user = await User.create({
                username: username,
                email,
                password: randomPassword,
                role: 'user',
            });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error('Google verification failed:', err);
        res.status(401).json({ message: 'Google Authentication failed' });
    }
};

const getPendingAdmins = async (req, res) => {
    const pendingAdmins = await User.find({ role: 'admin', isApproved: false }).select('-password');
    res.json(pendingAdmins);
};

const approveAdmin = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'admin') {
        return res.status(404).json({ message: 'Admin request not found' });
    }
    user.isApproved = true;
    await user.save();
    res.json({ message: 'Admin approved' });
};

const rejectAdmin = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'admin') {
        return res.status(404).json({ message: 'Admin request not found' });
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'Admin request rejected' });
};

module.exports = {
    login,
    register,
    googleAuth,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin
};
