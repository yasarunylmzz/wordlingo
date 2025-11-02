import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import Header from "./Components/Header";
import BottomButton from "./Components/BottomButton";
import CardList from "./Components/CardList";
import CustomButton from "./Components/CustomButton";
import CardModal from "./Components/CardModal";
import { useCardOperations } from "./hooks/useCardOperations";
import { getCardList } from "../../services/cardService";
import { useCardStore } from "../../stores/cardStore";

const CardDecks: React.FC = () => {
  const route = useRoute();
  const { deckId, deckTitle } = route.params as {
    deckId: string;
    deckTitle: string;
  };

  const [loading, setLoading] = useState(false);

  // Zustand store'dan card işlemlerini al
  const {
    cards: storeCards,
    setCards: setStoreCards,
    getCards,
  } = useCardStore();
  const currentCards = getCards(deckId);

  const {
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
  } = useCardOperations(deckId);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await getCardList(deckId);
      const rawCards = response?.data.params || [];
      const convertedCards = rawCards.map((card: any) => ({
        id: card.ID,
        deskID: deckId,
        word1: card.Language1,
        word2: card.Language2,
        importanceLevel: numberToImportanceValue(card.ImportanceValue),
      }));

      // Store'a kaydet
      setStoreCards(deckId, convertedCards);

      // Local hook'a da kaydet (eski yapı ile uyumluluk için)
      setCards(
        rawCards.map((card: any) => ({
          ID: card.ID,
          Language1: card.Language1,
          Language2: card.Language2,
          ImportanceValue: numberToImportanceValue(card.ImportanceValue),
        }))
      );
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Eğer store'da cart yoksa API'den çek
    if (currentCards.length === 0) {
      fetchCards();
    } else {
      // Store'dan gelen kartları local hook'a aktar
      setCards(
        currentCards.map((card) => ({
          ID: card.id,
          Language1: card.word1,
          Language2: card.word2,
          ImportanceValue: card.importanceLevel,
        }))
      );
    }
  }, [deckId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={deckTitle} />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
      ) : (
        <CardList
          cards={cards.map((card) => ({
            id: card.ID,
            word1: card.Language1,
            word2: card.Language2,
            importanceLevel: card.ImportanceValue,
          }))}
          onDeleteCard={handleDeleteCard}
          onEditCard={handleEditCard}
        />
      )}

      <View style={styles.bottomButton}>
        <BottomButton deckId={deckId} deckTitle={deckTitle} />
        <CustomButton onPress={openAddModal} />
      </View>

      <CardModal
        visible={isModalVisible}
        isEditMode={isEditMode}
        word1={newCardWord1}
        word2={newCardWord2}
        importanceLevel={importanceLevel}
        onWord1Change={setNewCardWord1}
        onWord2Change={setNewCardWord2}
        onImportanceChange={setImportanceLevel}
        onSave={handleSaveCard}
        onCancel={closeModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
  },
  bottomButton: {
    display: "flex",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    bottom: 50,
  },
});

export default CardDecks;
