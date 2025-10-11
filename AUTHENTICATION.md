# Authentication System Documentation

## Overview

This document describes the comprehensive authentication system implemented for the Chess Tournament Manager application. The system includes user registration, login, role-based access control, admin user management, and security features.

## Features

### ✅ Implemented Features

- **Password-based Authentication**: Secure password hashing with bcrypt
- **JWT Token System**: Stateless authentication with JSON Web Tokens
- **Role-based Access Control**: USER, ADMIN, SUPER_ADMIN roles
- **User Approval Workflow**: Admin approval required for new users
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: CSRF protection and security headers
- **Session Management**: Redis-based session storage
- **Comprehensive Logging**: Structured logging with Winston
- **Admin User Management**: Full CRUD operations for user management
- **Bulk Operations**: Bulk approve/reject/delete users
- **User Statistics**: Analytics and reporting for admins
- **Test Suite**: Comprehensive test coverage

### 🔄 In Progress

- **OAuth Integration**: Google, GitHub OAuth providers

## Architecture

### Database Schema

```prisma
model User {
  id                 String       @id @default(cuid())
  email              String       @unique
  name               String?
  hashedPassword     String?      // For email/password auth
  role               UserRole     @default(USER)
  status             UserStatus   @default(PENDING)
  avatarUrl          String?
  provider           AuthProvider @default(EMAIL)
  providerId         String?
  lastLoginAt        DateTime?
  approvedAt         DateTime?
  approvedBy         String?      // ID of admin who approved
  failedLoginAttempts Int        @default(0)
  lockedUntil        DateTime?    // Account lockout
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
  auditLogs          AuditLog[]
  createdTournaments Tournament[]

  @@map("users")
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum AuthProvider {
  EMAIL
  GOOGLE
  GITHUB
}
```

### API Endpoints

#### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Admin User Management

- `GET /api/admin/users` - List users with pagination
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/approve` - Approve user
- `PUT /api/admin/users/:id/reject` - Reject user
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/users/:id/role` - Update user role (Super Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Super Admin only)
- `POST /api/admin/users/bulk` - Bulk operations
- `GET /api/admin/users/stats` - User statistics

## Security Features

### Password Security

- **Hashing**: bcrypt with configurable salt rounds (default: 12)
- **Validation**: Strong password requirements
- **Common Password Detection**: Rejection of common passwords

### Rate Limiting

- **Login Attempts**: 5 attempts per 15 minutes
- **Registration**: 3 attempts per hour
- **General API**: 60 requests per minute

### Account Security

- **Account Lockout**: 15 minutes after 5 failed login attempts
- **Session Management**: Redis-based session storage
- **JWT Expiration**: 7 days (configurable)

### Security Headers

- **CSP**: Content Security Policy
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin

## User Roles and Permissions

### USER

- Register and login
- View own profile
- Create and manage tournaments (when approved)

### ADMIN

- All USER permissions
- View all users
- Approve/reject pending users
- Suspend/activate users
- View user statistics
- Bulk user operations

### SUPER_ADMIN

- All ADMIN permissions
- Change user roles
- Delete users
- Manage other admins

## User Workflow

1. **Registration**: User registers with email/password
2. **Pending Status**: User status is set to PENDING
3. **Admin Review**: Admin reviews and approves/rejects user
4. **Approved Access**: User can access the application
5. **Ongoing Management**: Admins can manage user status and roles

## Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chess_tournament_manager"
DIRECT_URL="postgresql://username:password@localhost:5432/chess_tournament_manager"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Security
BCRYPT_ROUNDS="12"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_ATTEMPTS="5"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

- **Unit Tests**: Password utilities, JWT, rate limiting, logging
- **API Tests**: Authentication endpoints, admin management
- **Integration Tests**: Full authentication flow

### Test Files

- `tests/auth.test.ts` - Core authentication utilities
- `tests/api/auth.test.ts` - API endpoint tests
- `tests/unit/importExport.test.ts` - Import/export utilities

## Logging

### Log Levels

- **ERROR**: System errors, authentication failures
- **WARN**: Failed login attempts, suspicious activity
- **INFO**: User actions, system events
- **DEBUG**: Detailed debugging information

### Log Destinations

- **Console**: Development environment
- **Files**: Production environment
  - `logs/error.log` - Error logs only
  - `logs/combined.log` - All logs

### Audit Trail

All user actions are logged in the `AuditLog` table:

- Login/logout events
- User status changes
- Role changes
- Admin actions

## Deployment Considerations

### Production Setup

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use production PostgreSQL instance
3. **Redis**: Use production Redis instance
4. **JWT Secret**: Use strong, unique JWT secret
5. **HTTPS**: Enable HTTPS for all authentication endpoints
6. **Rate Limiting**: Consider using Redis for distributed rate limiting

### Security Checklist

- [ ] Strong JWT secret configured
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] Database credentials secured
- [ ] Redis credentials secured
- [ ] Log monitoring configured
- [ ] Backup strategy implemented

## Troubleshooting

### Common Issues

1. **JWT Token Invalid**
   - Check JWT_SECRET environment variable
   - Verify token expiration
   - Check token format

2. **Rate Limiting Issues**
   - Check Redis connection
   - Verify rate limit configuration
   - Check IP detection

3. **Database Connection Issues**
   - Verify DATABASE_URL
   - Check database permissions
   - Verify Prisma schema

4. **User Approval Issues**
   - Check user status in database
   - Verify admin permissions
   - Check audit logs

### Debug Mode

Set `LOG_LEVEL=debug` to enable detailed logging for troubleshooting.

## Future Enhancements

### Planned Features

- **Email Verification**: Email confirmation for new users
- **Two-Factor Authentication**: TOTP support
- **Password Reset**: Secure password reset flow
- **Account Recovery**: Account recovery options
- **Advanced Analytics**: User behavior analytics
- **API Rate Limiting**: Per-user API rate limiting
- **Audit Log Search**: Advanced audit log search
- **User Import/Export**: Bulk user management

### OAuth Integration

- **Google OAuth**: Complete Google OAuth implementation
- **GitHub OAuth**: Complete GitHub OAuth implementation
- **OAuth Account Linking**: Link multiple OAuth providers

## Support

For issues or questions about the authentication system:

1. Check the logs for error messages
2. Review the test suite for expected behavior
3. Check the database for user status and permissions
4. Verify environment configuration
