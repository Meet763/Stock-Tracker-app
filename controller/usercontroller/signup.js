const User = require('../../models/user');
const { generateToken } = require('../../middleware/auth');
const cookieParser = require('cookie-parser');

const userSignup = async (req, res) => {
    try{
        const data = req.body

        if (data.role === 'admin') {
            const adminExists = await User.findOne({ role: 'admin' });

            if (adminExists) {
                return res.status(400).json({ error: 'An admin account already exists. Only one admin is allowed.' });
            }
        }

        const newUser = new User(data)

        if (!newUser) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const responce = await newUser.save();
        console.log('data saved')

        const payload = {
            id: responce.id,
            email: responce.email,
            password: responce.password,
            role:responce.role
        }

        const token = generateToken(payload);
        res.cookie("token", token, { httpOnly: true })
        return res.redirect("/dashboard/add-stock")
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'internal server error'});
    }
};



module.exports = userSignup;