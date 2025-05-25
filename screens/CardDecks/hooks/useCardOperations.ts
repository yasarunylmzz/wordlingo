import { useState } from "react";
import {
  createCard,
  updateCard,
  deleteCard,
} from "../../../services/cardService";

interface Card {
  ID: string;
  Language1: string;
  Language2: string;
  ImportanceValue: "low" | "medium" | "high";
}

export const useCardOperations = (deckId: string) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCardWord1, setNewCardWord1] = useState("");
  const [newCardWord2, setNewCardWord2] = useState("");
  const [importanceLevel, setImportanceLevel] =
    useState<Card["ImportanceValue"]>("low");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const importanceLevelToValue = (level: "low" | "medium" | "high"): number => {
    const values = { low: 1, medium: 2, high: 3 };
    return values[level] || 1;
  };

  const numberToImportanceValue = (value: number): Card["ImportanceValue"] => {
    const levels = { 1: "low", 2: "medium", 3: "high" } as const;
    return levels[value as keyof typeof levels] || "low";
  };

  const resetModalForm = () => {
    setNewCardWord1("");
    setNewCardWord2("");
    setImportanceLevel("low");
    setIsEditMode(false);
    setEditingCardId(null);
  };

  const handleSaveCard = async () => {
    if (!newCardWord1 || !newCardWord2 || !deckId) return;

    try {
      if (isEditMode && editingCardId) {
        await updateCard(editingCardId, deckId, newCardWord1, newCardWord2);

        setCards((prevCards) =>
          prevCards.map((card) =>
            card.ID === editingCardId
              ? { ...card, Language1: newCardWord1, Language2: newCardWord2 }
              : card
          )
        );
      } else {
        const response = await createCard(
          newCardWord1,
          newCardWord2,
          importanceLevelToValue(importanceLevel),
          deckId
        );

        const createdCard = response?.data?.card;
        if (createdCard) {
          const newCard: Card = {
            ID: createdCard.ID,
            Language1: createdCard.Language1,
            Language2: createdCard.Language2,
            ImportanceValue: numberToImportanceValue(
              createdCard.ImportanceValue
            ),
          };
          setCards((prevCards) => [...prevCards, newCard]);
        }
      }

      resetModalForm();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Card operation failed:", error);
    }
  };

  const handleEditCard = (id: string) => {
    const cardToEdit = cards.find((card) => card.ID === id);
    if (cardToEdit) {
      setNewCardWord1(cardToEdit.Language1);
      setNewCardWord2(cardToEdit.Language2);
      setImportanceLevel(cardToEdit.ImportanceValue);
      setIsEditMode(true);
      setEditingCardId(id);
      setIsModalVisible(true);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id, deckId);
      setCards((prevCards) => prevCards.filter((card) => card.ID !== id));
    } catch (error) {
      console.error("Card deletion failed:", error);
    }
  };

  const openAddModal = () => {
    resetModalForm();
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    resetModalForm();
  };

  return {
    cards,
    setCards,
    isModalVisible,
    newCardWord1,
    newCardWord2,
    importanceLevel,
    isEditMode,
    setNewCardWord1,
    setNewCardWord2,
    setImportanceLevel,
    handleSaveCard,
    handleEditCard,
    handleDeleteCard,
    openAddModal,
    closeModal,
    numberToImportanceValue,
  };
};
