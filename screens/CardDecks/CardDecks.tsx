import React, { useEffect } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

import Header from "./Components/Header";
import BottomButton from "./Components/BottomButton";
import CardList from "./Components/CardList";
import CustomButton from "./Components/CustomButton";
import CardModal from "./Components/CardModal";
import { useCardOperations } from "./hooks/useCardOperations";
import { getCardList } from "../../services/cardService";

const CardDecks: React.FC = () => {
  const route = useRoute();
  const { deckId, deckTitle } = route.params as {
    deckId: string;
    deckTitle: string;
  };

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

  useEffect(() => {
    getCardList(deckId)
      .then((response) => {
        const rawCards = response?.data.params || [];
        const convertedCards = rawCards.map((card: any) => ({
          ID: card.ID,
          Language1: card.Language1,
          Language2: card.Language2,
          ImportanceValue: numberToImportanceValue(card.ImportanceValue),
        }));
        setCards(convertedCards);
      })
      .catch((error) => {
        console.error("Error fetching cards:", error);
      });
  }, [deckId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={deckTitle} />

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

      <View style={styles.bottomButton}>
        <BottomButton />
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
