const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mygate-super-secret-key-2024';
const JWT_EXPIRES = '24h';

// Role definitions with permissions
const ROLES = {
  admin: {
    displayName: 'Admin',
    permissions: ['manageUsers','viewReports','registerVisitor','approveVisitor',
                  'markEntry','markExit','logVehicle','viewBills','manageVehicles',
                  'fileComplaint','hireMaid','checkIn','checkOut','patrol'],
  },
  guard: {
    displayName: 'Security Guard',
    permissions: ['registerVisitor','markEntry','markExit','logVehicle','checkIn','checkOut','patrol'],
  },
  resident: {
    displayName: 'Resident',
    permissions: ['approveVisitor','viewBills','manageVehicles','fileComplaint','hireMaid'],
  },
  staff: {
    displayName: 'Staff',
    permissions: ['checkIn','checkOut'],
  },
  maid: {
    displayName: 'Maid',
    permissions: ['checkIn','checkOut'],
  },
};

function generateToken(userId, email, role) {
  return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Express middleware: attach user info to req
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized – token missing' });
  }
  const token = authHeader.slice(7);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Unauthorized – invalid token' });
  }
  req.user = payload;
  next();
}

// Middleware factory: require a specific permission
function requirePermission(permission) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !ROLES[role]) {
      return res.status(403).json({ success: false, error: 'Forbidden – unknown role' });
    }
    if (!ROLES[role].permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden – role '${role}' lacks permission '${permission}'`,
      });
    }
    next();
  };
}

function getRoleInfo(role) {
  return ROLES[role] || null;
}

module.exports = { generateToken, verifyToken, authMiddleware, requirePermission, getRoleInfo, ROLES };
