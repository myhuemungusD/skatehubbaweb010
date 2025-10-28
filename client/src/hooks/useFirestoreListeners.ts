import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useChatStore } from "../store/useChatStore";
import { usePresenceStore } from "../store/usePresenceStore";
import { useLocation } from "wouter";

/**
 * Custom hook to manage Firestore real-time listeners for chat and presence
 * This hook automatically sets up listeners when the user is authenticated
 * and cleans them up when the component unmounts or user logs out
 */
export function useFirestoreListeners() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const listenToMessages = useChatStore((state) => state.listenToMessages);
  const listenToPresence = usePresenceStore((state) => state.listenToPresence);
  const setUserOnline = usePresenceStore((state) => state.setUserOnline);
  const setUserOffline = usePresenceStore((state) => state.setUserOffline);
  const updateUserPage = usePresenceStore((state) => state.updateUserPage);

  // Set up chat message listener
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = listenToMessages();
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, listenToMessages]);

  // Set up presence listener
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = listenToPresence();
    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, listenToPresence]);

  // Set user online when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const userName = user.email?.split('@')[0] || user.displayName || "Anonymous";
    setUserOnline(user.uid, userName, location);

    // Set user offline on unmount or logout
    return () => {
      setUserOffline(user.uid);
    };
  }, [isAuthenticated, user, location, setUserOnline, setUserOffline]);

  // Update current page when location changes
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    updateUserPage(user.uid, location);
  }, [location, isAuthenticated, user, updateUserPage]);

  // Set user offline before page unload
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const handleBeforeUnload = () => {
      setUserOffline(user.uid);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAuthenticated, user, setUserOffline]);

  return {
    isConnected: usePresenceStore((state) => state.isConnected),
    onlineCount: usePresenceStore((state) => state.getOnlineCount()),
  };
}
