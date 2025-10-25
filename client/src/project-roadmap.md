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
| **Home Menu + Navigation** | 🟩 **Complete** | 🟩 **Complete** | Polish animations and responsiveness |
| **Authentication (Firebase)** | 🟩 **Complete** | 🟩 **Complete** | Add email verification and profile sync |
| **Spot Map (Leaflet)** | 🟩 **Complete** | 🟩 **Complete** | Add dynamic filters and clustering |
| **Check-In System (Geo)** | 🟩 **Complete** | 🟩 **Complete** | Geo-verification with 30m radius working |
| **AR Mode (Spot View)** | 🟩 **Complete** | 🟩 **Complete** | Camera permissions, AR toggle, and 2D fallback implemented |
| **Closet / Profile Customization** | 🟩 **Complete** | 🟨 **In Progress** | Link avatar + style to Firestore user profile |
| **Hubba Shop** | 🟩 **Complete** | 🟨 **In Progress** | Connect Stripe test mode + live products |
| **Game of SKATE (Remote Challenge)** | 🟨 **In Progress** | 🟨 **In Progress** | Add real-time lobby + timer logic |
| **Own Your Trick Feature** | 🟨 **In Progress** | 🟨 **In Progress** | Integrate with AR unlock system |
| **AI Skate Buddy (Beagle)** | 🟩 **Complete** | 🟩 **Complete** | Chat modal with OpenAI API integration working |
| **Legendary Spot Leaderboard** | 🟩 **Complete** | 🟩 **Complete** | Leaderboard page with rankings, stats, and podium display |
| **Live Streaming / Spectator Lobby** | 🟨 **In Progress** | 🟥 **Not Started** | Add WebRTC or streaming API |
| **Hologram Trick Replay (AR)** | 🟩 **Complete** | 🟩 **Complete** | Geo-unlock integrated, AR viewer with WebXR support |
| **Spot-Locked Unlock Logic** | 🟩 **Complete** | 🟩 **Complete** | UI state managed via Zustand with 24hr expiry |
| **Notifications (Firebase FCM)** | 🟥 **Not Started** | 🟨 **In Progress** | Add push + in-app alerts |
| **Pro User Badges** | 🟨 **In Progress** | 🟨 **In Progress** | Add verification icons and Firestore flag |

---

## 🧠 Administrative & Background Systems

| System | Status | Optimization |
|--------|---------|--------------|
| **Firestore Schema** | 🟩 **Complete** | Add indexes for spots + tricks |
| **Firebase Storage** | 🟩 **Complete** | Strengthen upload rules |
| **Cloud Functions** | 🟩 **Complete** | Add cooldown + expiry cleanup |
| **Auth Rules** | 🟩 **Complete** | Enforce write limits per user |
| **App Theming** | 🟩 **Complete** | Add dark mode parity |

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
- Each task marked:
  - 🟩 **Complete** = Fully implemented and tested
  - 🟨 **In Progress** = Partially built or needs backend integration
  - 🟥 **Not Started** = Not yet implemented
- Update after each commit.  
- Replit Agent can parse this file to generate next tasks automatically.  

---

## 🧾 Automatic Changelog Integration

Each time a feature's status changes to 🟩 **Complete**, append an entry to `CHANGELOG.md` in the following format:

```markdown
## [YYYY-MM-DD]

### Completed Features
- **[Feature Name]** – One-line summary of what was built or improved.
- Include implementation details and component/file references if applicable.

### Next Target
- List the next feature still marked 🟨 **In Progress** or 🟥 **Not Started** in project-roadmap.md.
```

**Guidelines:**
- Keep entries chronologically ordered (newest on top)
- Include file paths for major components (e.g., `ARCheckInButton.tsx`, `/api/spots/check-in`)
- Reference backend endpoints and integrations
- Commit CHANGELOG.md updates alongside feature completion
- Next targets should align with Priority Build Order

---

### 🔄 Command for Replit Agent
In the Replit AI prompt bar, paste:
