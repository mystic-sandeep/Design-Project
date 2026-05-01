const auth = require('./auth.js');

const mockUser = { id: 1, role: "RESIDENT", email: "sandeep@example.com" };
const token = auth.generateToken(mockUser);

console.log(token); // Only prints the raw token

const mockReq = { headers: { authorization: `Bearer ${token}` } };
const mockRes = { status: (code) => ({ json: (msg) => console.log(msg) }) };
const next = () => console.log("Verified");

auth.verifyToken(mockReq, mockRes, next);