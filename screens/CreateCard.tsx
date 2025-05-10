import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ViewStyle,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Type tanımlamaları
type ImportanceLevel = "low" | "medium" | "high";

interface CardItem {
  id: number;
  term: string;
  definition: string;
  importance: ImportanceLevel;
}

const CreateCard: React.FC = () => {
  // Zustand yerine şimdilik dummy değerler kullanıyoruz
  const dummyDeckTitle = "Yeni Kart Destesi";

  const [cards, setCards] = useState<CardItem[]>([
    { id: 1, term: "", definition: "", importance: "medium" },
    { id: 2, term: "", definition: "", importance: "medium" },
  ]);

  const navigation = useNavigation();

  const handleGoBack = (): void => {
    Alert.alert(
      "Çıkış yapmak istediğinize emin misiniz?",
      "Kaydedilmemiş değişiklikler kaybolacaktır.",
      [
        { text: "İptal", style: "cancel" },
        { text: "Çık", onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleSave = (): void => {
    // Boş kartları filtrele
    const nonEmptyCards = cards.filter(
      (card) => card.term.trim() !== "" || card.definition.trim() !== ""
    );

    if (nonEmptyCards.length < 2) {
      alert("En az 2 kart eklemelisiniz");
      return;
    }

    // Burada zustand store'a veri kaydedebilirsin
    console.log("Kaydedilen kartlar:", {
      deckTitle: dummyDeckTitle,
      cards: nonEmptyCards,
    });

    alert(`${nonEmptyCards.length} kart kaydedildi`);

    // Ana sayfaya dön
    navigation.navigate("Home");
  };

  const updateCard = (
    id: number,
    field: keyof CardItem,
    value: string
  ): void => {
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, [field]: value } : card
    );
    setCards(updatedCards);
  };

  const updateImportance = (id: number, level: ImportanceLevel): void => {
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, importance: level } : card
    );
    setCards(updatedCards);
  };

  const addCard = (): void => {
    const newId =
      cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
    setCards([
      ...cards,
      { id: newId, term: "", definition: "", importance: "medium" },
    ]);
  };

  const removeCard = (id: number): void => {
    if (cards.length <= 2) {
      alert("En az 2 karta ihtiyacınız var");
      return;
    }
    setCards(cards.filter((card) => card.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{dummyDeckTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          {/* Cards Header */}
          <View style={styles.cardsHeader}>
            <View style={styles.cardsCount}>
              <Text style={styles.cardsCountText}>{cards.length} Kart</Text>
              <Text style={styles.cardsHint}>
                TAB veya ENTER ile alanlar arasında geçiş yapabilirsiniz
              </Text>
            </View>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="cloud-upload" size={22} color="#fff" />
              <Text style={styles.headerButtonText}>İçe Aktar</Text>
            </TouchableOpacity>
          </View>

          {/* Cards List */}
          {cards.map((card, index) => (
            <View key={card.id} style={styles.cardItem}>
              <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumber}>{index + 1}</Text>
              </View>
              <View style={styles.cardInputContainer}>
                <TextInput
                  style={styles.cardTermInput}
                  placeholder="Terim girin"
                  placeholderTextColor="#888"
                  value={card.term}
                  onChangeText={(text) => updateCard(card.id, "term", text)}
                />
                <TextInput
                  style={styles.cardDefinitionInput}
                  placeholder="Tanım girin"
                  placeholderTextColor="#888"
                  value={card.definition}
                  onChangeText={(text) =>
                    updateCard(card.id, "definition", text)
                  }
                />
                {/* Importance Selector */}
                <View style={styles.importanceContainer}>
                  {(["low", "medium", "high"] as ImportanceLevel[]).map(
                    (level) => {
                      const levelText =
                        level === "low"
                          ? "Düşük"
                          : level === "medium"
                          ? "Orta"
                          : "Yüksek";
                      return (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.importanceButton,
                            card.importance === level &&
                              (StyleSheet.flatten(
                                styles[`${level}Active` as keyof typeof styles]
                              ) as ViewStyle),
                          ]}
                          onPress={() => updateImportance(card.id, level)}
                        >
                          <Text
                            style={[
                              styles.importanceText,
                              card.importance === level &&
                                styles[`${level}Text` as keyof typeof styles],
                            ]}
                          >
                            {levelText}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeCard(card.id)}
              >
                <Icon name="delete-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Card Button */}
          <TouchableOpacity style={styles.addCardButton} onPress={addCard}>
            <Icon name="add" size={24} color="#5f8aff" />
            <Text style={styles.addCardText}>Kart ekle</Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // To center despite the back button
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  cardsCount: {
    flex: 1,
  },
  cardsCountText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold",
  },
  cardsHint: {
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  },
  headerButton: {
    backgroundColor: "#5f8aff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  headerButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },
  cardItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  cardNumberContainer: {
    width: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cardNumber: {
    color: "#5f8aff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardInputContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  cardTermInput: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  cardDefinitionInput: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  importanceContainer: {
    flexDirection: "row",
    marginTop: 8,
    justifyContent: "space-between",
  },
  importanceButton: {
    flex: 1,
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 2,
    alignItems: "center",
  },
  importanceText: {
    fontSize: 12,
    color: "#666",
  },
  lowActive: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4CAF50",
  },
  mediumActive: {
    backgroundColor: "#fffde7",
    borderColor: "#FFC107",
  },
  highActive: {
    backgroundColor: "#ffebee",
    borderColor: "#F44336",
  },
  lowText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  mediumText: {
    color: "#FFC107",
    fontWeight: "bold",
  },
  highText: {
    color: "#F44336",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 2,
  },
  addCardButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 15,
    marginVertical: 20,
  },
  addCardText: {
    color: "#5f8aff",
    fontSize: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: "#5f8aff",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 80,
  },
});

export default CreateCard;
