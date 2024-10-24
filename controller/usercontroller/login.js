const User = require('../../models/user');
const { generateToken } = require('../../middleware/auth');


const userLogin = async (req, res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email:email});

        if(!user || !user.password == password){
            res.status(401).json({error: 'invalid username or password'})
        }

        const payload = {
            id: user.id,
            email: user.email,
            password: user.password,
            role: user.role
        }

        const token = generateToken(payload);
        res.cookie("token", token, { httpOnly: true })
        //res.json(token)
        return res.redirect("/dashboard/add-stock");
        
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'internal server error'});
    }
};

module.exports = userLogin;