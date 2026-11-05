import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export async function newRefreshToken(code: string) {
  const data = {
    code: code,
  };
  try {
    const response = axios.post(`${API_BASE_URL}/refresh-token`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}
