import { create } from "zustand";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface UserPresence {
  userId: string;
  userName: string;
  status: "online" | "away" | "offline";
  lastSeen: number;
  currentPage?: string;
}

interface PresenceState {
  onlineUsers: UserPresence[];
  isConnected: boolean;
  
  // Actions
  setUserOnline: (userId: string, userName: string, currentPage?: string) => Promise<void>;
  setUserOffline: (userId: string) => Promise<void>;
  updateUserPage: (userId: string, currentPage: string) => Promise<void>;
  listenToPresence: () => () => void;
  getOnlineCount: () => number;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUsers: [],
  isConnected: false,

  setUserOnline: async (userId: string, userName: string, currentPage?: string) => {
    try {
      const userRef = doc(db, "user_presence", userId);
      await setDoc(userRef, {
        userId,
        userName,
        status: "online",
        lastSeen: Timestamp.now(),
        currentPage: currentPage || "/",
      });
      set({ isConnected: true });
    } catch (error) {
      console.error("Error setting user online:", error);
    }
  },

  setUserOffline: async (userId: string) => {
    try {
      const userRef = doc(db, "user_presence", userId);
      await updateDoc(userRef, {
        status: "offline",
        lastSeen: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error setting user offline:", error);
    }
  },

  updateUserPage: async (userId: string, currentPage: string) => {
    try {
      const userRef = doc(db, "user_presence", userId);
      await updateDoc(userRef, {
        currentPage,
        lastSeen: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating user page:", error);
    }
  },

  listenToPresence: () => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    
    const q = query(collection(db, "user_presence"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const onlineUsers = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              userId: data.userId,
              userName: data.userName,
              status: data.status,
              lastSeen: data.lastSeen?.toMillis() || 0,
              currentPage: data.currentPage,
            };
          })
          .filter((user) => {
            // Only show users active in the last 5 minutes
            return user.lastSeen > fiveMinutesAgo && user.status === "online";
          });

        set({ onlineUsers });
      },
      (error) => {
        console.error("Error listening to presence:", error);
      }
    );

    return unsubscribe;
  },

  getOnlineCount: () => {
    return get().onlineUsers.length;
  },
}));
