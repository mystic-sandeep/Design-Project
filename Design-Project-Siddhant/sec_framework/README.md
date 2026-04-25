# MyGate - Security Framework (7-Layer Defense)

1. **Layer 1: JWT Authentication** - 24hr stateless tokens for session management.
2. **Layer 2: RBAC** - Role-Based Access Control (Admin, Resident, Security, etc.).
3. **Layer 3: Encryption (Transit)** - BCrypt hashing for passwords.
4. **Layer 4: SSL/TLS** - HTTPS encryption for all data in motion.
5. **Layer 5: AES-256** - Encryption for sensitive data at rest.
6. **Layer 6: Input Validation** - Sanitizing data to prevent SQLi and XSS.
7. **Layer 7: Audit Logging** - Immutable logs of all system actions.