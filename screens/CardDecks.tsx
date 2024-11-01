import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import LeftArrow from "../svg/LeftArrow";
import GarbageIcon from "../svg/GarbageIcon";

const { width } = Dimensions.get("window");

const colors = ["#bde0fe", "#ffe5d9", "#e0c3fc", "#d8e2dc"];

const CardDecks = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([
    {
      id: "1",
      word1: "Run",
      word2: "Koşmak",
      color: colors[0],
      importanceLevel: "low",
    },
    {
      id: "2",
      word1: "Eat",
      word2: "Yemek",
      color: colors[1],
      importanceLevel: "medium",
    },
    {
      id: "3",
      word1: "Sleep",
      word2: "Uyumak",
      color: colors[2],
      importanceLevel: "high",
    },
  ]);

  const handleDeleteCard = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const renderRightActions = (id) => (
    <TouchableOpacity onPress={() => handleDeleteCard(id)}>
      <View style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Sil</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDots = (importanceLevel) => {
    let dotColors;
    switch (importanceLevel) {
      case "high":
        dotColors = ["red", "red", "red"];
        break;
      case "medium":
        dotColors = ["#ffdd00", "#ffdd00", "white"];
        break;
      case "low":
        dotColors = ["green", "white", "white"];
        break;
      default:
        dotColors = ["white", "white", "white"];
    }

    return dotColors.map((color, index) => (
      <View key={index} style={[styles.dot, { backgroundColor: color }]} />
    ));
  };

  const renderItem = ({ item }) => (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <View
          style={[
            styles.cardContainer,
            { backgroundColor: item.color, width: width * 0.95 },
          ]}
        >
          <View style={styles.cardStyles}>
            <View style={styles.cardContent}>
              <Text style={styles.wordEnglish}>{item.word1}</Text>
              <Text style={styles.wordTranslation}>{item.word2}</Text>
              <View style={styles.dotStyles}>
                {renderDots(item.importanceLevel)}
              </View>
            </View>
            <TouchableOpacity>
              <GarbageIcon />
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrow />
        </TouchableOpacity>
        <Text style={styles.appbarText}>Biology</Text>
        <TouchableOpacity
          style={styles.appbarStart}
          onPress={() => console.log("start")}
        >
          <Text style={styles.appbarStartText}>Start</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />
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
  appbarStart: {
    backgroundColor: "#133266",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  appbarStartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cardStyles: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: "#000",
    borderColor: "#adb5bd",
    borderWidth: 0.5,
  },
  dotStyles: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    marginTop: 5,
  },
});

export default CardDecks;
