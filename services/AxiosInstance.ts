import axios from "axios";
import { useAuthStore } from "../stores/userStore";

let latestAccessToken: string | null = null;

const axiosInstance = axios.create({
  baseURL: "https://api.wordlingo.me",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

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

      latestAccessToken = newAccessToken;

      originalRequest.headers["X-Access-Token"] = `Bearer ${newAccessToken}`;

      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export function getLatestAccessToken() {
  return latestAccessToken;
}

export default axiosInstance;
