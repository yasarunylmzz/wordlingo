import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";

import Header from "./Components/Header";
import BottomButton from "./Components/BottomButton";
import CardList from "./Components/CardList";
import CustomButton from "./Components/CustomButton";

const { width } = Dimensions.get("window");

interface Card {
  id: string;
  word1: string;
  word2: string;
  importanceLevel: "low" | "medium" | "high";
}

const CardDecks: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCardWord1, setNewCardWord1] = useState("");
  const [newCardWord2, setNewCardWord2] = useState("");
  const [importanceLevel, setImportanceLevel] =
    useState<Card["importanceLevel"]>("low");

  const handleAddCard = () => {
    if (newCardWord1 && newCardWord2) {
      const newCard: Card = {
        id: Date.now().toString(),
        word1: newCardWord1,
        word2: newCardWord2,
        importanceLevel: importanceLevel,
      };

      setCards((prevCards) => [...prevCards, newCard]);
      setNewCardWord1("");
      setNewCardWord2("");
      setImportanceLevel("low");
      setIsModalVisible(false);
    }
  };

  const handleEditCard = (id: string) => {
    // Open edit modal or perform other editing actions
    console.log(`Edit card with ID: ${id}`);
  };

  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      word1: "Run",
      word2: "Koşmak",
      importanceLevel: "low",
    },
  ]);

  const handleDeleteCard = (id: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <CardList
        cards={cards}
        onDeleteCard={handleDeleteCard}
        onEditCard={handleEditCard}
      />

      <View style={styles.bottomButton}>
        <BottomButton />
        <CustomButton onPress={() => setIsModalVisible(true)} />
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>Create New Card</Text>

            <View style={modalStyles.inputContainer}>
              <Text style={modalStyles.inputLabel}>Word</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="Enter word"
                value={newCardWord1}
                onChangeText={setNewCardWord1}
              />
            </View>

            <View style={modalStyles.inputContainer}>
              <Text style={modalStyles.inputLabel}>Translation</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="Enter translation"
                value={newCardWord2}
                onChangeText={setNewCardWord2}
              />
            </View>

            <View style={modalStyles.importanceContainer}>
              <Text style={modalStyles.inputLabel}>Importance Level</Text>
              <View style={modalStyles.importanceOptions}>
                <TouchableOpacity
                  style={[
                    modalStyles.importanceButton,
                    importanceLevel === "low" && modalStyles.selectedImportance,
                  ]}
                  onPress={() => setImportanceLevel("low")}
                >
                  <Text style={modalStyles.importanceText}>Low</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    modalStyles.importanceButton,
                    importanceLevel === "medium" &&
                      modalStyles.selectedImportance,
                  ]}
                  onPress={() => setImportanceLevel("medium")}
                >
                  <Text style={modalStyles.importanceText}>Medium</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    modalStyles.importanceButton,
                    importanceLevel === "high" &&
                      modalStyles.selectedImportance,
                  ]}
                  onPress={() => setImportanceLevel("high")}
                >
                  <Text style={modalStyles.importanceText}>High</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setNewCardWord1("");
                  setNewCardWord2("");
                  setImportanceLevel("low");
                }}
              >
                <Text style={modalStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  modalStyles.button,
                  modalStyles.saveButton,
                  (!newCardWord1 || !newCardWord2) &&
                    modalStyles.disabledButton,
                ]}
                disabled={!newCardWord1 || !newCardWord2}
                onPress={handleAddCard}
                x
              >
                <Text style={modalStyles.saveButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomButton: {
    display: "flex",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    bottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    display: "flex",
    alignItems: "center",
  },
  flatListContent: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  cardContainer: {
    borderRadius: 10,
    height: 80,
    marginBottom: 10,
    justifyContent: "center",
    shadowColor: "#d8e2dc",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    borderWidth: 2,
    borderColor: "#eaedf9",
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    marginLeft: 20,
  },
  wordEnglish: {
    fontSize: 18,
    fontWeight: "bold",
  },
  wordTranslation: {
    fontSize: 14,
    color: "#575757",
  },

  editButton: {
    backgroundColor: "#4f42d8", // Add color for the edit button
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 80,
    borderRadius: 10,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF0000", // Add color for the edit button
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 80,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  starContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  starIcon: {
    fontSize: 16,
  },
  cardStyles: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  buttonStyles: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    borderRadius: 15,
    paddingVertical: 8,
    width: "45%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },

  dropDown: {
    position: "absolute",
    backgroundColor: "white",
    top: -260,
    borderRadius: 12,
    paddingVertical: 8,
    width: 240,
    shadowColor: "#4f42d8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 999,
  },
  dropdownTitle: {
    padding: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#4f42d8",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 12,
  },
  dropdownItem: {
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: "column",
    gap: 4,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2d2d2d",
  },
  dropdownSubtext: {
    fontSize: 12,
    color: "#888",
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#4f42d8",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  importanceContainer: {
    marginBottom: 25,
  },
  importanceOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  importanceButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  selectedImportance: {
    backgroundColor: "#4f42d8",
    borderColor: "#4f42d8",
  },
  importanceText: {
    fontWeight: "500",
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    borderRadius: 15,
    padding: 12,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
  },
  saveButton: {
    backgroundColor: "#48c590",
  },
  disabledButton: {
    backgroundColor: "#a8dbc7",
    opacity: 0.7,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
export default CardDecks;
