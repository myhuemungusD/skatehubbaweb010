# 🛹 SkateHubba™ Development Roadmap
**Owner:** Jason Hamilton  
**Entity:** Design Mainline LLC  
**Trademark SN:** 99356919  
**Version:** 1.0 – October 2025  

---

## 🎯 Goal
Build the production-ready SkateHubba™ platform — merging skate culture, AR gameplay, and social interaction.  
This document tracks frontend, backend, and integration status for every core feature.

---

## 🧩 Core App Systems

| Feature | Frontend/UI | Backend/Integration | Next Steps |
|----------|--------------|--------------------|-------------|
| **Home Menu + Navigation** | ✅ Done | ✅ Done | Polish animations and responsiveness |
| **Authentication (Firebase)** | ✅ Working | ✅ Working | Add email verification and profile sync |
| **Spot Map (Leaflet)** | ✅ Map live | ✅ Firestore connected | Add dynamic filters and clustering |
| **Check-In System (Geo)** | ⚠️ Partial UI | 🟢 Cloud Function ready (`verifyUserAtSpot`) | Build full check-in button and toast feedback |
| **AR Mode (Spot View)** | ⚠️ Prototype | 🟡 In progress | Add camera permission flow and toggle UX |
| **Closet / Profile Customization** | ✅ Layout done | ⚠️ Mock data only | Link avatar + style to Firestore user profile |
| **Hubba Shop** | ✅ UI shell | ⚠️ No Stripe backend | Connect Stripe test mode + live products |
| **Game of SKATE (Remote Challenge)** | ⚠️ Partial UI | 🟡 Video challenge WIP | Add real-time lobby + timer logic |
| **Own Your Trick Feature** | 🟡 Design ready | ⚠️ Not linked | Integrate with AR unlock system |
| **AI Skate Buddy (Beagle)** | ⚠️ Concept only | ❌ Missing | Build chat modal + OpenAI API route |
| **Legendary Spot Leaderboard** | ❌ Missing | ⚠️ Concept | Create leaderboard screen + scoring logic |
| **Live Streaming / Spectator Lobby** | ⚠️ Placeholder | ❌ Missing | Add WebRTC or streaming API |
| **Hologram Trick Replay (AR)** | ⚠️ Planned (`ARTrickViewer.tsx`) | ⚠️ Model logic pending | Link to geo-unlock + optimize load |
| **Spot-Locked Unlock Logic** | ⚠️ Button incomplete | 🟢 Cloud Function ready | Integrate UI state + animation |
| **Notifications (Firebase FCM)** | ❌ Missing | ⚠️ Setup incomplete | Add push + in-app alerts |
| **Pro User Badges** | ⚠️ Placeholder | ⚠️ Needs backend field | Add verification icons and Firestore flag |

---

## 🧠 Administrative & Background Systems

| System | Status | Optimization |
|--------|---------|--------------|
| **Firestore Schema** | ✅ Production mode | Add indexes for spots + tricks |
| **Firebase Storage** | ✅ Configured | Strengthen upload rules |
| **Cloud Functions** | 🟢 Deployed (`verifyUserAtSpot`) | Add cooldown + expiry cleanup |
| **Auth Rules** | ✅ Working | Enforce write limits per user |
| **App Theming** | ✅ Branded (orange / black / green) | Add dark mode parity |

---

## 🚀 Priority Build Order (Next Milestones)
1. **AR Check-In Button + AR Trick Viewer Integration** – main gameplay loop.  
2. **AI Skate Buddy Chat UI** – brand personality.  
3. **Leaderboard System** – engagement + ranking.  
4. **Closet / Profile Firestore Sync** – persistence.  
5. **Hubba Shop Stripe Integration** – monetization.  
6. **Fallback UI for Non-AR Devices** – accessibility.

---

## 🔒 Geo-Secure Unlock Logic Recap
- Function: `verifyUserAtSpot`  
- Radius: ≤ 30 m  
- Access expires: 24 hrs  
- Storage path: `/tricks/holograms/{trickId}.glb`  
- Frontend components:  
  - `/components/ARCheckInButton.tsx`  
  - `/components/ARTrickViewer.tsx`  
- State: `/lib/store/useSpotAccess.ts`  

---

## 🧾 Tracking Method
- Each task marked ✅ = complete, ⚠️ = partial, ❌ = missing.  
- Update after each commit.  
- Replit Agent can parse this file to generate next tasks automatically.  

---

### 🔄 Command for Replit Agent
In the Replit AI prompt bar, paste:
