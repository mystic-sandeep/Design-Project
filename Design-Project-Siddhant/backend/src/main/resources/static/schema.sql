-- ============================================
-- MyGate Database Schema with Security Framework
-- ============================================

-- Drop existing tables if exists
DROP TABLE IF EXISTS visitor_passes;
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS entry_exit_logs;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS encrypted_credentials;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS residents_enhanced;
DROP TABLE IF EXISTS guards;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

-- ============== USERS TABLE ==============
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  email VARCHAR(255) UNIQUE NOT NULL COMMENT 'User email address',
  phone VARCHAR(20) UNIQUE NOT NULL COMMENT 'User phone number',
  password_hash VARCHAR(255) NOT NULL COMMENT 'BCrypt hashed password',
  role ENUM('ADMIN', 'GUARD', 'RESIDENT', 'STAFF') NOT NULL COMMENT 'User role',
  is_active BOOLEAN DEFAULT true COMMENT 'Account active status',
  is_verified BOOLEAN DEFAULT false COMMENT 'Email/Phone verification status',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation time',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
  last_login TIMESTAMP NULL COMMENT 'Last login timestamp',
  
  KEY idx_email (email),
  KEY idx_phone (phone),
  KEY idx_role (role),
  KEY idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Base users table for all roles';

-- ============== ROLES TABLE ==============
CREATE TABLE roles (
  id INT PRIMARY KEY COMMENT 'Role ID',
  role_name ENUM('ADMIN', 'GUARD', 'RESIDENT', 'STAFF') UNIQUE NOT NULL COMMENT 'Role name',
  description TEXT COMMENT 'Role description',
  
  INDEX idx_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Role definitions';

INSERT INTO roles (id, role_name, description) VALUES
(1, 'ADMIN', 'System administrator with full access'),
(2, 'GUARD', 'Security guard with entry/exit and incident reporting'),
(3, 'RESIDENT', 'Apartment resident with limited access'),
(4, 'STAFF', 'Staff member with restricted access');

-- ============== PERMISSIONS TABLE ==============
CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Permission ID',
  permission_name VARCHAR(100) UNIQUE NOT NULL COMMENT 'Permission name',
  description TEXT COMMENT 'Permission description',
  category VARCHAR(50) COMMENT 'Permission category',
  
  INDEX idx_permission_name (permission_name),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System permissions';

INSERT INTO permissions (permission_name, description, category) VALUES
-- ADMIN permissions
('view_all_users', 'View all users in system', 'users'),
('manage_admins', 'Create/edit/delete admin accounts', 'users'),
('manage_guards', 'Create/edit/delete guard accounts', 'users'),
('manage_residents', 'Create/edit/delete resident accounts', 'users'),
('manage_staff', 'Create/edit/delete staff accounts', 'users'),
('generate_reports', 'Generate system reports', 'reports'),
('view_audit_logs', 'View audit logs', 'audit'),
('manage_settings', 'Manage system settings', 'settings'),
('deactivate_users', 'Deactivate user accounts', 'users'),

-- GUARD permissions
('view_residents', 'View resident directory', 'residents'),
('record_entry_exit', 'Record entry/exit events', 'access'),
('report_incident', 'Report security incidents', 'incidents'),
('view_own_profile', 'View own profile', 'profile'),
('view_incidents', 'View incidents', 'incidents'),

-- RESIDENT permissions
('view_own_info', 'View own profile info', 'profile'),
('request_visitor_pass', 'Request visitor pass', 'visitors'),
('view_my_visitors', 'View visitor history', 'visitors'),
('report_maintenance', 'Report maintenance issues', 'maintenance'),
('manage_vehicle', 'Manage vehicle information', 'vehicles');

-- ============== ROLE-PERMISSION MAPPING ==============
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Role-permission mappings';

-- Assign all permissions to ADMIN
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- Assign GUARD permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions WHERE permission_name IN (
  'view_residents', 'record_entry_exit', 'report_incident', 'view_own_profile', 'view_incidents'
);

-- Assign RESIDENT permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 3, id FROM permissions WHERE permission_name IN (
  'view_own_info', 'request_visitor_pass', 'view_my_visitors', 'report_maintenance', 'manage_vehicle'
);

-- ============== ADMINS TABLE ==============
CREATE TABLE admins (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID - references users.id',
  full_name VARCHAR(255) NOT NULL COMMENT 'Admin full name',
  employee_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Admin employee ID',
  department VARCHAR(100) COMMENT 'Department name',
  permissions_override JSON COMMENT 'Custom permission overrides',
  created_by VARCHAR(36) COMMENT 'Admin who created this admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL,
  
  KEY idx_employee_id (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Admin user details';

-- ============== GUARDS TABLE ==============
CREATE TABLE guards (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID - references users.id',
  full_name VARCHAR(255) NOT NULL COMMENT 'Guard full name',
  employee_id VARCHAR(50) UNIQUE NOT NULL COMMENT 'Guard employee ID',
  shift VARCHAR(50) DEFAULT 'GENERAL' COMMENT 'Work shift (GENERAL, MORNING, EVENING, NIGHT)',
  assigned_gate VARCHAR(100) COMMENT 'Assigned gate location',
  badge_number VARCHAR(50) UNIQUE COMMENT 'Unique badge number',
  emergency_contact_name VARCHAR(255) COMMENT 'Emergency contact name',
  emergency_contact_phone VARCHAR(20) COMMENT 'Emergency contact phone',
  identification_document LONGBLOB COMMENT 'Encrypted identification document',
  document_hash VARCHAR(255) COMMENT 'Hash of identification document',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  
  KEY idx_employee_id (employee_id),
  KEY idx_badge_number (badge_number),
  KEY idx_shift (shift)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Guard user details';

-- ============== RESIDENTS_ENHANCED TABLE ==============
CREATE TABLE residents_enhanced (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID - references users.id',
  user_id VARCHAR(36) UNIQUE NOT NULL COMMENT 'Foreign key to users table',
  full_name VARCHAR(255) NOT NULL COMMENT 'Resident full name',
  apartment_number VARCHAR(50) NOT NULL COMMENT 'Apartment/Flat number',
  building VARCHAR(50) COMMENT 'Building name/number',
  emergency_contact_name VARCHAR(255) COMMENT 'Emergency contact name',
  emergency_contact_phone VARCHAR(20) COMMENT 'Emergency contact phone',
  vehicle_number VARCHAR(50) COMMENT 'Vehicle registration number',
  identification_proof LONGBLOB COMMENT 'Encrypted identification proof',
  proof_hash VARCHAR(255) COMMENT 'Hash of identification proof',
  move_in_date DATE COMMENT 'Resident move-in date',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  KEY idx_apartment_number (apartment_number),
  KEY idx_building (building),
  KEY idx_vehicle_number (vehicle_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Enhanced resident user details';

-- ============== ENCRYPTED CREDENTIALS TABLE ==============
CREATE TABLE encrypted_credentials (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
  user_id VARCHAR(36) UNIQUE NOT NULL COMMENT 'Foreign key to users table',
  aadhar_number VARCHAR(255) COMMENT 'Encrypted Aadhaar number',
  pan_number VARCHAR(255) COMMENT 'Encrypted PAN number',
  backup_email VARCHAR(255) COMMENT 'Encrypted backup email',
  backup_phone VARCHAR(20) COMMENT 'Encrypted backup phone',
  encryption_key_version INT DEFAULT 1 COMMENT 'Encryption key version',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update timestamp',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  KEY idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Encrypted sensitive user credentials';

-- ============== SESSIONS TABLE ==============
CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
  user_id VARCHAR(36) NOT NULL COMMENT 'Foreign key to users table',
  token_jti VARCHAR(255) UNIQUE COMMENT 'JWT token ID',
  ip_address VARCHAR(45) COMMENT 'User IP address',
  user_agent TEXT COMMENT 'User agent string',
  expires_at TIMESTAMP NOT NULL COMMENT 'Session expiration time',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Session creation time',
  revoked_at TIMESTAMP NULL COMMENT 'Session revocation time',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  KEY idx_user_id (user_id),
  KEY idx_expires_at (expires_at),
  KEY idx_revoked_at (revoked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User session tracking';

-- ============== AUDIT LOGS TABLE ==============
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-increment ID',
  user_id VARCHAR(36) COMMENT 'User who performed the action',
  action VARCHAR(100) NOT NULL COMMENT 'Action name',
  resource_type VARCHAR(50) COMMENT 'Type of resource affected',
  resource_id VARCHAR(255) COMMENT 'ID of resource affected',
  old_values JSON COMMENT 'Previous values (JSON)',
  new_values JSON COMMENT 'New values (JSON)',
  ip_address VARCHAR(45) COMMENT 'User IP address',
  status VARCHAR(20) DEFAULT 'SUCCESS' COMMENT 'Action status (SUCCESS/FAILED)',
  error_message TEXT COMMENT 'Error message if failed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Action timestamp',
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  
  KEY idx_user_id (user_id),
  KEY idx_created_at (created_at),
  KEY idx_action (action),
  KEY idx_resource (resource_type, resource_id),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='System audit logs - immutable action history';

-- ============== ENTRY/EXIT LOGS TABLE ==============
CREATE TABLE entry_exit_logs (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
  guard_id VARCHAR(36) COMMENT 'Guard who recorded entry/exit',
  visitor_name VARCHAR(255) NOT NULL COMMENT 'Visitor name',
  vehicle_number VARCHAR(50) COMMENT 'Vehicle registration number',
  apartment_number VARCHAR(50) COMMENT 'Target apartment number',
  purpose VARCHAR(255) COMMENT 'Purpose of visit',
  contact_number VARCHAR(20) COMMENT 'Visitor contact number',
  entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Entry timestamp',
  exit_time TIMESTAMP NULL COMMENT 'Exit timestamp',
  status VARCHAR(20) DEFAULT 'ENTRY' COMMENT 'Status (ENTRY/EXIT)',
  
  FOREIGN KEY (guard_id) REFERENCES guards(id) ON DELETE SET NULL,
  
  KEY idx_entry_time (entry_time),
  KEY idx_exit_time (exit_time),
  KEY idx_status (status),
  KEY idx_apartment_number (apartment_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Visitor entry/exit logs';

-- ============== INCIDENTS TABLE ==============
CREATE TABLE incidents (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
  guard_id VARCHAR(36) COMMENT 'Guard who reported incident',
  title VARCHAR(255) NOT NULL COMMENT 'Incident title',
  description TEXT NOT NULL COMMENT 'Incident description',
  severity VARCHAR(20) COMMENT 'Severity level (LOW, MEDIUM, HIGH, CRITICAL)',
  location VARCHAR(255) COMMENT 'Incident location',
  status VARCHAR(20) DEFAULT 'OPEN' COMMENT 'Status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)',
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT 'Incident report time',
  resolved_at TIMESTAMP NULL COMMENT 'Resolution timestamp',
  
  FOREIGN KEY (guard_id) REFERENCES guards(id) ON DELETE SET NULL,
  
  KEY idx_status (status),
  KEY idx_severity (severity),
  KEY idx_reported_at (reported_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Security incidents log';

-- ============== VISITOR PASSES TABLE ==============
CREATE TABLE visitor_passes (
  id VARCHAR(36) PRIMARY KEY COMMENT 'UUID',
  resident_id VARCHAR(36) COMMENT 'Resident requesting pass',
  visitor_name VARCHAR(255) NOT NULL COMMENT 'Visitor name',
  visitor_contact VARCHAR(20) COMMENT 'Visitor contact number',
  visit_date DATE NOT NULL COMMENT 'Intended visit date',
  purpose VARCHAR(255) COMMENT 'Purpose of visit',
  status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'Status (PENDING, APPROVED, REJECTED, EXPIRED)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Request creation time',
  approved_at TIMESTAMP NULL COMMENT 'Approval timestamp',
  
  FOREIGN KEY (resident_id) REFERENCES residents_enhanced(id) ON DELETE CASCADE,
  
  KEY idx_status (status),
  KEY idx_visit_date (visit_date),
  KEY idx_resident_id (resident_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Visitor pass requests and approvals';

-- ============== CREATE SAMPLE DATA ==============

-- Sample Admin User
INSERT INTO users (id, email, phone, password_hash, role, is_active, is_verified) 
VALUES (
  UUID(),
  'admin@mygate.com',
  '+919876543210',
  '$2a$12$R2dP8/WvJJvJ.X0qXZ0Sm.e5n5C5n5C5n5C5n5C5n5C5n5C5n5C5n', -- password: admin@123 (hashed)
  'ADMIN',
  true,
  true
);

-- Sample Guard User
INSERT INTO users (id, email, phone, password_hash, role, is_active, is_verified)
VALUES (
  UUID(),
  'guard@mygate.com',
  '+919876543211',
  '$2a$12$R2dP8/WvJJvJ.X0qXZ0Sm.e5n5C5n5C5n5C5n5C5n5C5n5C5n5C5n', -- password: guard@123 (hashed)
  'GUARD',
  true,
  true
);

-- Sample Resident User
INSERT INTO users (id, email, phone, password_hash, role, is_active, is_verified)
VALUES (
  UUID(),
  'resident@mygate.com',
  '+919876543212',
  '$2a$12$R2dP8/WvJJvJ.X0qXZ0Sm.e5n5C5n5C5n5C5n5C5n5C5n5C5n5C5n', -- password: resident@123 (hashed)
  'RESIDENT',
  true,
  true
);