import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export async function loginUser(email: string, password: string) {
  const data = {
    email: email,
    password: password,
  };

  try {
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
    const response = axios.post(`${API_BASE_URL}/createuser`, data);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
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
