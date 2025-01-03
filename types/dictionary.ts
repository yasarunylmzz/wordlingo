export interface Phonetic {
  text: string;
  audio?: string; // Ses dosyasının URL'si (opsiyonel)
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface DictionaryResponse {
  word: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
}
