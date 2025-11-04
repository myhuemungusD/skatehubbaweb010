#!/usr/bin/env node
/**
 * Automated Release Script
 * 
 * This script:
 * - Detects merged PRs since last release
 * - Parses commit messages for semantic versioning (feat:, fix:, BREAKING CHANGE:)
 * - Determines version bump (major/minor/patch)
 * - Updates CHANGELOG.md with semantic release notes
 * - Bumps version in package.json
 * - Creates git tag and GitHub release
 * 
 * Commit Message Convention:
 * - feat: New feature (minor version bump)
 * - fix: Bug fix (patch version bump)
 * - BREAKING CHANGE: Breaking change (major version bump)
 * - docs: Documentation changes
 * - style: Code style changes
 * - refactor: Code refactoring
 * - perf: Performance improvements
 * - test: Test changes
 * - chore: Build/tooling changes
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const CHANGELOG_PATH = './CHANGELOG.md';
const PACKAGE_JSON_PATH = './package.json';

// Version validation regex - only allow digits and dots
const VERSION_REGEX = /^[\d.]+$/;

// Commit type regex for conventional commits
const COMMIT_TYPE_REGEX = /^(feat|feature|fix|docs|style|refactor|perf|test|chore):\s*/i;

/**
 * Escape shell argument by wrapping in single quotes and escaping any single quotes
 */
function shellEscape(arg) {
  return `'${arg.replace(/'/g, "'\\''")}'`;
}

/**
 * Execute git command and return output
 */
