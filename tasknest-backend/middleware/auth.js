const jwt = require('jsonwebtoken');
const JWT_SECRET = 'tasknest_super_secret_key_123';

module.exports = function (req, res, next) {
    // Grab the token from the request header
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        // Verify token
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = decoded.userId; // Pass the logged-in user's ID to the route
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};