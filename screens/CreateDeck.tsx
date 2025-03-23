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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Ensure you have this package installed

const FlashcardCreator = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState([
    { id: 1, term: "", definition: "" },
    { id: 2, term: "", definition: "" },
  ]);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    if (title.trim() === "") {
      alert("Title cannot be empty");
      return;
    }

    // Save logic here
    alert(`Saved: ${title}`);
  };

  const updateCard = (id, field, value) => {
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, [field]: value } : card
    );
    setCards(updatedCards);
  };

  const addCard = () => {
    const newId =
      cards.length > 0 ? Math.max(...cards.map((c) => c.id)) + 1 : 1;
    setCards([...cards, { id: newId, term: "", definition: "" }]);
  };

  const removeCard = (id) => {
    if (cards.length <= 2) {
      alert("You need at least 2 cards");
      return;
    }
    setCards(cards.filter((card) => card.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Back Button Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Flashcards</Text>
        <View style={{ width: 40 }} /> {/* Empty view for balance */}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.sectionLabel}>TITLE</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter a title, like 'Biology 101' or 'Spanish Vocabulary'"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>DESCRIPTION</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add a description..."
              placeholderTextColor="#888"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Cards Count and Buttons */}
          <View style={styles.cardsHeader}>
            <View style={styles.cardsCount}>
              <Text style={styles.cardsCountText}>{cards.length} Cards</Text>
              <Text style={styles.cardsHint}>
                Tab or Enter to move between fields
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <Icon name="cloud-upload" size={22} color="#fff" />
                <Text style={styles.headerButtonText}>Import</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cards */}
          {cards.map((card, index) => (
            <View key={card.id} style={styles.cardItem}>
              <View style={styles.cardNumberContainer}>
                <Text style={styles.cardNumber}>{index + 1}</Text>
              </View>
              <View style={styles.cardInputContainer}>
                <TextInput
                  style={styles.cardTermInput}
                  placeholder="Enter term"
                  placeholderTextColor="#888"
                  value={card.term}
                  onChangeText={(text) => updateCard(card.id, "term", text)}
                />
                <TextInput
                  style={styles.cardDefinitionInput}
                  placeholder="Enter definition"
                  placeholderTextColor="#888"
                  value={card.definition}
                  onChangeText={(text) =>
                    updateCard(card.id, "definition", text)
                  }
                />
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
            <Text style={styles.addCardText}>Add card</Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Save Button (Fixed at bottom) */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
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
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginTop: 20,
  },
  sectionLabel: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  descriptionSection: {
    marginBottom: 25,
  },
  descriptionInput: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: 8,
    padding: 15,
    height: 100,
    textAlignVertical: "top",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  cardsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    backgroundColor: "#5f8aff",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
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

export default FlashcardCreator;
