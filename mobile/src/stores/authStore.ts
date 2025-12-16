import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { api } from "../services/api";
import {
  storeSecureItem,
  getSecureItem,
  clearStorage,
} from "../services/storage";

interface AuthState {
  user: FirebaseUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // 1. Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseToken = await userCredential.user.getIdToken();

      // 2. Backend Exchange
      const response = await api.post("/auth/login", {
        idToken: firebaseToken,
      });
      const { token } = response.data.data;

      // 3. Persist
      await storeSecureItem("authToken", token);
      set({ user: userCredential.user, token });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (email, password) => {
    set({ isLoading: true });
    try {
      // 1. Create Firebase User
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseToken = await userCredential.user.getIdToken();

      // 2. Backend Sync
      const response = await api.post("/auth/login", {
        idToken: firebaseToken,
      });
      const { token } = response.data.data;

      await storeSecureItem("authToken", token);
      set({ user: userCredential.user, token });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await auth.signOut();
    await clearStorage();
    set({ user: null, token: null });
  },

  hydrate: async () => {
    const token = await getSecureItem("authToken");
    if (token) {
      // Optimistic restore - in real app, verify token validity
      set({ token, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
