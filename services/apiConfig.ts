import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Backend API origin.
 * Prefer EXPO_PUBLIC_API_URL; otherwise derive the Mac LAN host from Metro
 * so a physical device does not call its own localhost.
 */
function metroDevHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    // Legacy Expo Go manifest
    (Constants as { manifest?: { debuggerHost?: string } }).manifest
      ?.debuggerHost;

  if (!hostUri || typeof hostUri !== "string") {
    return null;
  }

  const host = hostUri.split(":")[0]?.trim();
  if (!host || host === "localhost" || host === "127.0.0.1") {
    return null;
  }
  return host;
}

function resolveApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  const host = metroDevHost();
  if (host) {
    return `http://${host}:8080`;
  }

  // Android emulator → host machine loopback
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  return "http://localhost:8080";
}

export const API_BASE_URL = resolveApiBaseUrl();
