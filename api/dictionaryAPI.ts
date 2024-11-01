import axios from "axios";
import { DictionaryResponse } from "../types/dictionary";

const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export const fetchWordDefinition = async (
  word: string
): Promise<DictionaryResponse[]> => {
  try {
    const response = await axios.get<DictionaryResponse[]>(
      `${BASE_URL}/${word}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching the word definition", error);
    throw error;
  }
};
