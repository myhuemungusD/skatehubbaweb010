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