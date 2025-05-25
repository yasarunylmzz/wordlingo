import axios from "axios";
import { useAuthStore } from "../stores/userStore";

// Refresh edilen token'ı dışarı aktarmak istersen, bir değişken kullan
let latestAccessToken: string | null = null;

const axiosInstance = axios.create({
  baseURL: "https://api.wordlingo.me",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Eğer access token süresi dolduysa ve server yeni access token verdiyse
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.headers["new-access-token"] &&
      !originalRequest._retry // Sonsuz döngüden kaçınmak için
    ) {
      originalRequest._retry = true;

      const newAccessToken = error.response.headers["new-access-token"];
      console.log("Yeni Access Token Alındı:", newAccessToken);

      useAuthStore.getState().setAuthData({
        auth: {
          accessToken: newAccessToken,
        },
      });

      // Token'ı güncelle
      latestAccessToken = newAccessToken;

      // Header'ı güncelleyip tekrar dene
      originalRequest.headers["X-Access-Token"] = `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    }

    // Diğer hataları pasla
    return Promise.reject(error);
  }
);

// Yardımcı fonksiyon: en son access token'ı almak için
export function getLatestAccessToken() {
  return latestAccessToken;
}

export default axiosInstance;
