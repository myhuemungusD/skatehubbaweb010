# Firestore Integration for SkateHubba

## Overview

SkateHubba uses a **hybrid database architecture**:
- **PostgreSQL (Neon)** - Primary database for core application data (user profiles, spots, challenges, purchases, etc.)
- **Firestore** - Real-time features requiring live updates and instant synchronization

This approach leverages the strengths of both systems:
- PostgreSQL provides strong consistency, complex queries, and relationships
- Firestore enables real-time updates, scalability, and offline support

## Firestore Collections

### Real-Time Features

| Collection | Purpose | Security Level |
|------------|---------|----------------|
| `users` | User profiles and public data | Read: All authenticated users<br>Write: Own profile only |
| `chat_messages` | AI Skate Buddy (Beagle) conversations | Read/Write: Own messages only |
| `game_sessions` | Live SKATE game matches | Read/Write: Participants only |
| `notifications` | Real-time user notifications | Read/Update: Own notifications<br>Create: Server only |
| `active_checkins` | Live spot check-ins | Read: All authenticated<br>Write: Own check-ins |
| `challenge_votes` | Real-time challenge voting | Read: All authenticated<br>Write: Own votes (1 per submission) |
| `leaderboard_live` | Live leaderboard updates | Read: All authenticated<br>Write: Server only |

### Legacy Collections

| Collection | Purpose | Security Level |
|------------|---------|----------------|
| `signups` | Email signup forms | Write: Email submissions only |
| `mail` | Email queue | Server only |
| `subscriptions` | Newsletter subscribers | Server only |

## Security Rules Architecture

The `firestore.rules` file implements defense-in-depth security:

### Core Security Principles

1. **Authentication Required** - All operations require Firebase Authentication
2. **Data Ownership** - Users can only access/modify their own data
3. **Field Validation** - Strict validation of data types, lengths, and formats
4. **Role Enforcement** - Clients restricted to specific roles (e.g., 'user' messages only)
5. **Immutable Fields** - Core fields (userId, createdAt) cannot be changed
6. **Server-Only Operations** - Sensitive operations restricted to Admin SDK
7. **Document ID Patterns** - Enforced naming conventions for ownership and deduplication

**Note:** Rate limiting must be implemented server-side (see Rate Limiting section).

### Helper Functions

The rules use reusable helper functions:

```javascript
// Check if user is authenticated
isAuthenticated()

// Check if user owns the resource
isOwner(userId)

// Validate required fields exist
hasRequiredFields(['field1', 'field2'])

// Validate string length
isValidString(field, minLen, maxLen)

// Validate timestamp is recent (within 5 minutes)
isRecentTimestamp(field)

// Check if user is a game participant
isGameParticipant(gameData)
```

### Example Rules

**User Profiles:**
```javascript
match /users/{userId} {
  // Anyone can read profiles
  allow read: if isAuthenticated();
  
  // Only owner can create/update their profile
  allow create, update: if isOwner(userId)
    && hasRequiredFields(['userId', 'displayName'])
    && isValidString('displayName', 1, 50);
}
```

**Game Sessions:**
```javascript
match /game_sessions/{gameId} {
  // Can only read games you're in
  allow read: if isAuthenticated() 
    && (resource.data.player1Id == request.auth.uid 
        || resource.data.player2Id == request.auth.uid);
  
  // Can update only if it's your turn
  allow update: if isGameParticipant(resource.data)
    && resource.data.currentTurn == request.auth.uid;
}
```

## Deployment

### 1. Deploy Security Rules

Using Firebase CLI:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore in your project (one-time setup)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

### 2. Verify Rules

Test your rules in the Firebase Console:
1. Go to Firebase Console → Firestore Database → Rules
2. Click "Rules playground" to test scenarios
3. Verify rules are active (check timestamp)

### 3. Monitor Security

Firebase Console provides:
- **Usage monitoring** - Track reads/writes per collection
- **Security audit** - Identify potential vulnerabilities
- **Error logging** - See denied operations

## Usage in Code

### Client-Side Hooks

Use the custom Firestore hooks for real-time data:

```typescript
import { useFirestoreCollection, useFirestoreDocument, where, orderBy, limit } from '@/lib/firestore';

// Listen to user's chat messages
const { data: messages, loading, error } = useFirestoreCollection(
  'chat_messages',
  [
    where('userId', '==', currentUserId),
    orderBy('createdAt', 'desc'),
    limit(50)
  ]
);

// Listen to a specific game session
const { data: game, loading } = useFirestoreDocument(
  'game_sessions',
  gameId
);

// Listen to active check-ins at a spot
const { data: activeUsers } = useFirestoreCollection(
  'active_checkins',
  [where('spotId', '==', spotId)]
);
```

### CRUD Operations

