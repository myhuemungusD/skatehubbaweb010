# Contributing to SkateHubba™

First off, thank you for considering contributing to SkateHubba™! It's people like you that help make this platform awesome for the skateboarding community.

## 📖 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

---

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Be respectful and considerate in communications
- Welcome newcomers and help them get started
- Focus on what's best for the skateboarding community
- Accept constructive criticism gracefully
- Show empathy towards other community members

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 20+ installed
- Git configured with your GitHub account
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Express

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork locally**
```bash
git clone https://github.com/YOUR_USERNAME/skatehubbaweb010.git
cd skatehubbaweb010
```

3. **Add the upstream repository**
```bash
git remote add upstream https://github.com/myhuemungusD/skatehubbaweb010.git
```

4. **Install dependencies**
```bash
npm install
```

5. **Copy environment variables**
```bash
cp .env.example .env
```
Fill in the required environment variables (see README.md)

6. **Start the development server**
```bash
npm run dev
```

---

## 💡 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)
- **Error messages** or console logs

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 11, macOS 14]
 - Browser: [e.g. Chrome 120, Safari 17]
 - Node version: [e.g. 20.10.0]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** describing the enhancement
- **Detailed description** of the proposed feature
- **Use cases** - why this would be useful
- **Possible implementation** ideas (optional)
- **Mockups or examples** if applicable

### Your First Code Contribution

Unsure where to start? Look for issues labeled:
- `good first issue` - Simple issues perfect for newcomers
- `help wanted` - Issues where we need community help
- `documentation` - Improvements to documentation

---

## 🔄 Development Workflow

### Branch Naming Convention

Create a branch for your work using this format:

```bash
# For new features
git checkout -b feature/short-description

# For bug fixes
git checkout -b fix/short-description

# For documentation
git checkout -b docs/short-description

# For refactoring
git checkout -b refactor/short-description
```

Examples:
- `feature/leaderboard-filters`
- `fix/checkout-cart-total`
- `docs/api-endpoints`

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your branch
git checkout main
git merge upstream/main

# Push updates to your fork
git push origin main
```

---

## 📏 Code Standards

### TypeScript

- **Use TypeScript** for all new code (`.ts` or `.tsx` files)
- **Define types** for function parameters and return values
- **Avoid `any`** - use proper types or `unknown`
- **Use interfaces** for object shapes
- **Export types** from shared locations

Example:
```typescript
// Good
interface SpotCheckInRequest {
  spotId: string;
  userId: string;
  latitude: number;
  longitude: number;
}

async function checkInAtSpot(request: SpotCheckInRequest): Promise<CheckInResponse> {
  // Implementation
}

