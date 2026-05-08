-- ============== INSERT SAMPLE DATA ==============

-- Sample Admin
INSERT INTO users (id, email, phone, password_hash, role, is_active, is_verified)
VALUES (
  'admin-001',
  'admin@mygate.com',
  '+919876543210',
  '$2a$12$R2dP8/WvJJvJ.X0qXZ0Sm.e5n5C5n5C5n5C5n5C5n5C5n5C5n5C5n',
  'ADMIN',
  true,
  true
) ON DUPLICATE KEY UPDATE email=email;

INSERT INTO admins (id, full_name, employee_id, department, created_at)
SELECT 'admin-001', 'Admin User', 'ADM-001', 'Management', NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE id = 'admin-001');

-- Sample Guard
INSERT INTO users (id, email, phone, password_hash, role, is_active, is_verified)
VALUES (
  'guard-001',
  'guard@mygate.com',
  '+919876543211',
  '$2a$12$R2dP8/WvJJvJ.X0qXZ0Sm.e5n5C5n5C5n5C5n5C5n5C5n5C5n5C5n',
  'GUARD',
  true,
  true
) ON DUPLICATE KEY UPDATE email=email;

INSERT INTO guards (id, full_name, employee_id, shift, assigned_gate, badge_number, created_at)
SELECT 'guard-001', 'Security Guard', 'GRD-001', 'GENERAL', 'Main Gate', 'BDG-001', NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM guards WHERE id = 'guard-001');

-- Sample Resident
INSERT INTO users (id, email, phone, password_hash, role, is_active, is_verified)
VALUES (
  'resident-001',
  'resident@mygate.com',
  '+919876543212',
  '$2a$12$R2dP8/WvJJvJ.X0qXZ0Sm.e5n5C5n5C5n5C5n5C5n5C5n5C5n5C5n',
  'RESIDENT',
  true,
  true
) ON DUPLICATE KEY UPDATE email=email;

INSERT INTO residents_enhanced (id, user_id, full_name, apartment_number, building, move_in_date, created_at)
SELECT 'resident-001', 'resident-001', 'John Resident', 'A-101', 'Building A', CURDATE(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM residents_enhanced WHERE id = 'resident-001');