const gravatar = require('gravatar');

const User = require('../models/user.model');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const retrievedUser = await User.findOne({ email });
        if (retrievedUser) {
            res.status(400).json({ 
                error : 'Email already exists' 
            });
        }
        const avatar = gravatar.url(email, {
            s : '200',
            r : 'pg',
            d : 'mm'
        });
        const newUser = new User({
            name,
            email, 
            password,
            avatar
        });

        await newUser.save();
        
        res.json({
            token : newUser.generateAuthToken()
        })
    } catch (e) {
        res.status(400).json({
            message : e.message
        })
    }
}

const login = async (req, res) => {
    const token = req.user.generateAuthToken();
    res.json({ token });
}

const getAuthUser = (req, res) => {
    const { user } = req;
    res.json({ user });
}

module.exports = {
    register, 
    login,
    getAuthUser
}