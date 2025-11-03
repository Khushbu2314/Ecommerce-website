const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// register a new user
exports.register = async (req, res) => {
    console.log('Registration request received:', req.body);
    
    try {
        // Validate request body
        if (!req.body) {
            console.log('No request body provided');
            return res.status(400).json({ 
                success: false,
                message: 'Request body is required' 
            });
        }

        const { name, email, password } = req.body;
        console.log('Registration attempt for:', { name, email });
        
        
        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required' 
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        user = await User.create({ name, email, password });

        const payload = {
            user: {
                id: user.id
            }
        };

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
        if (!req.body) {
            return res.status(400).json({ 
                success: false,
                message: 'Request body is required' 
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

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