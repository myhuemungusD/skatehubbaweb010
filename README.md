# 🛹 SkateHubba™

> The ultimate skateboarding platform merging AR gameplay, social interaction, and skate culture

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

**Owner:** Jason Hamilton  
**Entity:** Design Mainline LLC  
**Trademark SN:** 99356919

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

SkateHubba™ is a next-generation skateboarding platform that combines:
- **AR Gameplay**: Geo-locked trick holograms unlocked by physical check-ins
- **Remote S.K.A.T.E. Game**: Challenge friends to virtual games of SKATE
- **Spot Discovery**: Interactive map with legendary skate spots worldwide
- **Social Features**: Leaderboards, profiles, and community engagement
- **E-commerce**: Shop for exclusive SkateHubba merchandise
- **AI Skate Buddy**: Get skateboarding tips and app help from Hesher, your AI companion

---

## ✨ Features

### Core Systems
- ✅ **Firebase Authentication** - Email/password, Google, and phone authentication
- ✅ **Interactive Spot Map** - Powered by Leaflet with custom spot markers
- ✅ **Geo-Verified Check-Ins** - 30-meter radius verification using Haversine formula
- ✅ **AR Hologram Viewer** - WebXR-powered trick replay system
- ✅ **24-Hour Spot Access** - Time-limited trick unlocks after check-in
- ✅ **Remote S.K.A.T.E. Game** - Real-time multiplayer game mechanics
- ✅ **Legendary Leaderboard** - Rankings by points, check-ins, and streaks
- ✅ **Hubba Shop** - Stripe-integrated e-commerce with shopping cart
- ✅ **AI Chat Assistant** - OpenAI-powered skateboarding buddy
- ✅ **Profile Customization** - Avatar and style preferences
- ✅ **Beta Subscriber System** - Email collection with Resend notifications

### Security Features
- Rate limiting on all API endpoints
- XSS and SQL injection protection
- Secure payment processing with Stripe
- HttpOnly cookies for session management
- Firebase token verification
- Geo-verification for spot access

---

## 🛠 Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.1** - Build tool and dev server
- **Wouter 3.3** - Lightweight routing
- **Zustand 5.0** - State management
- **TanStack Query 5.51** - Server state management
- **Radix UI** - Accessible component primitives
- **Tailwind CSS 3.4** - Utility-first styling
- **Leaflet** - Interactive maps
- **Lucide React** - Icon library

### Backend
- **Node.js 20+** - Runtime environment
- **Express 4.21** - Web framework
- **TypeScript** - Type safety on server
- **Drizzle ORM 0.33** - Database toolkit
- **PostgreSQL** - Primary database
- **Firebase Admin** - Authentication and Firestore
- **Stripe** - Payment processing
- **OpenAI API** - AI chat functionality

### Infrastructure
- **Firebase** - Authentication, Firestore, Storage, FCM
- **Neon Database** - Serverless PostgreSQL
- **Stripe** - Payment gateway
- **Resend** - Transactional emails
- **Sentry** - Error monitoring

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or pnpm package manager
- PostgreSQL database (local or Neon)
- Firebase project
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/myhuemungusD/skatehubbaweb010.git
cd skatehubbaweb010
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```
See [Environment Variables](#environment-variables) for configuration details.

4. **Initialize the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

---

## 🔐 Environment Variables

### Required Variables

#### Database
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

#### Firebase Configuration
```bash
# Frontend (Vite variables)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Backend
FIREBASE_ADMIN_KEY=path-to-service-account-key.json
```

#### Security & Authentication
```bash
SESSION_SECRET=your-session-secret-min-32-chars
JWT_SECRET=your-jwt-secret-key
ADMIN_API_KEY=your-admin-api-key-for-protected-endpoints
```

### Optional Variables

#### Stripe Payment Processing
```bash
STRIPE_SECRET_KEY=sk_test_or_live_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key
```

#### AI Features
```bash
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

#### Email Notifications
```bash
RESEND_API_KEY=your-resend-api-key
```

#### Monitoring
```bash
SENTRY_DSN=your-sentry-dsn
VITE_SENTRY_DSN=your-frontend-sentry-dsn
```

#### Production
```bash
NODE_ENV=production
PORT=3001
PRODUCTION_URL=https://skatehubba.com
```

---

## 🔐 Auth + Map Setup

### Firebase Configuration

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.com)
   - Create a new project or select an existing one
   - Enable Google Analytics (optional)

2. **Enable Authentication Methods**
   - Navigate to Authentication → Sign-in method
   - Enable **Google** provider (add authorized domains)
   - Enable **Anonymous** provider
   - Enable **Email/Password** provider (optional)

3. **Set up Firestore Database**
   - Go to Firestore Database → Create database
   - Start in **production mode** or **test mode** (update rules later)
   - Choose a location close to your users

4. **Set up Firebase Storage**
   - Go to Storage → Get started
   - Use default security rules or customize as needed
   - This is used for storing trick videos and user uploads

5. **Get Firebase Configuration**
   - Go to Project Settings → General
   - Under "Your apps", add a web app (</>) if not already added
   - Copy the Firebase config object
   - Add the values to your `.env` file

### Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
# Firebase Client (Required for Auth + Firestore)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase Admin (Backend)
FIREBASE_ADMIN_KEY=path/to/serviceAccountKey.json

# App URL (for OAuth callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Geolocation & Maps

The LocationPicker component uses the browser's Geolocation API and Leaflet maps:

