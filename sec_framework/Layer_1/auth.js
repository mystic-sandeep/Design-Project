const jwt = require('jsonwebtoken');
const SECRET = "Luciferneedsauthorization$123@";

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET, { expiresIn: '24h' });
};

const verifyToken = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid Token" });
        req.user = decoded;
        next();
    });
};

module.exports = { generateToken, verifyToken };