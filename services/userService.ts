import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export async function loginUser(email: string, password: string) {
  const data = {
    email: email,
    password: password,
  };

  try {
    console.log("Login API base:", API_BASE_URL);
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    console.log("Response:", response.status);
    console.log(response.headers);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  surname: string,
  username: string
) {
  const data = {
    name: name,
    surname: surname,
    username: username,
    email: email,
    password: password,
  };
  try {
    const response = await axios.post(`${API_BASE_URL}/createuser`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/**
 * Request a password-reset email.
 * API gap: backend has no `/forgot-password` (or equivalent) yet.
 * Call sites should surface an honest UI until this is implemented.
 */
export async function forgotPassword(_email: string): Promise<never> {
  throw new Error(
    "forgotPassword API is not available yet (no /forgot-password endpoint).",
  );
}

export async function verification(id: string, email: string, code: string) {
  const data = {
    id: id,
    email: email,
    code: code,
  };
  try {
    const response = axios.post(`${API_BASE_URL}/verification`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
}
