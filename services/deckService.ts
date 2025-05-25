import axios from "axios";
import { useAuthStore } from "../stores/userStore";
import axiosInstance from "./AxiosInstance";

const refreshToken = useAuthStore.getState().auth.refreshToken;
const accessToken = useAuthStore.getState().auth.accessToken;
const UserId = useAuthStore.getState().user.id;

export async function createDesk(
  Title: string,
  Description: string,
  UserId: string,
  ImageLink: string | null
) {
  const data = {
    Title: Title,
    Description: Description,
    UserID: UserId, // Change from UserId to UserID
    ImageUrl: ImageLink, // Change from ImageLink to ImageUrl
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`, // Token'ı Bearer formatında gönderme
    "X-Access-Token": `Bearer ${accessToken}`, // Aynı token'ı farklı bir header olarak da gönderme
  };

  try {
    const response = await axios.post(
      "https://api.wordlingo.me/create-desk",
      data,
      { headers }
    );
    return response;
  } catch (error: any) {
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.headers["x-new-access-token"]
    ) {
      const newAccessToken = error.response.headers["x-new-access-token"];
      console.log("Received new access token:", newAccessToken);

      newAccessToken(newAccessToken);
    }
  }
}

export async function getAllDecks(UserId: string) {
  const headers = {
    Authorization: `Bearer ${refreshToken}`,
    "X-Access-Token": `Bearer ${accessToken}`,
  };

  try {
    const response = await axiosInstance.get(`/get-desk?user_id=${UserId}`, {
      headers,
    });

    return response;
  } catch (error: any) {
    console.error("Error in getAllDecks:", error);
    throw error;
  }
}

export async function deleteDeck(Id: string) {
  const headers = {
    Authorization: `Bearer ${refreshToken}`,
    "X-Access-Token": `Bearer ${accessToken}`,
  };

  try {
    const response = await axiosInstance.delete(`/delete-desk`, {
      headers,
      data: { Id, UserId }, // Send Id and UserId in the request body
    });
    return response;
  } catch (error: any) {
    console.error("Error in deleteDeck:", error);
    throw error;
  }
}

export async function updateDeck(
  deskId: string,
  Title: string,
  Description: string,
  ImageLink: string | null,
  refreshToken: string,
  accessToken: string
) {
  const data = {
    Title: Title,
    Description: Description,
    ImageUrl: ImageLink, // Change from ImageLink to ImageUrl
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`,
    "X-Access-Token": `Bearer ${accessToken}`,
  };

  try {
    const response = await axiosInstance.put(`/update-desk/${deskId}`, data, {
      headers,
    });
    return response;
  } catch (error: any) {
    console.error("Error in updateDeck:", error);
    throw error;
  }
}
