# SkateHubba - Mobile Skateboarding Platform

## Overview
SkateHubba is a full-stack mobile skateboarding platform featuring a React frontend and an Express.js backend. It aims to be the ultimate social gaming hub for skateboarders, offering a unique blend of community features, interactive tutorials, and a skateboarding-themed design. The project focuses on a scalable architecture and a polished user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
- **Design Theme**: Dark-themed with orange accent colors, reflecting skateboarding culture.
- **UI Framework**: Tailwind CSS with shadcn/ui and Radix UI primitives for accessible and customizable components.
- **Polish & Accessibility**: Implemented professional-level polish including smooth page transitions, loading skeletons, micro-interactions, and a robust toast system. Focus on WCAG AA compliance with custom focus indicators, keyboard navigation, screen reader support, and reduced motion/high contrast modes.
- **Mobile & PWA**: Full PWA implementation with install prompts, mobile-responsive optimizations (larger touch targets, safe area insets), and touch-friendly interactions.
- **Performance**: Code splitting, Suspense boundaries, lazy loading images, and performance monitoring.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Vite for bundling, Wouter for routing, TanStack React Query for state management, and React Hook Form with Zod for form handling.
- **Backend**: Node.js with TypeScript (ESM), Express.js for REST APIs, Drizzle ORM with Neon (serverless PostgreSQL) for database management, and `connect-pg-simple` for session storage.
- **Monorepo**: Shared code (`/shared/`) between client and server for types, schemas, and utilities.
- **Authentication**: Exclusively uses Firebase Authentication with email/password, including email verification and robust error handling.
- **Data Persistence**: PostgreSQL database via Drizzle ORM for all application data, replacing in-memory storage.
- **Tutorial System**: Dynamic onboarding tutorial with interactive guide, progress tracking, and dedicated API endpoints.

### System Design Choices
- **Directory Structure**: Clear separation between `/client/`, `/server/`, `/shared/`, and `/migrations/`.
- **API Architecture**: REST endpoints prefixed with `/api`, JSON body parsing, centralized error handling, and development logging.
- **Client-Server Communication**: Custom fetch wrapper, TanStack React Query for caching, and cookie-based session management.
- **Deployment**: Designed for easy deployment on platforms like Replit, with distinct development and production configurations. Production build consists of static frontend files and a bundled Express.js backend.

## External Dependencies

- **Database**: Neon Database (serverless PostgreSQL)
- **Authentication**: Firebase Authentication
- **UI Libraries**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS
- **Form Validation**: Zod
- **Date Handling**: date-fns
- **Build Tools**: Vite, esbuild, tsx
- **Development & Linting**: TypeScript, Prettier, ESLint

## Recent Changes

### 2025-10-15 - Email Verification Code Cleanup & UX Fixes

**Issue:** Duplicate auth files with incorrect URL overrides that could interfere with Firebase Console settings.

**Changes Made:**

1. **Removed Duplicate File:** 
   - Deleted `client/src/lib/authUtils.ts` which had custom URL override that would prevent Firebase Console settings from working

2. **Verified All sendEmailVerification Calls:**
   - ✅ `lib/auth.ts` - No custom URL (uses Firebase Console settings)
   - ✅ `lib/userService.ts` - No custom URL 
   - ✅ `pages/auth.tsx` - No custom URL
   - ✅ `pages/verify.tsx` - No custom URL

3. **Fixed Toast Duration for Actions:**
   - Increased duration to 15 seconds for toasts with action buttons
   - Added `data-testid="button-toast-resend-email"` for testing
   - Users now have sufficient time to click "Resend Email" action

**Result:** All email verification calls now properly use the action URL configured in Firebase Console. No hardcoded URLs in the codebase that could cause domain conflicts.

### 2025-10-15 - Fixed Sign-In Issue: Enhanced Email Verification UX

**Root Cause:** Users were trying to sign in without verifying their email first. The authentication system was working correctly but needed better user guidance.

**UX Improvements:**

1. **Signup Page Enhancement:**
   - Added prominent blue notice: "Email Verification Required"
   - Clear message about needing to verify email before signing in

2. **Enhanced Verify Page (/verify):**
   - Displays user's email address prominently
   - 3-step verification guide with visual icons
   - "Resend Verification Email" button with rate-limit handling
   - "Already Verified? Sign In" button

3. **Improved Sign-In Error Messaging:**
   - Targeted error: "Email Not Verified"
   - Actionable guidance with "Resend Email" button
   - 15-second toast duration for action buttons

**User Flow:** Signup → /verify with instructions → helpful sign-in errors → easy resend options → seamless verification

### 2025-10-14 - Production-Ready Pro-Level Polish

Implemented comprehensive professional polish across 8 major areas:

**UI/UX:** Smooth page transitions, loading skeletons, micro-interactions, professional toast system
**Mobile + PWA:** Complete PWA with manifest, service worker, install prompts, touch optimizations
**Performance:** Code splitting, lazy loading, performance monitoring (FCP, LCP, FID, CLS, TTFB)
**Accessibility:** WCAG AA compliance, keyboard navigation, screen readers, focus management
**SEO:** Structured data, enhanced robots.txt, Open Graph optimization

### Previous Updates

- **Firebase-Only Authentication:** Removed Replit OAuth, simplified to Firebase email/password with verification
- **PostgreSQL Integration:** Neon database with Drizzle ORM for all data persistence
- **Dynamic Tutorial System:** Interactive onboarding with progress tracking
- **SkateHubba Branding:** Official website design with skateboarding theme