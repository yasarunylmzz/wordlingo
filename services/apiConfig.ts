import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * Backend API origin for local/dev.
 * Prefer EXPO_PUBLIC_API_URL.
 * iOS Simulator can reach the Mac via 127.0.0.1; physical devices need the Mac LAN IP.
 */
function metroDevHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as { manifest?: { debuggerHost?: string } }).manifest
      ?.debuggerHost;

  if (!hostUri || typeof hostUri !== "string") {
    return null;
  }

  const host = hostUri.split(":")[0]?.trim();
  if (!host) {
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

  // Expo Go on iOS Simulator: Metro often reports localhost — use loopback to Mac.
  if (
    Platform.OS === "ios" &&
    (!host || host === "localhost" || host === "127.0.0.1")
  ) {
    return "http://127.0.0.1:8080";
  }

  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:8080`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  return "http://127.0.0.1:8080";
}

export const API_BASE_URL = resolveApiBaseUrl();
