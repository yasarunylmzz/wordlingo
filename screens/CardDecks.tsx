import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ListRenderItem,
  Modal,
  TextInput,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import LeftArrow from "../svg/LeftArrow";
import GarbageIcon from "../svg/GarbageIcon";
import PlayIcon from "../svg/PlayIcon";
import EditIcon from "../svg/EditIcon";

const { width } = Dimensions.get("window");

interface Card {
  id: string;
  word1: string;
  word2: string;
  importanceLevel: "low" | "medium" | "high";
}

const CardDecks: React.FC = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      word1: "Run",
      word2: "Koşmak",
      importanceLevel: "low",
    },
    {
      id: "2",
      word1: "Eat",
      word2: "Yemek",
      importanceLevel: "medium",
    },
    {
      id: "3",
      word1: "Sleep",
      word2: "Uyumak",
      importanceLevel: "high",
    },
    {
      id: "4",
      word1: "Sleep",
      word2: "Uyumak",
      importanceLevel: "high",
    },
    {
      id: "5",
      word1: "Sleep",
      word2: "Uyumak",
      importanceLevel: "high",
    },
    {
      id: "6",
      word1: "Sleep",
      word2: "Uyumak",
      importanceLevel: "high",
    },
    {
      id: "7",
      word1: "Sleep",
      word2: "Uyumak",
      importanceLevel: "high",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [language1, setLanguage1] = useState("");
  const [language2, setLanguage2] = useState("");

  const handleDeleteCard = (id: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const handleEditCard = (id: string) => {
    // Open edit modal or perform other editing actions
    console.log(`Edit card with ID: ${id}`);
  };

  const renderRightActions = (id: string) => (
    <TouchableOpacity onPress={() => handleDeleteCard(id)}>
      <View style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>
          <GarbageIcon />
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderLeftActions = (id: string) => (
    <TouchableOpacity onPress={() => handleEditCard(id)}>
      <View style={styles.editButton}>
        <Text style={styles.editButtonText}>
          <EditIcon color="white" />
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderStars = (importanceLevel: Card["importanceLevel"]) => {
    let starCount: number;
    switch (importanceLevel) {
      case "high":
        starCount = 3;
        break;
      case "medium":
        starCount = 2;
        break;
      case "low":
        starCount = 1;
        break;
      default:
        starCount = 0;
    }

    return (
      <View style={styles.starContainer}>
        {[...Array(3)].map((_, index) => (
          <Text
            key={index}
            style={[
              styles.starIcon,
              { color: index < starCount ? "#00D078" : "#eaedf3" },
            ]}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  const renderItem: ListRenderItem<Card> = ({ item }) => (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={() => renderRightActions(item.id)}
        renderLeftActions={() => renderLeftActions(item.id)} // Left swipe for edit
        friction={2}
        overshootRight={false}
      >
        <View
          style={[
            styles.cardContainer,
            { backgroundColor: "white", width: width * 0.95 },
          ]}
        >
          <View style={styles.cardStyles}>
            <View style={styles.cardContent}>
              <Text style={styles.wordEnglish}>{item.word1}</Text>
              <Text style={styles.wordTranslation}>{item.word2}</Text>
            </View>
            {renderStars(item.importanceLevel)}
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );

  const handleCreateCard = () => {
    const newCard: Card = {
      id: (cards.length + 1).toString(),
      word1: language1,
      word2: language2,
      importanceLevel: "high", // Default to 'low', can be adjusted
    };
    setCards((prevCards) => [...prevCards, newCard]);
    setLanguage1("");
    setLanguage2("");
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrow />
        </TouchableOpacity>
        <Text style={styles.appbarText}>Biology</Text>
      </View>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />
      <View style={styles.bottomButton}>
        <TouchableOpacity
          onPress={() => navigation.navigate("FlipCardScreen" as never)}
          style={[
            styles.buttonStyles,
            { backgroundColor: "#4f42d8", shadowColor: "#4f42d8" },
          ]}
        >
          <PlayIcon />
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={[
            styles.buttonStyles,
            { backgroundColor: "#48c590", shadowColor: "#48c590" },
          ]}
        >
          <EditIcon color="white" />
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for creating new card */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.input}
              placeholder="Language 1"
              value={language1}
              onChangeText={setLanguage1}
            />
            <TextInput
              style={styles.input}
              placeholder="Language 2"
              value={language2}
              onChangeText={setLanguage2}
            />
            <TouchableOpacity
              onPress={handleCreateCard}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Create Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  deleteButton: {
    backgroundColor: "red",
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
  appBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    margin: 2,
    paddingHorizontal: 20,
  },
  appbarText: {
    marginLeft: 20,
    fontSize: 24,
    fontWeight: "700",
  },
  bottomButton: {
    display: "flex",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    bottom: 65,
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
    padding: 10,
  },
  createButton: {
    backgroundColor: "#48c590",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
  },
});

export default CardDecks;
