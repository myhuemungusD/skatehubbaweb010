import { create } from "zustand";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  isAI?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  sendMessage: (userId: string, userName: string, message: string) => Promise<void>;
  sendAIMessage: (message: string) => Promise<void>;
  listenToMessages: () => () => void;
  clearMessages: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (userId: string, userName: string, message: string) => {
    try {
      set({ isLoading: true, error: null });
      
      await addDoc(collection(db, "chat_messages"), {
        userId,
        userName,
        message,
        timestamp: Timestamp.now(),
        isAI: false,
      });
      
      set({ isLoading: false });
    } catch (error: any) {
      console.error("Error sending message:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  sendAIMessage: async (message: string) => {
    try {
      await addDoc(collection(db, "chat_messages"), {
        userId: "hesher-ai",
        userName: "Hesher",
        message,
        timestamp: Timestamp.now(),
        isAI: true,
      });
    } catch (error: any) {
      console.error("Error sending AI message:", error);
    }
  },

  listenToMessages: () => {
    const q = query(
      collection(db, "chat_messages"),
      orderBy("timestamp", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              userId: data.userId,
              userName: data.userName,
              message: data.message,
              timestamp: data.timestamp?.toMillis() || Date.now(),
              isAI: data.isAI || false,
            };
          })
          .reverse(); // Reverse to show oldest first

        set({ messages, isLoading: false });
      },
      (error) => {
        console.error("Error listening to messages:", error);
        set({ error: error.message, isLoading: false });
      }
    );

    return unsubscribe;
  },

  clearMessages: async () => {
    try {
      const messages = get().messages;
      const deletePromises = messages.map((msg) =>
        deleteDoc(doc(db, "chat_messages", msg.id))
      );
      await Promise.all(deletePromises);
      set({ messages: [] });
    } catch (error: any) {
      console.error("Error clearing messages:", error);
      set({ error: error.message });
    }
  },
}));
