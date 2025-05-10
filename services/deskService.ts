import axios from "axios";

export async function createDesk(
  title: string,
  description: string,
  userId: string,
  imageUrl: string | null
) {
  const data = {
    title: title, // küçük harfli 'title'
    description: description, // küçük harfli 'description'
    userId: userId, // küçük harfli 'userId'
    imageLink: imageUrl, // küçük harfli 'imageLink'
  };

  try {
    const response = await axios.post(
      "https://api.wordlingo.me/create-desk",
      data
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