- **HTTPS Required**: Geolocation may require HTTPS in production browsers (Chrome, Safari)
- **Permissions**: Users must grant location permission for "Use Current Location" feature
- **Fallback**: Manual coordinate entry is always available
- **Map Tiles**: Uses OpenStreetMap tiles (free, no API key required)

### Firestore Collections

The app creates the following Firestore collections:

- `tricks` - Stores user-uploaded tricks with location data
  - Fields: name, description, videoUrl, location (lat/lng/address), userId, createdAt, likes, views

### Security Notes

- Anonymous users can access most features but may have limited permissions
- Email verification is optional for anonymous users
- Protected routes redirect unauthenticated users to `/login`
- Firestore security rules should be configured to protect user data

---

## 💻 Development

### Available Scripts

```bash
# Start development server (full stack)
npm run dev

# Build for production
npm run build

# Build client only
npm run build:client

# Build server only
npm run build:server

# Start production server
npm start

# Type checking
npm run check

# Database management
npm run db:push    # Push schema changes to database
npm run db:studio  # Open Drizzle Studio

# Firebase deployment
npm run deploy:firestore  # Deploy Firestore rules and indexes
npm run deploy:rules      # Deploy security rules only
```

### Project Scripts

The development server uses `tsx` to run TypeScript files directly:
- Frontend served by Vite at `http://localhost:5173` (proxied through Express)
- Backend API at `http://localhost:3001/api/*`
- Hot module replacement (HMR) enabled for fast development

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting (`.prettierrc`)

---

## 📚 API Documentation

### API Endpoints Overview

The API provides RESTful endpoints for authentication, spots, products, games, and more.

**Base URL**: `/api`

For complete API documentation, visit `/api/docs` when the server is running.

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - Login with Firebase token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout and clear session

#### Spots
- `GET /api/spots` - List all skate spots
- `GET /api/spots/:spotId` - Get spot details
- `POST /api/spots/check-in` - Check in at a spot (geo-verified)

#### Products & Shop
- `GET /api/products` - List all products
- `GET /api/products/:productId` - Get product details
- `POST /api/create-shop-payment-intent` - Create payment for cart

#### S.K.A.T.E. Game
- `GET /api/games` - List user's games
- `POST /api/games/create` - Create new game
- `POST /api/games/:gameId/join` - Join a game
- `POST /api/games/:gameId/trick` - Submit a trick

#### AI & Assistance
- `POST /api/ai/chat` - Chat with Hesher AI assistant
- `POST /api/assistant` - Legacy OpenAI assistant (deprecated)

See the full API documentation at `/api/docs` for request/response schemas.

---

## 🚢 Deployment

### Production Build

1. **Build the application**
```bash
npm run build
```
This creates:
- `dist/client` - Static frontend assets
- `dist/server` - Compiled backend code

2. **Set production environment variables**
Ensure all required environment variables are set in production.

3. **Start the server**
```bash
NODE_ENV=production npm start
```

### Deployment Platforms

#### Replit
- Project is Replit-ready with `.replit` configuration
- Automatic deployment on push to main branch
- Environment variables configured in Replit Secrets

#### Other Platforms (Vercel, Railway, Render)
1. Set environment variables in platform dashboard
2. Configure build command: `npm run build`
3. Configure start command: `npm start`
4. Set Node.js version to 20+

### Database Migration

```bash
# Push schema changes to production database
DATABASE_URL=<production-db-url> npm run db:push
```

### Firebase Setup

1. Configure Firebase Authentication methods in Firebase Console
2. Add production domains to authorized domains
3. Deploy Firestore rules:
```bash
npm run deploy:firestore
```

---

## 📁 Project Structure

```
skatehubbaweb010/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (routes)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── store/           # Zustand state stores
│   │   ├── config/          # Client configuration
│   │   └── App.tsx          # Main app component
│   └── public/              # Static assets
├── server/                  # Backend Express application
│   ├── auth/                # Authentication routes and services
│   ├── middleware/          # Express middleware
│   ├── storage/             # Storage layer implementations
│   ├── config/              # Server configuration
│   ├── routes.ts            # Main API routes
│   ├── index.ts             # Server entry point
│   └── db.ts                # Database connection
├── shared/                  # Shared code between client/server
│   └── schema.ts            # Database schema and types
├── scripts/                 # Build and utility scripts
├── public/                  # Public static files
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── drizzle.config.ts        # Drizzle ORM configuration
└── tailwind.config.ts       # Tailwind CSS configuration
```

### Key Directories

- **`client/src/components/`** - Reusable UI components (buttons, modals, cards)
- **`client/src/pages/`** - Top-level page components mapped to routes
- **`server/auth/`** - Authentication logic (Firebase, sessions, JWT)
- **`server/middleware/`** - Security, rate limiting, validation
- **`shared/schema.ts`** - Single source of truth for database schema

---

## 🤝 Contributing

We welcome contributions to SkateHubba™! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/myhuemungusD/skatehubbaweb010/issues)
- **Documentation**: See individual `.md` files in the repository
- **Changelog**: See [CHANGELOG.md](./CHANGELOG.md) for version history

---

## 🙏 Acknowledgments

- Built with ❤️ by Design Mainline LLC
- SkateHubba™ is a registered trademark
- Thanks to the skateboarding community for inspiration

---

**Ready to shred? Let's build the future of skateboarding together! 🛹**
