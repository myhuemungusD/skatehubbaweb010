# Security Audit Workflow Documentation

## Overview
The Security Audit workflow performs comprehensive security checks on the SkateHubba application. It runs automatically on pull requests and pushes to the main branch, providing continuous security monitoring.

## Workflow File
`.github/workflows/security-audit.yml`

## Triggers
- Pull requests (opened, synchronize, reopened)
- Push to main branch
- Manual workflow dispatch

## Security Checks Performed

### 1. NPM Audit (Production Dependencies)
- Runs `npm audit --production` to check for known vulnerabilities
- Reports severity levels: Critical, High, Moderate, Low
- Provides actionable recommendations for fixing issues
- Does not fail the build, only warns

**What it checks:**
- Known security vulnerabilities in production dependencies
- CVEs (Common Vulnerabilities and Exposures)
- Package integrity issues

### 2. API Key and Secret Detection
Scans the codebase for exposed secrets including:

**Patterns detected:**
- Firebase API keys: `AIzaSy[0-9A-Za-z_-]{33}`
- Stripe keys: `sk_live_*`, `sk_test_*`, `pk_live_*`, `pk_test_*`
- AWS keys: `AKIA[0-9A-Z]{16}`
- OpenAI keys: `sk-[a-zA-Z0-9]{48}`
- GitHub tokens: `ghp_*`, `github_pat_*`
- GitLab tokens: `glpat-*`
- Google OAuth: `*.apps.googleusercontent.com`
- Google tokens: `ya29.*`

**Additional checks:**
- Detects if `.env` file is committed to git (CRITICAL)
- Finds Firebase config initialization in source files
- Verifies Firebase configs use environment variables

### 3. OWASP Top 10 Compliance Analysis
Analyzes the codebase against OWASP Top 10 2021 standards:

#### A01:2021 - Broken Access Control
- ✅ Checks for authentication middleware
- ✅ Checks for user session/context usage

#### A02:2021 - Cryptographic Failures
- ✅ Checks for Helmet security headers
- ✅ Checks for password hashing libraries (bcrypt, argon2)

#### A03:2021 - Injection
- ✅ Checks for ORM usage (Drizzle, Prisma, Sequelize)
- ✅ Checks for input validation libraries (Zod, Joi, Validator)

#### A04:2021 - Insecure Design
- ✅ Checks for rate limiting implementation

#### A05:2021 - Security Misconfiguration
- ✅ Checks for CORS configuration
- ✅ Checks for Content Security Policy (CSP)
- ✅ Checks for Helmet middleware

#### A06:2021 - Vulnerable and Outdated Components
- ✅ References NPM Audit section for details

#### A07:2021 - Identification and Authentication Failures
- ✅ Checks for session management (express-session)
- ✅ Checks for JWT libraries

#### A08:2021 - Software and Data Integrity Failures
- ✅ Checks for package lock files (ensures dependency integrity)

#### A09:2021 - Security Logging and Monitoring Failures
- ✅ Checks for logging libraries (Winston, Pino, Morgan)
- ✅ Checks for error monitoring (Sentry, Datadog, NewRelic)

#### A10:2021 - Server-Side Request Forgery (SSRF)
- ✅ Checks for HTTP request usage and warns about URL validation

## Report Generation

### Format
The workflow generates a comprehensive markdown report containing:
1. NPM Audit results with vulnerability counts
2. Secret detection findings with file locations
3. OWASP Top 10 compliance status for each category
4. Overall security summary
5. Actionable recommendations

### Distribution
1. **PR Comments**: Posted as a comment on pull requests
   - Updates existing comment instead of creating duplicates
   - Includes full security report
2. **Workflow Artifacts**: Uploaded as `security-audit-report`
   - Available for download from workflow run
   - Retained for historical analysis

## Current Security Status

Based on the latest scan:

### ✅ Strengths
- Helmet security headers configured
- Rate limiting implemented (express-rate-limit)
- Input validation with Zod
- ORM usage (Drizzle) prevents SQL injection
- Logging library (Pino) present
- Error monitoring (Sentry) configured
- JWT authentication implemented
- Package integrity maintained (lock files present)

### ⚠️ Warnings
- 2 low severity npm vulnerabilities (fast-redact)
- .env file is tracked in git (SHOULD BE FIXED)
- Firebase config found in source files (verified using env vars)

### 📋 Recommendations
1. Run `npm audit fix` to address the fast-redact vulnerability
2. Remove .env from git tracking:
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from git tracking"
   ```
3. Ensure .env is in .gitignore (it already is, but file was previously committed)
4. Keep all dependencies up to date
5. Continue monitoring security reports on each PR

## Usage

### Viewing Reports

**On Pull Requests:**
The workflow automatically comments on PRs with the security report. Look for the comment titled "🔒 Security Audit Report".

**In Workflow Runs:**
1. Go to Actions tab in GitHub
2. Click on "Security Audit" workflow
3. Select a workflow run
4. Download the "security-audit-report" artifact

### Manual Trigger
To manually run the security audit:
1. Go to Actions tab
2. Select "Security Audit" workflow
3. Click "Run workflow"
4. Select branch and run

## Integration with CI/CD

The security audit runs in parallel with other CI jobs and does not block deployments. Instead, it provides visibility into security issues that should be addressed.

### Why it doesn't fail builds:
- Low severity vulnerabilities may not require immediate action
- Some findings need manual review (false positives)
- Allows development to continue while security issues are triaged
- Provides warnings instead of hard failures

## Maintenance

### Updating Secret Patterns
To add new secret patterns, edit `.github/workflows/security-audit.yml` and add patterns to the `secret-patterns.txt` section around line 103.

### Customizing OWASP Checks
OWASP compliance checks can be customized by modifying the grep patterns in the "OWASP Top 10 Compliance Check" step.

### Adjusting Thresholds
To make the workflow fail on certain conditions, modify the final check step and change:
```yaml
exit 0  # Always succeed
```
to:
```yaml
exit 1  # Fail the workflow
```

## Best Practices

1. **Review every security report** - Don't ignore warnings
2. **Fix critical/high vulnerabilities promptly** - Within 1-2 days
3. **Keep dependencies updated** - Run `npm update` regularly
4. **Never commit secrets** - Always use environment variables
5. **Monitor trends** - Compare reports over time to track improvements

## Related Documentation
- [SECURITY.md](../SECURITY.md) - Security policy
- [SECURITY_NOTES.md](../SECURITY_NOTES.md) - Security review notes
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm audit docs](https://docs.npmjs.com/cli/v8/commands/npm-audit)

## Support
For questions or issues with the security audit workflow, please open an issue or contact the security team.

---

**Last Updated:** November 3, 2025
**Workflow Version:** 1.0.0
