const jwt = require('jsonwebtoken');
const secretKey =  process.env.SECRETSTRING; // Replace this with your secret key

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization; // Assuming the token is sent in the Authorization header
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = decoded; // Decoded payload contains user information
        next();
    });
};

module.exports = verifyToken;
