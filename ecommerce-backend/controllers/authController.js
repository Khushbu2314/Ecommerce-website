const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// register a new user
exports.register = async (req, res) => {
    try {
        // Validate request body
        if (!req.body) {
            return res.status(400).json({ 
                success: false,
                message: 'Request body is required' 
            });
        }

        const { name, email, password } = req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Create new user
        user = await User.create({ name, email, password });

        // Create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (error, token) => {
                if (error) {
                    console.error('JWT Error:', error);
                    return res.status(500).json({ 
                        success: false,
                        message: 'Error generating token' 
                    });
                }
                res.status(201).json({ 
                    success: true,
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                });
            }
        );
    }

    catch(err){
        console.error('Registration Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

exports.login = async (req, res) => {
    try {
        // Validate request body
        if (!req.body) {
            return res.status(400).json({ 
                success: false,
                message: 'Request body is required' 
            });
        }

        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (error, token) => {
                if (error) {
                    throw error;
                }
                res.status(200).json({token});
            }
        )
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}