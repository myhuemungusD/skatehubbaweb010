# SkateHubba: UI-to-Backend Feature Mapping
**Generated**: October 28, 2025  
**Status**: Comprehensive Feature Audit

---

## Feature Map Legend
- ✅ **Fully Connected**: UI has working backend integration
- ⚠️ **Partially Connected**: UI exists but backend is incomplete
- ❌ **Missing Connection**: UI or backend endpoint missing
- 🔄 **Mock Data**: Using hardcoded/mock data instead of backend

---

## 1. AUTHENTICATION SYSTEM

### Pages/Routes
- `/signup` - Signup Page
- `/signin` - Login Page  
- `/verify` - Email verification instructions
- `/auth/verify` - Firebase email verification callback
- `/verified` - Email verification success

### UI Implementation
- ✅ Firebase Auth client SDK (`client/src/lib/firebase.ts`)
- ✅ Auth hooks (`client/src/hooks/useAuth.tsx`)
- ✅ Protected route wrapper (`client/src/components/ProtectedRoute.tsx`)

### Backend Endpoints
- ✅ `POST /api/auth/login` - Firebase ID token → Session cookie
- ✅ `GET /api/auth/me` - Get current user
- ✅ `POST /api/auth/logout` - Clear session

### Connection Status
**✅ FULLY CONNECTED**
- Firebase Auth handles frontend authentication
- Backend validates Firebase ID tokens
- Session management with HttpOnly cookies
- Email verification flow configured

### Notes
- Requires `FIREBASE_ADMIN_KEY` for production (currently using default credentials)
- Email verification Action URL needs configuration in Firebase Console

---

## 2. SHOP & E-COMMERCE

### Pages/Routes
- `/shop` - Product catalog
- `/cart` - Shopping cart
- `/checkout` - Stripe checkout
- `/order-confirmation` - Order success page

### UI Implementation
- ✅ Shop page (`client/src/pages/shop.tsx`) - Static products
- ✅ Cart system (`client/src/components/cart/`)
- ✅ Add to cart button component
- ✅ Cart drawer component
- ✅ Stripe Elements integration

### Backend Endpoints
- ✅ `POST /api/create-shop-payment-intent` - Create Stripe PaymentIntent
- ✅ `GET /api/payment-intent/:id` - Get payment status
- ⚠️ `GET /api/shop/items` - **MISSING** (products are hardcoded)
- ⚠️ `POST /api/shop/purchase` - **MISSING** (order recording)
- ⚠️ `GET /api/shop/users/:userId/purchases` - **MISSING** (order history)

### Connection Status
**⚠️ PARTIALLY CONNECTED**
- ✅ Payment processing works (Stripe)
- 🔄 Products are hardcoded in UI (no backend product management)
- ❌ No order/purchase recording
- ❌ No purchase history

### Issues Found
1. Products defined in `client/src/pages/shop.tsx` as hardcoded array
2. Product prices duplicated in `server/routes.ts` line 680-684
3. No database schema for products or orders
4. Cart state is client-side only (localStorage)

---

## 3. CLOSET / INVENTORY

### Pages/Routes
- `/closet` - User's digital closet/inventory

### UI Implementation
- ✅ Closet page (`client/src/pages/closet.tsx`)
- 🔄 Mock collectibles (hardcoded array)
- ⚠️ Queries `/api/inventory` endpoint (may not exist)

### Backend Endpoints
- ❌ `GET /api/inventory/:userId` - **MISSING**
- ❌ `GET /api/shop/users/:userId/inventory` - **MISSING**
- ❌ `POST /api/users/:userId/inventory/:itemId/equip` - **MISSING**

### Connection Status
**🔄 MOCK DATA**
- UI shows hardcoded collectibles
- No backend integration
- No database schema for inventory

### Issues Found
1. Closet page has mock data for trick collectibles
2. No backend endpoint implementation
3. No database tables for user inventory

---

## 4. MAP & CHECK-INS & AR

### Pages/Routes
- `/map` - Skate spot map with check-ins

### UI Implementation
- ✅ Map page (`client/src/pages/map.tsx`)
- ✅ AR Check-In Button component (`client/src/components/ARCheckInButton.tsx`)
- ✅ AR Trick Viewer component (`client/src/components/ARTrickViewer.tsx`)
- 🔄 Spots are hardcoded array (lines 32-66 in map.tsx)