```typescript
import { 
  createDocument, 
  updateDocument, 
  deleteDocument,
  firestoreCollections 
} from '@/lib/firestore';
import { auth } from '@/lib/firebase';

// Create a check-in (ID MUST be userId_spotId format for security)
const spotId = '123';
const checkinId = `${auth.currentUser.uid}_${spotId}`;
await createDocument(firestoreCollections.activeCheckins, {
  userId: auth.currentUser.uid,
  spotId: spotId,
  displayName: auth.currentUser.displayName,
  checkedInAt: new Date(), // REQUIRED field
  latitude: 34.0522,
  longitude: -118.2437
}, checkinId);

// Create a user chat message (ID MUST start with userId for security)
// NOTE: Rate limiting should be handled server-side (see Rate Limiting section)
const userId = auth.currentUser.uid;
const messageId = `${userId}_${Date.now()}`;
await createDocument(firestoreCollections.chatMessages, {
  userId: userId,
  message: 'How do I land a kickflip?',
  role: 'user' // Client can ONLY create 'user' messages
}, messageId);

// Create a challenge vote (ID MUST be userId_submissionId format)
const submissionId = 'sub_123';
const voteId = `${auth.currentUser.uid}_${submissionId}`;
await createDocument(firestoreCollections.challengeVotes, {
  userId: auth.currentUser.uid,
  challengeId: 'challenge_456',
  submissionId: submissionId,
  voteType: 'upvote'
}, voteId);

// Update notification to read (NO updatedAt - only read/readAt allowed)
await updateDocument(firestoreCollections.notifications, notificationId, {
  read: true,
  readAt: new Date()
});

// Update user profile (with optional updatedAt)
await updateDocument(firestoreCollections.users, userId, {
  displayName: 'New Name',
  bio: 'Updated bio'
}, { addTimestamp: true }); // Optional: adds updatedAt field

// Delete check-in
await deleteDocument(firestoreCollections.activeCheckins, checkinId);
```

### Server-Side Access

On the backend, use Firebase Admin SDK for server-only operations:

```typescript
import { db } from './firestore';
import admin from 'firebase-admin';

// Create a notification (server-only - clients cannot create)
await db.collection('notifications').add({
  userId: targetUserId,
  type: 'challenge_complete',
  title: 'Challenge Completed!',
  message: 'You earned 100 points!',
  read: false,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});

// Create AI assistant response (server-only - clients can only create 'user' messages)
const messageId = `${userId}_${Date.now()}_assistant`;
await db.collection('chat_messages').doc(messageId).set({
  userId: userId,
  message: 'A kickflip requires practice! Start with ollies first.',
  role: 'assistant', // Only server can create assistant messages
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});

// Update leaderboard (server-only - clients cannot write)
await db.collection('leaderboard_live').doc(userId).set({
  userId,
  displayName: 'Pro Skater',
  rank: 1,
  points: 1500,
  totalCheckins: 45,
  spotsDiscovered: 12,
  tricksLanded: 89,
  currentStreak: 7,
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});
```

## Data Schemas

