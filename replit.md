# SkateHubba - Mobile Skateboarding Platform

## Overview
SkateHubba is a full-stack mobile skateboarding platform featuring a React frontend and an Express.js backend. It aims to be the ultimate social gaming hub for skateboarders, offering a unique blend of community features, interactive tutorials, and a skateboarding-themed design. The project focuses on a scalable architecture and a polished user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## Project Documentation
- **CHANGELOG.md**: Tracks all completed features from project-roadmap.md. Each time a feature is marked complete (✅), append a new dated section with completed features and next targets. Keep chronologically ordered (newest on top).

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
- **Authentication**: Uses Firebase Authentication with multiple methods (email/password with verification, phone authentication with SMS, Google sign-in). Includes robust error handling and secure session management.
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

### 2025-10-25 - Completed Core AR & Social Features

**New Features:** Built three major platform features completing the core gameplay and social loop.

**Implementation:**

1. **AR Check-In System with Geo-Verification:**
   - Created `ARCheckInButton.tsx` component with 30-meter radius geo-verification
   - Built backend API endpoint `/api/spots/check-in` for location validation
   - Integrated toast feedback and real-time check-in status updates
   - Created `useSpotAccess.ts` Zustand store for managing check-in state with 24-hour expiry

2. **AR Trick Viewer (Hologram Replay):**
   - Created `ARTrickViewer.tsx` component with WebXR support for AR viewing
   - Implemented locked/unlocked states based on check-in status
   - Added AR mode toggle with camera permissions handling
   - Integrated with spot unlock system for seamless gameplay loop

3. **AI Skate Buddy Chat (Beagle):**
   - Built `AISkateChat.tsx` global chat modal accessible anywhere in app
   - Integrated OpenAI API for skateboarding-themed AI assistant
   - Created backend `/api/ai/chat` endpoint with streaming support
   - Implemented auto-scrolling messages and typing indicators

4. **Legendary Spot Leaderboard:**
   - Created full leaderboard page at `/leaderboard` with routing
   - Built podium display for top 3 skaters with gradient cards and trophy icons
   - Implemented full rankings table with stats: points, check-ins, spots, tricks, streaks
   - Mobile-responsive design matching SkateHubba theme

5. **Project Documentation:**
   - Created `CHANGELOG.md` to track all completed features chronologically
   - Updated `project-roadmap.md` marking 5 features as ✅ Complete

**Result:** Core AR gameplay loop is now functional end-to-end. Users can check in at spots, unlock AR tricks, chat with AI, and compete on leaderboards. All features integrated and ready for production use.

### 2025-10-15 - Added Google Sign-In

**New Feature:** Integrated Google authentication as an additional sign-in method alongside email/password and phone authentication.

**Implementation:**

1. **Google Auth Integration:**
   - Added `GoogleAuthProvider` and `signInWithPopup` imports to `lib/auth.ts`
   - Created `loginWithGoogle()` function using Firebase Google authentication
   - Seamless backend integration with same HttpOnly cookie session management

2. **UI/UX Enhancement:**
   - Added Google sign-in button to `/signin` page with clean divider
   - White background button with Google icon for clear brand recognition
   - SkateHubba-themed styling (orange/black color scheme maintained)
   - Proper loading states and error handling

3. **Multi-Provider Authentication:**
   - ✅ Email/password with email verification
   - ✅ Phone number with SMS verification
   - ✅ Google sign-in (one-click authentication)
   - All methods use the same secure session management

**Result:** Users can now sign in with their Google account for faster, more convenient access while maintaining the same security standards across all authentication methods.

### 2025-10-15 - Added Phone Authentication Support

**New Feature:** Expanded authentication methods to include phone number sign-in with SMS verification.

**Implementation:**

1. **Firebase Phone Auth Integration:**
   - Added `signInWithPhoneNumber` and `RecaptchaVerifier` imports to `lib/auth.ts`
   - Created `setupRecaptcha()` function with invisible reCAPTCHA
   - Created `sendPhoneVerification()` function to send SMS codes
   - Created `verifyPhoneCode()` function to confirm and authenticate

2. **UI/UX Enhancement:**
   - Added phone authentication section to `/signin` page
   - Phone number input with international format placeholder (+1 760 555 1234)
   - Green "Send Code" button for SMS verification
   - Two-step flow: Enter phone → Enter OTP verification code
   - "Change phone number" option to go back and edit number
   - Invisible reCAPTCHA integration for bot protection

3. **Authentication Flow:**
   - User enters phone number → reCAPTCHA verification → SMS sent
   - User enters verification code → Firebase confirms → Backend session created
   - Same secure session management (HttpOnly cookies) as email auth

4. **Multi-Method Support:**
   - Email/password with email verification
   - Phone number with SMS verification
   - Google sign-in (one-click authentication)

**Result:** Users can now choose between email, phone, or Google authentication, providing maximum flexibility and accessibility for sign-in methods.

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