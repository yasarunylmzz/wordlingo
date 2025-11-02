import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import SwipeableDeleteAction from "./SwipableDeleteAction";

interface DeckCardProps {
  deck: any;
  index: number;
  onDelete: (deckId: string, deckTitle: string) => void;
  isDeleting?: boolean;
  setSwipeableRef: (id: string, ref: any) => void;
  closeOtherSwipeables: (id: string) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  index,
  onDelete,
  isDeleting = false,
  setSwipeableRef,
  closeOtherSwipeables,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  // İkonlar için renkler
  const cardColors = [
    "#6A5ACD",
    "#4169E1",
    "#3498db",
    "#1abc9c",
    "#2ecc71",
    "#f1c40f",
  ];
  const cardColor = cardColors[index % cardColors.length];

  return (
    <Swipeable
      ref={(ref) => setSwipeableRef(deck.ID, ref)}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      overshootRight={false}
      onSwipeableOpen={() => closeOtherSwipeables(deck.ID)}
      renderRightActions={(progress, dragX) => (
        <SwipeableDeleteAction
          progress={progress}
          dragX={dragX}
          onDelete={() => onDelete(deck.ID, deck.Title)}
          isDeleting={isDeleting}
        />
      )}
    >
      <View style={styles.deckCardContainer}>
        <TouchableOpacity
          style={[styles.deckCard, { borderLeftColor: cardColor }]}
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate("CardDecks", {
              deckId: deck.ID,
              deckTitle: deck.Title,
            });
          }}
        >
          {/* Card Content */}
          <View style={styles.deckIconContainer}>
            <View style={[styles.deckIcon, { backgroundColor: cardColor }]}>
              <Ionicons name="layers-outline" size={24} color="#fff" />
            </View>
          </View>
          <View style={styles.deckContent}>
            <Text
              style={styles.deckTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {deck.Title}
            </Text>
            <Text
              style={styles.deckDescription}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {deck.Description}
            </Text>
            <View style={styles.deckMeta}>
              <View style={styles.cardCountContainer}>
                <Ionicons name="card-outline" size={14} color="#49709c" />
                <Text style={styles.cardCountText}>{deck.cardCount} cards</Text>
              </View>
              <Text style={styles.dateText}>{deck.createdDate}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  // Styles copied from main file
  deckCardContainer: {
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
  },
  deckCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
    borderLeftWidth: 5,
    borderLeftColor: "#6A5ACD",
  },
  deckIconContainer: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deckIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#6A5ACD",
    justifyContent: "center",
    alignItems: "center",
  },
  deckContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 0,
    justifyContent: "center",
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d141c",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  deckDescription: {
    fontSize: 14,
    color: "#49709c",
    marginBottom: 8,
    lineHeight: 18,
  },
  deckMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardCountText: {
    fontSize: 13,
    color: "#49709c",
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#718096",
  },
});

export default DeckCard;