### User Profile
```typescript
interface UserProfile {
  userId: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'pro';
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

### Chat Message
```typescript
interface ChatMessage {
  userId: string;
  message: string;
  role: 'user' | 'assistant';
  createdAt: Timestamp;
}
```

### Game Session
```typescript
interface GameSession {
  player1Id: string;
  player2Id: string;
  currentTurn: string;
  status: 'waiting' | 'active' | 'completed' | 'abandoned';
  gameState?: object;
  letters?: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

### Notification
```typescript
interface Notification {
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt?: Timestamp;
  metadata?: object;
  createdAt: Timestamp;
}
```

### Active Check-In
```typescript
interface ActiveCheckin {
  userId: string;
  spotId: string;
  displayName: string;
  latitude?: number;
  longitude?: number;
  checkedInAt: Timestamp;
  checkedOutAt?: Timestamp;
}
```

### Challenge Vote
```typescript
interface ChallengeVote {
  userId: string;
  challengeId: string;
  submissionId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: Timestamp;
}
```

### Leaderboard Entry
```typescript
interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  rank: number;
  points: number;
  totalCheckins: number;
  spotsDiscovered: number;
  tricksLanded: number;
  currentStreak: number;
  updatedAt: Timestamp;
}
```

## Rate Limiting

**Important:** Client-side rate limiting in Firestore Security Rules is fundamentally insecure because clients control all data and can bypass any timestamp checks.

### Server-Side Rate Limiting (Recommended)

Implement rate limiting using one of these approaches:

**Option 1: Backend API Middleware**
```typescript
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // 1 request per second
  message: 'Too many messages, please wait'
});

app.post('/api/chat/message', chatLimiter, async (req, res) => {
  // Create message in Firestore via Admin SDK
});
```

**Option 2: Cloud Functions**
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const sendChatMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  }
  
  const userId = context.auth.uid;
  const rateLimitRef = admin.firestore().doc(`rate_limits/${userId}`);
  
  return admin.firestore().runTransaction(async (transaction) => {
    const doc = await transaction.get(rateLimitRef);
    const lastMessage = doc.data()?.lastMessageAt?.toMillis() || 0;
    const now = Date.now();
    
    if (now - lastMessage < 1000) {
      throw new functions.https.HttpsError('resource-exhausted', 'Rate limit exceeded');
    }
    
    // Create message
    const messageRef = admin.firestore().collection('chat_messages').doc();
    transaction.set(messageRef, {
      userId,
      message: data.message,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Update rate limit
    transaction.set(rateLimitRef, { lastMessageAt: admin.firestore.Timestamp.now() });
    
    return { success: true };
  });
});
```

**Option 3: Firebase Extensions**
Use Firebase's official [Trigger Email](https://extensions.dev/) or rate-limiting extensions.

## Best Practices

### 1. Security
- ✅ Never bypass security rules with Admin SDK on client
- ✅ Always validate user input before writing
- ✅ Use custom claims for role-based access if needed
- ✅ Test rules with Firebase Rules Playground
- ✅ **CRITICAL:** Follow required document ID formats:
  - Chat messages: `{userId}_{timestamp}` (e.g., `abc123_1234567890`)
  - Active check-ins: `{userId}_{spotId}` (e.g., `abc123_spot456`)
  - Challenge votes: `{userId}_{submissionId}` (e.g., `abc123_sub789`)
- ✅ **CRITICAL:** Clients can ONLY create 'user' role chat messages, never 'assistant'
- ✅ **CRITICAL:** Only server (Admin SDK) can create notifications and leaderboard entries
- ✅ **CRITICAL:** Implement rate limiting server-side (Cloud Functions or backend API), not in Firestore rules

### 2. Performance
- ✅ Use compound indexes for complex queries
- ✅ Limit real-time listeners to active screens only
- ✅ Unsubscribe from listeners when components unmount
- ✅ Use pagination for large collections

### 3. Data Modeling
- ✅ Denormalize data for read performance
- ✅ Keep documents under 1MB
- ✅ Use subcollections for large nested data
- ✅ Store frequently accessed data in root collections

### 4. Costs
- ✅ Monitor read/write operations in Firebase Console
- ✅ Use caching to reduce redundant reads
- ✅ Batch writes when possible
- ✅ Delete old/unused documents regularly

## Environment Variables

Required Firebase environment variables:

```env
# Client-side (prefixed with VITE_)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Server-side
FIREBASE_ADMIN_KEY={"type":"service_account",...}
```

## Troubleshooting

### Permission Denied Errors

If you see "permission-denied" errors:

1. **Check Authentication** - Ensure user is logged in
2. **Verify Ownership** - Confirm userId matches auth.uid
3. **Check Document ID Format** - Verify ID follows required pattern:
   - Chat: `{userId}_{anything}` (must START with userId)
   - Check-ins: `{userId}_{spotId}` (exact format)
   - Votes: `{userId}_{submissionId}` (exact format)
4. **Check Message Role** - Clients can only create 'user' messages, not 'assistant'
5. **Test Rules** - Use Firebase Console Rules Playground
6. **Check Field Validation** - Ensure all required fields are present
7. **Review Timestamps** - Check createdAt is within 5 minutes
8. **Check updatedAt Usage** - Some collections (notifications) don't allow updatedAt

### Real-Time Updates Not Working

1. **Check Listener Setup** - Ensure useEffect dependencies are correct
2. **Verify Cleanup** - Make sure unsubscribe is called on unmount
3. **Check Network** - Firestore requires active internet connection
4. **Review Console** - Look for errors in browser DevTools

### Performance Issues

1. **Add Indexes** - Firebase Console will prompt for missing indexes
2. **Reduce Listeners** - Limit active real-time subscriptions
3. **Use Pagination** - Don't load entire collections at once
4. **Cache Data** - Store frequently accessed data locally

## Migration Guide

### Moving Data to Firestore

When migrating from PostgreSQL to Firestore:

```typescript
// 1. Fetch from PostgreSQL
const users = await db.select().from(customUsers);

// 2. Transform data
const firestoreData = users.map(user => ({
  userId: user.id,
  displayName: `${user.firstName} ${user.lastName}`,
  skillLevel: user.skillLevel,
  createdAt: admin.firestore.Timestamp.fromDate(user.createdAt)
}));

// 3. Batch write to Firestore
const batch = admin.firestore().batch();
firestoreData.forEach(data => {
  const ref = admin.firestore().collection('users').doc(data.userId);
  batch.set(ref, data);
});
await batch.commit();
```

## Support

For Firebase issues:
- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Reference](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-cloud-firestore)
