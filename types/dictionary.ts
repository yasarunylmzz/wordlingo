// Her kelimenin anlamı için tip tanımı
export interface Definition {
  definition: string;
  example?: string;
}

// Kelimenin türü ve tanımları için tip
export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

// API yanıtının genel yapısı
export interface DictionaryResponse {
  word: string;
  meanings: Meaning[];
}
