// ✅ FIX: rbac.js was completely empty. This file is listed as a dependency
//         in package.json and is part of the sec_framework Layer_1 module.
//         A minimal, functional RBAC middleware is provided here.

const ROLES = {
  admin: {
    displayName: 'Admin',
    permissions: [
      'manageUsers', 'viewReports', 'registerVisitor', 'approveVisitor',
      'markEntry', 'markExit', 'logVehicle', 'viewBills', 'manageVehicles',
      'fileComplaint', 'hireMaid', 'checkIn', 'checkOut', 'patrol',
    ],
  },
  guard: {
    displayName: 'Security Guard',
    permissions: ['registerVisitor', 'markEntry', 'markExit', 'logVehicle', 'checkIn', 'checkOut', 'patrol'],
  },
  resident: {
    displayName: 'Resident',
    permissions: ['approveVisitor', 'viewBills', 'manageVehicles', 'fileComplaint', 'hireMaid'],
  },
  staff: {
    displayName: 'Staff',
    permissions: ['checkIn', 'checkOut', 'viewTasks'],
  },
  maid: {
    displayName: 'Maid',
    permissions: ['checkIn', 'checkOut', 'viewAssignments'],
  },
};

/**
 * Returns true if the given role has the specified permission.
 * @param {string} role
 * @param {string} permission
 * @returns {boolean}
 */
function hasPermission(role, permission) {
  const roleData = ROLES[role.toLowerCase()];
  if (!roleData) return false;
  return roleData.permissions.includes(permission);
}

/**
 * Express middleware factory: requires the authenticated user to have a permission.
 * Depends on req.user being set by the JWT verifyToken middleware beforehand.
 * @param {string} permission
 */
function requirePermission(permission) {
  return (req, res, next) => {
    const role = req.user && req.user.role;
    if (!role) {
      return res.status(401).json({ error: 'Unauthorized – no role in token' });
    }
    if (!hasPermission(role, permission)) {
      return res.status(403).json({
        error: `Forbidden – role '${role}' lacks permission '${permission}'`,
      });
    }
    next();
  };
}

/**
 * Returns the role configuration object for a given role string.
 * @param {string} role
 * @returns {object|null}
 */
function getRoleInfo(role) {
  return ROLES[role ? role.toLowerCase() : ''] || null;
}

module.exports = { ROLES, hasPermission, requirePermission, getRoleInfo };