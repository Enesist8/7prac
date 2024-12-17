const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader); // Log the header for debugging

    if (!authHeader) {
        console.error("No authorization header");
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    console.log("JWT Token:", token); // Log the token for debugging

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification failed:', err); // Log the error with details
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        console.log("User authenticated:", user); // Log the authenticated user
        next();
    });
};

module.exports = authenticateJWT;