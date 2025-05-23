import axios from "axios";

export async function createDesk(
  Title: string,
  Description: string,
  UserId: string,
  ImageLink: string | null,
  refreshToken: string,
  accessToken: string
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
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllDecks(
  UserId: string,
  refreshToken: string,
  accessToken: string
) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`, // Token'ı Bearer formatında gönderme
    "X-Access-Token": `Bearer ${accessToken}`, // Aynı token'ı farklı bir header olarak da gönderme
  };

  try {
    const response = await axios.get(
      `https://api.wordlingo.me/get-desk?user_id=${UserId}`,
      { headers }
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