// Avoid
async function checkInAtSpot(request: any): Promise<any> {
  // Implementation
}
```

### React Components

- **Use functional components** with hooks
- **Prefer named exports** over default exports
- **Use TypeScript interfaces** for props
- **Keep components focused** - single responsibility
- **Extract reusable logic** into custom hooks

Example:
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

### Backend/API Code

- **Validate all inputs** using Zod schemas
- **Use proper error handling** with try-catch
- **Return consistent responses** (success/error format)
- **Add rate limiting** to public endpoints
- **Sanitize user inputs** to prevent XSS/SQL injection
- **Use TypeScript types** for request/response

Example:
```typescript
app.post('/api/spots/check-in', async (req: Request, res: Response) => {
  try {
    const schema = z.object({
      spotId: z.string(),
      userId: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    });

    const validated = schema.parse(req.body);
    const result = await checkInService.process(validated);
    
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request data',
        details: error.errors 
      });
    }
    
    console.error('Check-in error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});
```

### Styling

- **Use Tailwind CSS** utility classes for styling
- **Follow existing patterns** in the codebase
- **Use design tokens** from `tailwind.config.ts`
- **Ensure mobile responsiveness** (use `sm:`, `md:`, `lg:` breakpoints)
- **Maintain accessibility** (proper contrast, focus states)

### File Organization

- **Group related files** in appropriate directories
- **Keep files focused** - one component per file
- **Use index files** to export related components
- **Name files consistently** - PascalCase for components, camelCase for utilities

---

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Examples

```bash
# Feature
git commit -m "feat(spots): add geo-verification to check-in endpoint"

# Bug fix
git commit -m "fix(cart): correct total calculation for multiple items"

# Documentation
git commit -m "docs(readme): add API endpoint documentation"

# Refactor
git commit -m "refactor(auth): simplify token validation logic"
```

### Commit Message Guidelines

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep the first line under 72 characters
- Reference issues and PRs in the footer if applicable
- Provide detailed explanation in the body for complex changes

---

## 🔀 Pull Request Process

### Before Submitting

1. **Sync with upstream** to avoid merge conflicts
```bash
git fetch upstream
git rebase upstream/main
```

2. **Test your changes** thoroughly
```bash
npm run check    # TypeScript type checking
npm run build    # Ensure builds successfully
```

3. **Review your changes**
```bash
git diff upstream/main
```

### Creating a Pull Request

1. **Push your branch** to your fork
```bash
git push origin feature/your-feature
```

2. **Open a Pull Request** on GitHub
   - Fill in the PR template completely
   - Reference related issues (e.g., "Fixes #123")
   - Add screenshots for UI changes
   - Explain your approach and decisions

3. **PR Title Format**
```
<type>(<scope>): <description>
```

Examples:
- `feat(leaderboard): add filtering by date range`
- `fix(checkout): resolve cart total calculation bug`
- `docs(api): document authentication endpoints`

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Issue
Fixes #(issue number)

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the project's code style
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have tested this on mobile and desktop
```

### Code Review Process

- **Be responsive** to feedback and questions
- **Be open** to suggestions and improvements
- **Explain your reasoning** if you disagree with feedback
- **Make requested changes** promptly
- **Keep discussions focused** on the code, not the person

Maintainers will:
- Review PRs within 2-3 business days
- Provide constructive feedback
- Request changes if needed
- Merge approved PRs

---

## 🧪 Testing Guidelines

### Manual Testing

Before submitting a PR, test:
- The specific feature/fix you implemented
- Related features that might be affected
- Both desktop and mobile views
- Different browsers (Chrome, Firefox, Safari)
- Error scenarios and edge cases

### Test Checklist for UI Changes

- [ ] Component renders correctly
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (check with browser dev tools)
- [ ] Loading states display properly
- [ ] Error states handled gracefully
- [ ] Forms validate inputs correctly

### Test Checklist for API Changes

- [ ] Request validation works (test with invalid data)
- [ ] Success responses return correct data
- [ ] Error responses return appropriate status codes
- [ ] Rate limiting functions correctly
- [ ] Authentication/authorization enforced
- [ ] Database changes persist correctly

---

## 📚 Documentation

Good documentation is crucial. When contributing, please:

### Code Documentation

- **Add JSDoc comments** to exported functions
```typescript
/**
 * Verifies user is within 30 meters of a spot for check-in
 * @param spotId - The unique identifier of the spot
 * @param userLat - User's current latitude
 * @param userLng - User's current longitude
 * @returns Promise resolving to verification result
 * @throws Error if spot is not found
 */
export async function verifyCheckInDistance(
  spotId: string,
  userLat: number,
  userLng: number
): Promise<CheckInVerification> {
  // Implementation
}
```

- **Comment complex logic**
```typescript
// Calculate distance using Haversine formula
// R = 6371e3 meters (Earth's radius)
const R = 6371e3;
const φ1 = (userLat * Math.PI) / 180;
const φ2 = (spotLat * Math.PI) / 180;
// ... more calculations
```

### Updating Documentation Files

When making changes that affect:
- **API endpoints** → Update API documentation
- **Environment variables** → Update README.md and .env.example
- **Features** → Update project-roadmap.md and CHANGELOG.md
- **Setup process** → Update README.md Getting Started section

---

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list
- CHANGELOG.md for significant contributions
- Project documentation

---

## ❓ Questions?

If you have questions:
- Check existing documentation
- Search through GitHub Issues
- Create a new issue with the `question` label
- Reach out to the maintainers

---

## 🙏 Thank You!

Your contributions help make SkateHubba™ better for the entire skateboarding community. Whether you're fixing a typo, adding a feature, or improving documentation - every contribution matters!

**Let's build something awesome together! 🛹**
