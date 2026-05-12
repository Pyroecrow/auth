const jwt = require('jsonwebtoken');

const Secret_Key = "your_secret_key"; //NB! bruk .env for å lagre hemmelige nøkler i miljøvariabler


// Middleware for authenticating JWT tokens
function authenticateToken(req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
}

jwt.verify(token, Secret_Key, (err, user) => {
    if (err) {
        return res.status(403).json({ message: 'Invalid access token' });
    }

    req.user = user;
    next();
    });
}

// authorization
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    }
}

module.exports = {
    authenticateToken,
    authorizeRoles
};