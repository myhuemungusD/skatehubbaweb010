import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SpotAccess {
  spotId: string;
  accessGrantedAt: number;
  expiresAt: number;
  trickId?: string;
  hologramUrl?: string;
}

interface SpotAccessState {
  spotAccesses: Record<string, SpotAccess>;
  currentCheckIn: SpotAccess | null;
  isCheckedIn: (spotId: string) => boolean;
  hasValidAccess: (spotId: string) => boolean;
  grantAccess: (access: SpotAccess) => void;
  revokeAccess: (spotId: string) => void;
  setCurrentCheckIn: (access: SpotAccess | null) => void;
  cleanupExpiredAccess: () => void;
}

export const useSpotAccess = create<SpotAccessState>()(
  persist(
    (set, get) => ({
      spotAccesses: {},
      currentCheckIn: null,

      isCheckedIn: (spotId: string) => {
        const access = get().spotAccesses[spotId];
        if (!access) return false;
        return Date.now() < access.expiresAt;
      },

      hasValidAccess: (spotId: string) => {
        return get().isCheckedIn(spotId);
      },

      grantAccess: (access: SpotAccess) => {
        set((state) => ({
          spotAccesses: {
            ...state.spotAccesses,
            [access.spotId]: access,
          },
          currentCheckIn: access,
        }));
      },

      revokeAccess: (spotId: string) => {
        set((state) => {
          const newAccesses = { ...state.spotAccesses };
          delete newAccesses[spotId];
          return {
            spotAccesses: newAccesses,
            currentCheckIn: state.currentCheckIn?.spotId === spotId ? null : state.currentCheckIn,
          };
        });
      },

      setCurrentCheckIn: (access: SpotAccess | null) => {
        set({ currentCheckIn: access });
      },

      cleanupExpiredAccess: () => {
        const now = Date.now();
        set((state) => {
          const validAccesses: Record<string, SpotAccess> = {};
          Object.entries(state.spotAccesses).forEach(([spotId, access]) => {
            if (access.expiresAt > now) {
              validAccesses[spotId] = access;
            }
          });
          return {
            spotAccesses: validAccesses,
            currentCheckIn: state.currentCheckIn && state.currentCheckIn.expiresAt > now 
              ? state.currentCheckIn 
              : null,
          };
        });
      },
    }),
    {
      name: 'spot-access-storage',
      partialize: (state) => ({
        spotAccesses: state.spotAccesses,
        currentCheckIn: state.currentCheckIn,
      }),
    }
  )
);
