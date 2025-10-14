# Firebase Email Verification Setup Guide

## ✅ What's Configured in Your App

### 1. **Environment Variables** (All Set ✓)
Your Replit Secrets now include:
- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_AUTH_DOMAIN` = skatehubba.firebaseapp.com
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `VITE_FIREBASE_STORAGE_BUCKET` = skatehubba.appspot.com
- ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID` = 665573979824
- ✅ `VITE_FIREBASE_APP_ID`

### 2. **Email Verification Route** (`/auth/verify`)
Created a new page that handles Firebase email verification callbacks:
- Parses the verification link from Firebase
- Applies the verification code using `applyActionCode()`
- Shows success/error messages
- Auto-redirects to `/signin` after success

### 3. **Updated Auth Flow**
```
Signup → Email sent → User clicks link → /auth/verify → Verified! → Signin
```

## 🔧 Firebase Console Setup Required

You need to configure the **Action URL** in Firebase Console:

### Steps:

1. **Go to Firebase Console**
   - Navigate to: https://console.firebase.google.com
   - Select your SkateHubba project

2. **Open Authentication Settings**
   - Click "Authentication" in left sidebar
   - Click "Templates" tab
   - Select "Email verification" template

3. **Set Action URL**
   - Click "Edit template" (pencil icon)
   - Find the **Action URL** field
   - Set it to: `https://skatehubba010.replit.app/auth/verify`
   - Click "Save"

### Important Notes:
- Replace `skatehubba010.replit.app` with your actual published domain
- If you're testing locally, use: `http://localhost:5000/auth/verify`
- The Action URL tells Firebase where to redirect users after they click the email link

## 🔄 How It Works

### User Journey:

1. **Signup at `/signup`**
   - User enters email & password
   - Firebase creates account
   - Verification email sent
   - Redirected to `/verify` (instructions page)

2. **Check Email**
   - User receives email from Firebase
   - Email contains verification link
   - Link includes Firebase's `oobCode` (one-time verification code)

3. **Click Verification Link**
   - Firebase processes the link
   - Redirects to: `https://yourapp.com/auth/verify?mode=verifyEmail&oobCode=ABC123...`
   - Your app's `/auth/verify` route handles it

4. **Email Verified**
   - Success page shown
   - Auto-redirects to `/signin` after 3 seconds
   - User can now log in

5. **Login at `/signin`**
   - App checks `user.emailVerified === true`
   - If verified → Create session → Access granted
   - If not verified → Error message shown

## 🛡️ Protected Routes

These routes require verified email:
- `/map` - Map check-ins
- `/skate-game` - Remote SKATE game
- `/tutorial` - Tutorial system

Unverified users are automatically redirected to `/signin` or `/verify`.

## 🧪 Testing the Flow

### Local Testing:
1. Set Action URL to: `http://localhost:5000/auth/verify`
2. Sign up with a real email you can access
3. Check email and click verification link
4. Should redirect to local `/auth/verify` route
5. Verify success, then try logging in

### Production Testing:
1. Publish your app to get the `.replit.app` domain
2. Set Action URL to: `https://[your-app].replit.app/auth/verify`
3. Test complete flow from signup to login

## 📂 Files Modified

### New Files:
- `client/src/pages/auth-verify.tsx` - Handles Firebase email verification callback

### Updated Files:
- `client/src/lib/firebase.ts` - Uses proper env vars (no hardcoded fallbacks)
- `client/src/config/env.ts` - Added missing Firebase env vars to schema
- `client/src/lib/auth.ts` - Sends verification email to `/auth/verify`
- `client/src/App.tsx` - Added `/auth/verify` route
- `client/src/pages/signup.tsx` - Fixed Wouter Link syntax
- `client/src/pages/signin.tsx` - Fixed Wouter Link syntax
- `client/src/components/ProtectedRoute.tsx` - Enforces email verification

## ✨ All Problems Fixed

✅ Missing Firebase environment variables - ADDED
✅ Email verification URLs - CONFIGURED  
✅ /auth/verify route - CREATED
✅ Wouter Link syntax - FIXED
✅ Protected routes - IMPLEMENTED

---

**Your email verification system is ready!** Just update the Action URL in Firebase Console and you're all set! 🎉