### Backend Endpoints
- ✅ `POST /api/spots/check-in` - Geo-verified check-in
- ⚠️ `GET /api/spots` - **EXISTS but may not be fully implemented**
- ⚠️ `GET /api/spots/:spotId` - **EXISTS but may not be fully implemented**
- ⚠️ `GET /api/checkins` - **EXISTS but may not be fully implemented**

### Connection Status
**⚠️ PARTIALLY CONNECTED**
- ✅ Check-in endpoint exists
- 🔄 Spots are hardcoded in UI
- ⚠️ No spot database/CRUD
- ✅ AR components present

### Issues Found
1. Spots hardcoded in `client/src/pages/map.tsx`
2. Check-in mutation implemented but spots come from mock data
3. No real spot management system

---

## 5. S.K.A.T.E. GAME

### Pages/Routes
- `/skate-game` - Remote SKATE battles

### UI Implementation
- ✅ Game page (`client/src/pages/skate-game.tsx`)
- 🔄 Hardcoded mock games (lines 41-89)
- ✅ Create, Join, Submit trick mutations configured
- ✅ Full UI for active, waiting, and completed games

### Backend Endpoints
- ❌ `POST /api/games/create` - **MISSING** (called by UI)
- ❌ `POST /api/games/:gameId/join` - **MISSING** (called by UI)
- ❌ `POST /api/games/:gameId/trick` - **MISSING** (called by UI)
- ❌ `GET /api/games` - **MISSING** (should exist)
- ❌ `GET /api/games/:gameId` - **MISSING** (should exist)

### Connection Status
**🔄 MOCK DATA ONLY**
- UI fully built but not connected
- All games are hardcoded mock data
- Mutations make API calls to non-existent endpoints
- No backend implementation at all

### Issues Found
1. Complete backend missing for S.K.A.T.E. game system
2. Need database schema for games, turns, tricks
3. Need WebSocket/real-time updates for turn notifications
4. UI is ready but makes calls to endpoints that don't exist

---

## 6. LEADERBOARD

### Pages/Routes
- `/leaderboard` - Global and spot leaderboards

### UI Implementation
- ✅ Leaderboard page (`client/src/pages/leaderboard.tsx`)
- 🔄 Hardcoded mock leaderboard data (lines 26-117)
- ✅ Podium display for top 3
- ✅ Full ranking table
- ✅ User stats card

### Backend Endpoints
- ❌ `GET /api/leaderboard` - **MISSING** (no API calls made)
- ❌ `GET /api/leaderboard/global` - **MISSING**
- ❌ `GET /api/spots/:spotId/leaderboard` - **MISSING**

### Connection Status
**🔄 MOCK DATA ONLY**
- UI completely built with hardcoded data
- No API queries configured
- No backend endpoints exist
- Static display only

### Issues Found
1. No backend implementation for leaderboard
2. No database queries for ranking calculation
3. No API integration - page shows only mock data
4. Missing user stats calculation

---

## 7. TUTORIAL SYSTEM

### Pages/Routes
- `/tutorial` - Interactive onboarding

### UI Implementation
- ✅ Tutorial page (`client/src/pages/tutorial.tsx`)
- ✅ Queries tutorial steps and progress
- ✅ Progress tracking mutation

### Backend Endpoints
- ✅ `GET /api/tutorial/steps` - Get all tutorial steps
- ✅ `GET /api/tutorial/steps/:id` - Get specific step
- ✅ `GET /api/users/:userId/progress` - Get user progress
- ✅ `GET /api/users/:userId/progress/:stepId` - Get specific progress
- ✅ `POST /api/users/:userId/progress` - Create progress
- ✅ `PATCH /api/users/:userId/progress/:stepId` - Update progress

### Connection Status
**✅ FULLY CONNECTED**
- All endpoints implemented
- Database schema exists
- UI properly integrated with backend

---

## 8. DONATIONS / SUPPORT

### Pages/Routes
- `/donate` - Donation page with Stripe

### UI Implementation
- ✅ Donation page (`client/src/pages/donate.tsx`)
- ✅ Stripe Elements integration
- ✅ Custom amount input
- ✅ Recent donors display

