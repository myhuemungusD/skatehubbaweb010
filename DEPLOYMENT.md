# Deployment Configuration

This repository uses automated deployment via GitHub Actions for both Firebase Functions and Vercel.

## Workflow Overview

The deployment workflow (`.github/workflows/deploy.yml`) performs the following tasks:

1. **Build Application**: Builds the client and server code
2. **Check Build Logs**: Scans build logs for errors and warnings
3. **Deploy Firebase Functions**: Deploys Cloud Functions to Firebase (main branch only)
4. **Deploy to Vercel**: Deploys the application to Vercel production (main branch only)
5. **PR Comment**: Posts a deployment summary comment on pull requests

## Required Secrets

To enable full deployment functionality, configure the following GitHub repository secrets:

### Firebase Deployment

- `FIREBASE_TOKEN`: Firebase CI token for deployment
  - Generate: Run `firebase login:ci` locally and copy the token

### Vercel Deployment

- `VERCEL_TOKEN`: Vercel authentication token
  - Generate: [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`: Your Vercel organization ID (optional)
  - Find in: Vercel project settings or `.vercel/project.json`
- `VERCEL_PROJECT_ID`: Your Vercel project ID (optional)
  - Find in: Vercel project settings or `.vercel/project.json`

## Configuration Files

### Firebase (`firebase.json`)

Configures:
- Firestore rules and indexes
- Cloud Functions deployment
- Hosting configuration (optional)

### Vercel (`vercel.json`)

Configures:
- Build settings
- Routes and redirects
- Output directory

## Firebase Functions

Cloud Functions are located in the `functions/` directory:

```
functions/
├── src/
│   └── index.ts          # Main functions entry point
├── package.json          # Functions dependencies
├── tsconfig.json         # TypeScript configuration
└── .gitignore
```

### Example Functions Included

1. **helloWorld**: HTTP endpoint example
2. **onUserCreated**: Firestore trigger example
3. **dailyCleanup**: Scheduled function example

## Local Development

### Build the application

```bash
npm run build
```

### Deploy Firebase Functions manually

```bash
cd functions
npm install
npm run deploy
```

### Deploy to Vercel manually

```bash
npm install -g vercel
vercel --prod
```

## Workflow Triggers

The deployment workflow runs on:

- **Push to main**: Full deployment (Firebase + Vercel)
- **Pull requests**: Build and check only, posts summary comment
- **Manual dispatch**: Full deployment via GitHub Actions UI

## Deployment Summary

On pull requests, the workflow automatically posts a comment with:

- Build status (success/failure)
- Error and warning counts
- Firebase Functions deployment status
- Vercel deployment status and URL
- Links to workflow logs

## Troubleshooting

### Firebase deployment fails

1. Check that `FIREBASE_TOKEN` is set correctly
2. Verify Firebase project is initialized: `firebase use --add`
3. Review Firebase Functions logs: `firebase functions:log`

### Vercel deployment fails

1. Check that `VERCEL_TOKEN` is set correctly
2. Verify Vercel project is linked locally: `vercel link`
3. Check Vercel deployment logs in the Vercel dashboard

### Build errors

1. Review the build logs artifact in GitHub Actions
2. Run `npm run build` locally to reproduce
3. Check for TypeScript errors: `npm run check`

## GitHub Actions Permissions

The workflow requires:

- `contents: read` - To checkout code
- `pull-requests: write` - To post PR comments
- `id-token: write` - For OIDC authentication (if used)
