import { useState, useEffect } from "react";
import { Alert } from "react-native";
import {
  getAllDecks,
  deleteDeck as deleteDeckService,
} from "../../../services/deckService";
import { useAuthStore } from "../../../stores/userStore";

export const useDecks = () => {
  const refreshToken = useAuthStore((state) => state.auth.refreshToken);
  const accessToken = useAuthStore((state) => state.auth.accessToken);
  const userId = useAuthStore((state) => state.user.id);
  const [deskList, setDeskList] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Deskleri getir
  const fetchDecks = async () => {
    if (!userId || !refreshToken) return;

    try {
      const response = await getAllDecks(userId);
      setDeskList(response.data.data);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  // Yenileme işlemi
  const onRefresh = async () => {
    if (!userId || !refreshToken) return;

    setRefreshing(true);
    try {
      const response = await getAllDecks(userId);
      setDeskList(response.data.data);
    } catch (error) {
      console.error("Error refreshing decks:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Silme işlemi
  const deleteDeck = (deckId: string, deckTitle: string) => {
    Alert.alert(
      "Delete Deck",
      `Are you sure you want to delete "${deckTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteDeckService(deckId);
              // Silme işlemi başarılı olduysa, listeyi güncelle
              setDeskList((prev) => prev.filter((deck) => deck.ID !== deckId));
            } catch (error) {
              console.error("Error deleting deck:", error);
              Alert.alert(
                "Error",
                "Could not delete the deck. Please try again."
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  // İlk yükleme
  useEffect(() => {
    fetchDecks();
  }, [userId, refreshToken, accessToken]);

  return {
    deskList,
    refreshing,
    isDeleting,
    onRefresh,
    deleteDeck,
  };
};