### Backend Endpoints
- ✅ `POST /api/create-payment-intent` - Create donation PaymentIntent
- ✅ `GET /api/payment-intent/:id` - Get payment status
- ✅ `POST /api/record-donation` - Record successful donation
- ✅ `GET /api/recent-donors` - Get recent donors

### Connection Status
**✅ FULLY CONNECTED**
- Payment processing works
- Donation recording functional
- Recent donors display working

---

## 9. AI SKATE BUDDY (HESHER)

### UI Implementation
- ✅ AI Skate Chat component (`client/src/components/AISkateChat.tsx`)
- ✅ Global floating chat button
- ✅ Chat interface

### Backend Endpoints
- ✅ `POST /api/ai/chat` - Hesher AI chat
- ✅ `POST /api/assistant` - Legacy OpenAI assistant

### Connection Status
**✅ FULLY CONNECTED**
- AI chat endpoint functional
- OpenAI/Gemini integration ready
- Requires `OPENAI_API_KEY` or `GOOGLE_AI_API_KEY`

---

## 10. FEEDBACK SYSTEM

### UI Implementation
- ✅ Feedback button component (`client/src/components/FeedbackButton.tsx`)
- ✅ Global feedback form

### Backend Endpoints
- ✅ `POST /api/feedback` - Submit feedback (from server/index.js)

### Connection Status
**✅ FULLY CONNECTED**
- Feedback submission works
- Database storage functional

---

## 11. EMAIL SUBSCRIPTIONS

### UI Implementation
- ⚠️ **NOT VISIBLE IN MAIN APP** (may be on landing pages)

### Backend Endpoints
- ✅ `POST /api/subscribe` - Create email subscriber
- ✅ `GET /api/subscribers` - Get all subscribers (admin only)

### Connection Status
**✅ BACKEND READY**
- Endpoints fully implemented
- Email notification system ready
- No UI form in main app (check landing pages)

---

## CRITICAL GAPS FOUND

### 1. S.K.A.T.E. GAME SYSTEM (🔴 CRITICAL - HIGHEST PRIORITY)
**Missing**:
- ALL backend endpoints (`/api/games/*`)
- Database schema for games, players, turns, tricks
- Real-time game state synchronization
- Turn notification system

**Impact**: ❌ **FEATURE COMPLETELY NON-FUNCTIONAL** - UI makes calls to non-existent endpoints

### 2. LEADERBOARD SYSTEM (🔴 CRITICAL - HIGH PRIORITY)
**Missing**:
- ALL backend endpoints
- Ranking calculation logic
- Points/stats aggregation
- Database queries for user rankings

**Impact**: ❌ **FEATURE COMPLETELY NON-FUNCTIONAL** - Shows only hardcoded mock data

### 3. SHOP SYSTEM (🟡 HIGH PRIORITY)
**Missing**:
- Product database management
- Order/purchase recording
- Purchase history endpoint
- Inventory management after purchase

**Impact**: ⚠️ Users can checkout but orders aren't recorded

### 4. CLOSET/INVENTORY (🟡 HIGH PRIORITY)
**Missing**:
- Complete backend implementation
- Database schema for inventory
- Equip/unequip functionality
- Integration with shop purchases

**Impact**: ❌ **FEATURE COMPLETELY NON-FUNCTIONAL**

### 5. SPOT MANAGEMENT (🟡 MEDIUM PRIORITY)
**Missing**:
- Spot CRUD endpoints
- Database-backed spot data
- Spot creation/editing UI

**Impact**: ⚠️ Using hardcoded spots only

---

## RECOMMENDATIONS

### Immediate Actions
1. ✅ Fix LSP errors (COMPLETED)
2. 🔄 Implement Shop order recording system
3. 🔄 Implement Closet/Inventory backend
4. 🔄 Convert hardcoded spots to database-backed system
5. 🔄 Investigate SKATE Game and Leaderboard implementations

### Database Schema Needed
- `products` table (id, name, price, description, image, category)
- `orders` table (id, userId, items, total, status, createdAt)
- `user_inventory` table (id, userId, itemId, equippedAt, purchasedAt)
- `spots` table (already exists? need verification)
- `check_ins` table (already exists? need verification)

---

## NEXT STEPS
1. Investigate protected routes (SKATE Game, Leaderboard)
2. Test existing connected features
3. Implement missing critical endpoints
4. Add proper database schemas
5. End-to-end testing with Playwright
