// Components/CardList.tsx dosyası olarak oluşturun
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import EditIcon from "../../../svg/EditIcon";
import GarbageIcon from "../../../svg/GarbageIcon";

const { width } = Dimensions.get("window");

interface Card {
  id: string;
  word1: string;
  word2: string;
  importanceLevel: "low" | "medium" | "high";
}

interface CardListProps {
  cards: Card[];
  onDeleteCard: (id: string) => void;
  onEditCard: (id: string) => void;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  onDeleteCard,
  onEditCard,
}) => {
  const renderRightActions = (id: string) => (
    <TouchableOpacity onPress={() => onDeleteCard(id)}>
      <View style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>
          <GarbageIcon />
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderLeftActions = (id: string) => (
    <TouchableOpacity onPress={() => onEditCard(id)}>
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
        renderLeftActions={() => renderLeftActions(item.id)}
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

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#4f42d8",
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
    backgroundColor: "#FF0000",
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
});

export default CardList;
