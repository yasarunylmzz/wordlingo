export interface Card {
  ID: string;
  Language1: string;
  Language2: string;
  ImportanceValue: "low" | "medium" | "high";
}

export interface CardModalProps {
  visible: boolean;
  isEditMode: boolean;
  word1: string;
  word2: string;
  importanceLevel: Card["ImportanceValue"];
  onWord1Change: (text: string) => void;
  onWord2Change: (text: string) => void;
  onImportanceChange: (level: Card["ImportanceValue"]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface CardListItem {
  id: string;
  word1: string;
  word2: string;
  importanceLevel: Card["ImportanceValue"];
}

export interface CardOperationsHook {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  isModalVisible: boolean;
  newCardWord1: string;
  newCardWord2: string;
  importanceLevel: Card["ImportanceValue"];
  isEditMode: boolean;
  setNewCardWord1: (text: string) => void;
  setNewCardWord2: (text: string) => void;
  setImportanceLevel: (level: Card["ImportanceValue"]) => void;
  handleSaveCard: () => Promise<void>;
  handleEditCard: (id: string) => void;
  handleDeleteCard: (id: string) => Promise<void>;
  openAddModal: () => void;
  closeModal: () => void;
  numberToImportanceValue: (value: number) => Card["ImportanceValue"];
}

export interface ApiCard {
  ID: string;
  Language1: string;
  Language2: string;
  ImportanceValue: number;
}

export interface CreateCardResponse {
  data: {
    card: ApiCard;
  };
}

export interface GetCardsResponse {
  data: {
    params: ApiCard[];
  };
}
