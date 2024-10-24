const jwt = require('jsonwebtoken')
require('dotenv').config();


const jwtAuthMiddleware = (req, res, next) => {
    // Check for token in cookies
    const token = req.cookies.token; // Assuming you store the token in a cookie named 'token'

    
    if (!token) return res.status(401).json({ error: 'Token not found' });

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '2h' }); // Set expiration to 5 minutes
};

module.exports = { jwtAuthMiddleware, generateToken };

// const jwt = require('jsonwebtoken')


// const jwtAuthMiddleware = (req, res, next) => {

//     //first check a request method have authorization or not
//     const authorization = req.headers.authorization
//     if(!authorization) return res.status(401).json({error: "token not found"});

//     const token = req.headers.authorization.split(' ')[1];
//     if(!token) return res.status(401).json({error: 'Unauthorized'})

//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.user = decoded
//         next();
//     }catch(err){
//         console.log(err);
//         res.status(401).json({error: 'invalid token'});
//     }    
// }

// const generateToken = (userData) => {
//     return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
// }
// module.exports = {jwtAuthMiddleware, generateToken};
