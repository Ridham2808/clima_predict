# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do NOT** create a public GitHub issue

Security vulnerabilities should be reported privately to protect users.

### 2. Email Security Team

Send details to: **security@climapredict.org**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### 3. Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Timeline**: Depends on severity (see below)

### 4. Disclosure Policy

We follow responsible disclosure:
- We will notify you when we've assessed the vulnerability
- We will work with you to coordinate disclosure
- We will credit you for responsible disclosure (if desired)

## Security Practices

### Client-Side (Flutter App)

**Data Protection:**
- PII encrypted at rest using AES-256
- All API communications use HTTPS/TLS 1.2+
- API keys stored server-side (never in client)
- Model files verified via SHA256 checksums

**Permissions:**
- Explicit user consent for location, Bluetooth, notifications
- Minimal PII collection (name, village, crop profile only)
- Data deletion available via API endpoint

**Code Protection:**
- ProGuard/R8 enabled for release builds
- No hardcoded secrets
- Secure storage for local credentials

### Server-Side (Node.js API)

**Authentication:**
- JWT tokens for authenticated endpoints
- Rate limiting on all endpoints
- Input validation and sanitization

**Data Storage:**
- MongoDB connection encrypted (TLS)
- Sensitive fields encrypted at rest
- Regular backups with encryption

**API Security:**
- CORS configured appropriately
- Helmet.js for security headers
- Request size limits
- SQL injection prevention (parameterized queries)

**Model Distribution:**
- Models signed with RSA private key
- SHA256 verification on client
- Secure S3 bucket with signed URLs

## Known Vulnerabilities

None currently. Check [GitHub Security Advisories](https://github.com/yourusername/climapredict/security/advisories) for past issues.

## Security Updates

- Critical: Patched within 24-48 hours
- High: Patched within 7 days
- Medium: Patched in next release cycle
- Low: Addressed as time permits

## Dependency Security

We regularly:
- Update dependencies to latest secure versions
- Scan for known vulnerabilities (npm audit, pub audit)
- Review and update security patches

## Best Practices for Contributors

1. **Never commit secrets** (API keys, passwords, tokens)
2. **Use environment variables** for configuration
3. **Validate all inputs** from users
4. **Follow principle of least privilege**
5. **Keep dependencies updated**
6. **Review code for security issues**

## Bug Bounty

Currently, we do not operate a formal bug bounty program. However, we appreciate responsible disclosure and will acknowledge contributors.

## Compliance

- **GDPR**: Data deletion endpoint, consent flow, minimal PII
- **India IT Act**: Data localization considered for production
- **Open Source**: Security fixes released promptly

## Contact

**Security Issues**: security@climapredict.org  
**General Support**: support@climapredict.org

---

*Last Updated: 2024*