function git(command) {
  try {
    return execSync(`git ${command}`, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Git command failed: git ${command}`);
    console.error(error.message);
    return '';
  }
}

/**
 * Get the last release tag
 */
function getLastReleaseTag() {
  const tags = git('tag -l "v*" --sort=-v:refname');
  if (!tags) return null;
  return tags.split('\n')[0];
}

/**
 * Get commits since last release
 * Prioritizes merge commits to detect PRs, falls back to all commits
 */
function getCommitsSinceLastRelease() {
  const lastTag = getLastReleaseTag();
  const range = lastTag ? `${lastTag}..HEAD` : 'HEAD';
  
  // First try to get merge commits (these represent merged PRs)
  const log = git(`log ${range} --pretty=format:"%H|%s|%b" --merges`);
  if (!log) {
    // If no merge commits found, get all commits
    const allLog = git(`log ${range} --pretty=format:"%H|%s|%b"`);
    return parseCommits(allLog);
  }
  
  return parseCommits(log);
}

/**
 * Parse commit log into structured data
 */
function parseCommits(log) {
  if (!log) return [];
  
  const commits = log.split('\n').filter(line => line.trim());
  return commits.map(line => {
    const parts = line.split('|');
    const hash = parts[0] || '';
    const subject = parts[1] || '';
    const body = parts.slice(2).join('|') || '';
    return { hash, subject, body };
  }).filter(commit => commit.hash && commit.subject);
}

/**
 * Categorize commits by type
 */
function categorizeCommits(commits) {
  const categories = {
    breaking: [],
    features: [],
    fixes: [],
    docs: [],
    style: [],
    refactor: [],
    perf: [],
    test: [],
    chore: [],
    other: []
  };

  for (const commit of commits) {
    if (!commit || !commit.subject) continue;
    
    const fullMessage = `${commit.subject} ${commit.body || ''}`.toLowerCase();
    const subjectLower = commit.subject.toLowerCase();
    
    if (fullMessage.includes('breaking change') || fullMessage.includes('breaking:')) {
      categories.breaking.push(commit);
    } else if (subjectLower.startsWith('feat:') || subjectLower.startsWith('feature:')) {
      categories.features.push(commit);
    } else if (subjectLower.startsWith('fix:')) {
      categories.fixes.push(commit);
    } else if (subjectLower.startsWith('docs:')) {
      categories.docs.push(commit);
    } else if (subjectLower.startsWith('style:')) {
      categories.style.push(commit);
    } else if (subjectLower.startsWith('refactor:')) {
      categories.refactor.push(commit);
    } else if (subjectLower.startsWith('perf:')) {
      categories.perf.push(commit);
    } else if (subjectLower.startsWith('test:')) {
      categories.test.push(commit);
    } else if (subjectLower.startsWith('chore:')) {
      categories.chore.push(commit);
    } else {
      categories.other.push(commit);
    }
  }

  return categories;
}

/**
 * Check if categories have any significant changes
 */
function hasAnyChanges(categories) {
  return Object.values(categories).some(arr => arr.length > 0);
}

/**
 * Determine version bump type based on commits
 */
function determineVersionBump(categories) {
  if (categories.breaking.length > 0) {
    return 'major';
  }
  if (categories.features.length > 0) {
    return 'minor';
  }
  if (hasAnyChanges(categories)) {
    return 'patch';
  }
  return null;
}

/**
 * Bump version in package.json
 */
function bumpVersion(bumpType) {
  const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  const versionParts = pkg.version.split('.');
  
  // Validate version format
  if (versionParts.length < 3 || versionParts.some(p => isNaN(parseInt(p, 10)))) {
    throw new Error(`Invalid version format in package.json: ${pkg.version}`);
  }
  
  const [major, minor, patch] = versionParts.map(p => parseInt(p, 10));
  
  let newVersion;
  switch (bumpType) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    default:
      throw new Error(`Invalid bump type: ${bumpType}`);
  }
  
  pkg.version = newVersion;
  writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(pkg, null, 2) + '\n');
  
  return newVersion;
}

/**
 * Format commit for changelog
 */
function formatCommit(commit) {
  const shortHash = commit.hash.substring(0, 7);
  const subject = commit.subject.replace(COMMIT_TYPE_REGEX, '');
  return `- ${subject} ([${shortHash}](../../commit/${commit.hash}))`;
}

/**
 * Generate changelog entry
 */
function generateChangelogEntry(version, categories) {
  const date = new Date().toISOString().split('T')[0];
  let entry = `## [${version}] - ${date}\n\n`;
  
  if (categories.breaking.length > 0) {
    entry += `### ⚠ BREAKING CHANGES\n\n`;
    categories.breaking.forEach(commit => {
      entry += formatCommit(commit) + '\n';
    });
    entry += '\n';
  }
  
  if (categories.features.length > 0) {
    entry += `### ✨ Features\n\n`;
    categories.features.forEach(commit => {
      entry += formatCommit(commit) + '\n';
    });
    entry += '\n';
  }
  
  if (categories.fixes.length > 0) {
    entry += `### 🐛 Bug Fixes\n\n`;
    categories.fixes.forEach(commit => {
      entry += formatCommit(commit) + '\n';
    });
    entry += '\n';
  }
  
  if (categories.perf.length > 0) {
    entry += `### ⚡ Performance Improvements\n\n`;
    categories.perf.forEach(commit => {
      entry += formatCommit(commit) + '\n';
    });
    entry += '\n';
  }
  
  if (categories.refactor.length > 0) {
    entry += `### ♻️ Code Refactoring\n\n`;
    categories.refactor.forEach(commit => {
      entry += formatCommit(commit) + '\n';
    });
    entry += '\n';
  }
  
  if (categories.docs.length > 0) {
    entry += `### 📝 Documentation\n\n`;
    categories.docs.forEach(commit => {
      entry += formatCommit(commit) + '\n';
    });
    entry += '\n';
  }
  
  if (categories.style.length > 0 || categories.test.length > 0 || categories.chore.length > 0) {
    entry += `### 🔧 Other Changes\n\n`;
    [...categories.style, ...categories.test, ...categories.chore].forEach(commit => {
      entry += formatCommit(commit) + '\n';
    });
    entry += '\n';
  }
  
  if (categories.other.length > 0) {
    entry += `### Other\n\n`;
    categories.other.forEach(commit => {
      entry += formatCommit(commit) + '\n';
    });
    entry += '\n';
  }
  
  return entry;
}

/**
 * Update CHANGELOG.md
 */
function updateChangelog(entry) {
  let changelog;
  try {
    changelog = readFileSync(CHANGELOG_PATH, 'utf8');
  } catch (error) {
    // If CHANGELOG doesn't exist, create a new one with a header
    changelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n---\n\n';
  }
  
  // Find the position after the header to insert new entry
  const lines = changelog.split('\n');
  const insertIndex = lines.findIndex((line, idx) => {
    // Insert after the first heading and separator
    return idx > 0 && line.startsWith('## [');
  });
  
  if (insertIndex === -1) {
    // No previous entries, add after header
    const headerEndIndex = lines.findIndex(line => line.trim() === '---');
    if (headerEndIndex !== -1) {
      lines.splice(headerEndIndex + 1, 0, '', entry.trim(), '');
    } else {
      // Just append to end
      lines.push('', entry.trim());
    }
  } else {
    lines.splice(insertIndex, 0, entry.trim(), '');
  }
  
  writeFileSync(CHANGELOG_PATH, lines.join('\n'));
}

/**
 * Create git tag and push
 */
function createGitTag(version) {
  const tagName = `v${version}`;
  git(`tag -a ${tagName} -m "Release ${tagName}"`);
  // Validate version to prevent command injection
  if (!VERSION_REGEX.test(version)) {
    throw new Error(`Invalid version format: ${version}`);
  }
  
  const tagName = `v${version}`;
  const escapedTagName = shellEscape(tagName);
  const escapedMessage = shellEscape(`Release ${tagName}`);
  git(`tag -a ${escapedTagName} -m ${escapedMessage}`);
  console.log(`✅ Created git tag: ${tagName}`);
  return tagName;
}

/**
 * Generate release notes for GitHub
 */
function generateReleaseNotes(version, categories) {
  let notes = '';
  
  if (categories.breaking.length > 0) {
    notes += `## ⚠️ BREAKING CHANGES\n\n`;
    categories.breaking.forEach(commit => {
      notes += formatCommit(commit) + '\n';
    });
    notes += '\n';
  }
  
  if (categories.features.length > 0) {
    notes += `## ✨ Features\n\n`;
    categories.features.forEach(commit => {
      notes += formatCommit(commit) + '\n';
    });
    notes += '\n';
  }
  
  if (categories.fixes.length > 0) {
    notes += `## 🐛 Bug Fixes\n\n`;
    categories.fixes.forEach(commit => {
      notes += formatCommit(commit) + '\n';
    });
    notes += '\n';
  }
  
  if (categories.perf.length > 0 || categories.refactor.length > 0) {
    notes += `## 🔧 Improvements\n\n`;
    [...categories.perf, ...categories.refactor].forEach(commit => {
      notes += formatCommit(commit) + '\n';
    });
    notes += '\n';
  }
  
  return notes.trim();
}

/**
 * Calculate total count of other changes (non-breaking, non-feature, non-fix)
 */
function countOtherChanges(categories) {
  return categories.docs.length + 
         categories.style.length + 
         categories.refactor.length + 
         categories.perf.length + 
         categories.test.length + 
         categories.chore.length + 
         categories.other.length;
}

/**
 * Main release function
 */
async function main() {
  console.log('🚀 Starting automated release process...\n');
  
  // 1. Get commits since last release
  console.log('📝 Detecting merged PRs and commits...');
  const commits = getCommitsSinceLastRelease();
  
  if (commits.length === 0) {
    console.log('ℹ️  No new commits since last release. Nothing to release.');
    return;
  }
  
  console.log(`   Found ${commits.length} commits`);
  
  // 2. Categorize commits
  console.log('\n📊 Categorizing commits...');
  const categories = categorizeCommits(commits);
  
  console.log(`   Breaking: ${categories.breaking.length}`);
  console.log(`   Features: ${categories.features.length}`);
  console.log(`   Fixes: ${categories.fixes.length}`);
  console.log(`   Other: ${countOtherChanges(categories)}`);
  
  // 3. Determine version bump
  console.log('\n🔢 Determining version bump...');
  const bumpType = determineVersionBump(categories);
  
  if (!bumpType) {
    console.log('ℹ️  No significant changes detected. Skipping release.');
    return;
  }
  
  console.log(`   Bump type: ${bumpType}`);
  
  // 4. Bump version
  console.log('\n📦 Bumping version in package.json...');
  const newVersion = bumpVersion(bumpType);
  console.log(`   New version: ${newVersion}`);
  
  // 5. Update CHANGELOG
  console.log('\n📄 Updating CHANGELOG.md...');
  const changelogEntry = generateChangelogEntry(newVersion, categories);
  updateChangelog(changelogEntry);
  console.log('   ✅ CHANGELOG.md updated');
  
  // 6. Commit changes
  console.log('\n💾 Committing changes...');
  git('add package.json CHANGELOG.md');
  // Validate version format before using in commit message
  if (!VERSION_REGEX.test(newVersion)) {
    throw new Error(`Invalid version format for commit: ${newVersion}`);
  }
  const escapedCommitMsg = shellEscape(`chore(release): ${newVersion}`);
  git(`commit -m ${escapedCommitMsg}`);
  console.log('   ✅ Changes committed');
  
  // 7. Create tag
  console.log('\n🏷️  Creating git tag...');
  const tagName = createGitTag(newVersion);
  
  // 8. Generate release notes
  console.log('\n📋 Generating release notes...');
  const releaseNotes = generateReleaseNotes(newVersion, categories);
  
  // Save release notes to a file for GitHub Actions to use
  writeFileSync('.release-notes.md', releaseNotes);
  console.log('   ✅ Release notes saved to .release-notes.md');
  
  console.log('\n✨ Release preparation complete!');
  console.log(`\nNext steps:`);
  console.log(`  1. Push changes: git push origin main`);
  console.log(`  2. Push tag: git push origin ${tagName}`);
  console.log(`  3. Create GitHub release with notes from .release-notes.md`);
  console.log(`\nOr let the CI workflow do it automatically! 🤖`);
}

// Run the script
main().catch(error => {
  console.error('❌ Release failed:', error.stack || error.message || error);
  process.exit(1);
});
