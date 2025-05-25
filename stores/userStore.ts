import { create } from "zustand";
import { Auth, User } from "../types/user";
import { persist, StorageValue } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import { jwtDecode, JwtPayload } from "jwt-decode";

type AuthState = {
  user: Partial<User>;
  auth: Partial<Auth>;
  setAuthData: (data: { user?: Partial<User>; auth?: Partial<Auth> }) => void;
  clearAuthData: () => void;
  logOut: () => Promise<void>;
  isLoggedIn: () => boolean;
  isTokenValid: () => void;
};
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      auth: {},
      user: {},
      setAuthData: ({ user, auth }) =>
        set((state) => ({
          user: { ...state.user, ...user },
          auth: { ...state.auth, ...auth },
        })),
      logOut: async () => {
        await SecureStore.deleteItemAsync("auth-storage");
        set({ user: {}, auth: {} });
      },
      isLoggedIn: function () {
        return !!get().auth.accessToken;
      },
      clearAuthData: () => set({ user: {}, auth: {} }),
      isTokenValid() {
        const now = Math.floor(Date.now() / 1000);

        try {
          const decodedAccessToken = jwtDecode<JwtPayload>(
            this.auth.accessToken || ""
          );

          if (decodedAccessToken.exp && decodedAccessToken.exp < now) {
            console.warn("Access token süresi dolmuş");
            return false;
          }

          console.log("Geçerli access token", decodedAccessToken);
          return true;
        } catch (err: any) {
          if (err.name === "TokenExpiredError") {
            console.warn("Access token süresi dolmuş");

            // 🌀 Access token expired, refresh token kontrolü
            try {
              const decodedRefreshToken = jwtDecode<JwtPayload>(
                this.auth.refreshToken || ""
              );

              if (decodedRefreshToken.exp && decodedRefreshToken.exp < now) {
                console.warn("Refresh token süresi de dolmuş");
                return false;
              }

              console.log(
                "Access expired ama refresh geçerli, yeni token alınabilir"
              );
              return true;
            } catch (refreshErr: any) {
              console.error("Refresh token geçersiz:", refreshErr.message);
              return false;
            }
          } else {
            console.error("Access token geçersiz:", err.message);
            return false;
          }
        }
      },
    }),

    {
      name: "auth-storage",
      storage: {
        getItem: async (key) => {
          const value = await SecureStore.getItemAsync(key);
          return value ? (JSON.parse(value) as StorageValue<AuthState>) : null;
        },
        setItem: async (key, value) => {
          await SecureStore.setItemAsync(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await SecureStore.deleteItemAsync(key);
        },
      },
    }
  )
);
