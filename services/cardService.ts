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
  Language1: string,
  Language2: string,
  ImportanceValue: number,
  DeskID: string
) {
  const data = {
    Language1: Language1,
    Language2: Language2,
    ImportanceValue: ImportanceValue,
    DeskID: DeskID,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${useAuthStore.getState().auth.refreshToken}`, // Token'ı Bearer formatında gönderme
    "X-Access-Token": `Bearer ${useAuthStore.getState().auth.accessToken}`, // Aynı token'ı farklı bir header olarak da gönderme
  };

  try {
    const response = await axiosInstance.post(
      "https://api.wordlingo.me/create-card",
      [data],
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error in createCard:", error);
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
