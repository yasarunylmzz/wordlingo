import axios from "axios";
import { useAuthStore } from "../stores/userStore";
import { API_BASE_URL } from "./apiConfig";
import axiosInstance from "./AxiosInstance";
import { useDeskStore } from "../stores/deckStore";

export async function createDesk(
  Title: string,
  Description: string,
  ImageLink: string | null
) {
  const refreshToken = useAuthStore.getState().auth.refreshToken;
  const accessToken = useAuthStore.getState().auth.accessToken;
  const UserId = useAuthStore.getState().user.id;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`, // Token'ı Bearer formatında gönderme
    "X-Access-Token": `Bearer ${accessToken}`, // Aynı token'ı farklı bir header olarak da gönderme
  };

  // Backend rejects empty Title/Description; ImageUrl may be omitted/empty.
  const payload = {
    Title: Title,
    Description: Description,
    UserID: UserId,
    ...(ImageLink ? { ImageUrl: ImageLink } : {}),
  };

  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-desk`,
      payload,
      { headers }
    );
    // Local API returns 202 Accepted with { desk_id, title, description }
    console.log("Desk created successfully:", response.data.desk_id);
    useDeskStore.getState().setDesk({
      id: response.data.desk_id,
      title: response.data.title,
      description: response.data.description,
    });

    return response;
  } catch (error: any) {
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.headers["x-new-access-token"]
    ) {
      const rotated = error.response.headers["x-new-access-token"];
      console.log("Received new access token:", rotated);
      useAuthStore.getState().setAuthData({
        auth: { accessToken: rotated },
      });
    }
    console.error("createDesk failed:", error.response?.status, error.response?.data || error.message);
    throw error;
  }
}

export async function getAllDecks(UserId: string) {
  // Get tokens from your auth store
  const accessToken = useAuthStore.getState().auth?.accessToken;
  const refreshToken = useAuthStore.getState().auth?.refreshToken;

  // Verify tokens exist
  if (!accessToken || !refreshToken) {
    console.error("Missing authentication tokens");
    throw new Error("Authentication tokens not found");
  }

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
  const refreshToken = useAuthStore.getState().auth.refreshToken;
  const accessToken = useAuthStore.getState().auth.accessToken;
  const UserId = useAuthStore.getState().user.id;
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
  ImageLink: string | null
) {
  const refreshToken = useAuthStore.getState().auth.refreshToken;
  const accessToken = useAuthStore.getState().auth.accessToken;

  const data = {
    Title: Title,
    Description: Description,
    ...(ImageLink ? { ImageUrl: ImageLink } : {}),
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
    console.error(
      "Error in updateDeck:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
}
