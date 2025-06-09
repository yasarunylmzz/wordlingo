import { useAuthStore } from "../stores/userStore";
import axiosInstance from "./AxiosInstance";

export async function getCardList(deskID: string) {
  const deskId = deskID;
  const headers = {
    Authorization: `Bearer ${useAuthStore.getState().auth.refreshToken}`,
    "X-Access-Token": `Bearer ${useAuthStore.getState().auth.accessToken}`,
  };

  try {
    const response = await axiosInstance.post(
      `/get-card?desk_id=${deskId}`,
      {},
      { headers }
    );
    console.log("Card list fetched successfully:", response.data.params);
    return response;
  } catch (error) {
    console.error("Error in getCardList:", error);
    console.error("Error details:", error.response?.data || error.message);
  }
}

export async function createCard(
  cards: Array<{
    Language1: string;
    Language2: string;
    ImportanceValue: number;
    DeskID: string;
  }>
) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${useAuthStore.getState().auth.refreshToken}`,
    "X-Access-Token": `Bearer ${useAuthStore.getState().auth.accessToken}`,
  };

  try {
    const response = await axiosInstance.post(
      "https://api.wordlingo.me/create-card",
      cards, // Send the array directly
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error in createCard:", error);
    throw error; // Re-throw to handle in calling function
  }
}

export async function deleteCard(cardId: string, deskId: string) {
  const headers = {
    Authorization: `Bearer ${useAuthStore.getState().auth.refreshToken}`,
    "X-Access-Token": `Bearer ${useAuthStore.getState().auth.accessToken}`,
  };

  const data = {
    ID: cardId,
    DeskID: deskId, // Assuming DeskID is the user's ID
  };

  try {
    const response = await axiosInstance.delete(`/delete-card`, {
      headers,
      data,
    });
    return response;
  } catch (error) {
    console.error("Error in deleteCard:", error);
  }
}

export async function updateCard(
  cardId: string,
  deskId: string,
  language1: string,
  language2: string
) {
  const data = {
    ID: cardId,
    DeskID: deskId,
    Language1: language1,
    Language2: language2,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${useAuthStore.getState().auth.refreshToken}`,
    "X-Access-Token": `Bearer ${useAuthStore.getState().auth.accessToken}`,
  };

  try {
    const response = await axiosInstance.patch(`/update-card`, data, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error in updateCard:", error);
  }
}
