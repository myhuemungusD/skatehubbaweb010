# Release Process

SkateHubba uses an automated release workflow that handles versioning, changelog generation, and GitHub releases.

## How It Works

When code is merged to the `main` branch, the release workflow automatically:

1. **Detects merged PRs** - Scans commits since the last release
2. **Analyzes commit messages** - Categorizes changes by type (features, fixes, breaking changes)
3. **Determines version bump** - Follows semantic versioning based on commit types
4. **Updates CHANGELOG.md** - Generates structured release notes
5. **Bumps package.json version** - Updates the version number
6. **Creates git tag** - Tags the release (e.g., `v1.0.1`)
7. **Creates GitHub release** - Publishes release with notes

## Commit Message Convention

To ensure proper semantic versioning, use these commit message prefixes:

### Version Bumps

- `BREAKING CHANGE:` or `breaking:` → **Major version** (e.g., 1.0.0 → 2.0.0)
- `feat:` or `feature:` → **Minor version** (e.g., 1.0.0 → 1.1.0)
- `fix:` → **Patch version** (e.g., 1.0.0 → 1.0.1)

### Other Types (all trigger patch version bump)

- `docs:` - Documentation changes
- `style:` - Code style/formatting changes
- `refactor:` - Code refactoring (no functional changes)
- `perf:` - Performance improvements
- `test:` - Test additions or changes
- `chore:` - Build scripts, dependencies, tooling

### Examples

```bash
# Feature (minor bump)
git commit -m "feat: add user profile customization"

# Bug fix (patch bump)
git commit -m "fix: resolve authentication timeout issue"

# Breaking change (major bump)
git commit -m "BREAKING CHANGE: remove deprecated API endpoints"

# Multiple types in one commit
git commit -m "feat: add payment processing

BREAKING CHANGE: payment API now requires authentication"
```

## Semantic Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (X.0.0) - Breaking changes that require user action
- **MINOR** (0.X.0) - New features that are backwards-compatible
- **PATCH** (0.0.X) - Backwards-compatible bug fixes

## Manual Release

To trigger a release manually:

1. Go to Actions → Automated Release
2. Click "Run workflow"
3. Select branch (main)
4. Choose bump type or leave as "auto"
5. Click "Run workflow"

## Running Locally

Test the release script locally (without pushing):

```bash
# Run the release script
node scripts/release.mjs

# This will:
# - Analyze commits
# - Update package.json and CHANGELOG.md
# - Create a local git tag
# - Generate .release-notes.md

# To complete the release:
git push origin main
git push origin v<version>
```

## Changelog Format

The CHANGELOG.md is automatically organized by change type:

```markdown
## [1.2.0] - 2025-11-03

### ⚠ BREAKING CHANGES
- Description ([abc1234](../../commit/abc1234))

### ✨ Features
- Description ([abc1234](../../commit/abc1234))

### 🐛 Bug Fixes
- Description ([abc1234](../../commit/abc1234))

### ⚡ Performance Improvements
- Description ([abc1234](../../commit/abc1234))

### ♻️ Code Refactoring
- Description ([abc1234](../../commit/abc1234))

### 📝 Documentation
- Description ([abc1234](../../commit/abc1234))

### 🔧 Other Changes
- Description ([abc1234](../../commit/abc1234))
```

## Best Practices

1. **Write clear commit messages** - Start with the type prefix
2. **Group related changes** - Use PR descriptions to summarize multiple commits
3. **Document breaking changes** - Clearly explain what changed and how to migrate
4. **Review the changelog** - Check that generated notes accurately reflect changes
5. **Test before merging** - Ensure CI passes before merging to main

## Troubleshooting

### No release created

If the workflow runs but doesn't create a release:
- Check that commits follow the convention
- Verify there are new commits since the last release
- Ensure commits are on the main branch

### Wrong version bump

If the version bump is incorrect:
- Review commit messages for proper prefixes
- Ensure BREAKING CHANGE is in commit body for major bumps
- Manually trigger workflow with specific bump type

### CI fails

If the release workflow fails:
- Check the Actions tab for error details
- Verify GITHUB_TOKEN permissions
- Ensure main branch is not protected from bot commits

## Future Enhancements

Potential improvements for the release process:
- Automated npm/registry publishing
- Release notes templates
- Automated PR labeling
- Release candidates (RC) versions
- Hotfix branch support
