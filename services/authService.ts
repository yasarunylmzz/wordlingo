import axios from "axios";

export async function newRefreshToken(code: string) {
  const data = {
    code: code,
  };
  try {
    const response = axios.post("https://api.wordlingo.me/refresh-token", data);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}
