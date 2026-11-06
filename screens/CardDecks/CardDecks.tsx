import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute } from "@react-navigation/native";

import Header from "./Components/Header";
import BottomButton from "./Components/BottomButton";
import CardList from "./Components/CardList";
import CardModal from "./Components/CardModal";
import { useCardOperations } from "./hooks/useCardOperations";
import { getCardList } from "../../services/cardService";
import { useCardStore } from "../../stores/cardStore";
import { RootStackParamList } from "../RootStackParams";
import { colors } from "../../theme/theme";

const CardDecks: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, "CardDecks">>();
  const { deckId, deckTitle, initialAdding = false } = route.params;
  const [loading, setLoading] = useState(false);
  const didOpenAdd = React.useRef(false);

  const { setCards: setStoreCards, getCards } = useCardStore();
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
      setStoreCards(deckId, convertedCards);
      setCards(
        rawCards.map((card: any) => ({
          ID: card.ID,
          Language1: card.Language1,
          Language2: card.Language2,
          ImportanceValue: numberToImportanceValue(card.ImportanceValue),
        })),
      );
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentCards.length === 0) {
      fetchCards();
    } else {
      setCards(
        currentCards.map((card) => ({
          ID: card.id,
          Language1: card.word1,
          Language2: card.word2,
          ImportanceValue: card.importanceLevel,
        })),
      );
    }
  }, [deckId]);

  useEffect(() => {
    if (!initialAdding || didOpenAdd.current) return;
    didOpenAdd.current = true;
    openAddModal();
    // Intentionally only on mount / initialAdding — openAddModal is unstable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAdding]);

  const mapped = cards.map((card) => ({
    id: card.ID,
    word1: card.Language1,
    word2: card.Language2,
    importanceLevel: card.ImportanceValue,
  }));

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Header
        title={deckTitle}
        subtitle={`${mapped.length} kart`}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={{ flex: 1 }}
        />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <CardList
            cards={mapped}
            onDeleteCard={handleDeleteCard}
            onEditCard={handleEditCard}
          />
        </ScrollView>
      )}

      <View style={styles.footer}>
        <BottomButton
          deckId={deckId}
          deckTitle={deckTitle}
          cardCount={mapped.length}
          onAdd={openAddModal}
        />
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
    backgroundColor: colors.paper,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.line,
    backgroundColor: "rgba(245,245,248,0.9)",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
});

export default CardDecks;
