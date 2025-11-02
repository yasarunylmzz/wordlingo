// FlipCardScreen.js

/**
 * use zustand for delete item from array and update the state with buttons in FlipCardScreen
 *  */
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useNavigation, useRoute } from "@react-navigation/native";
import LeftArrow from "../../svg/LeftArrow";
import FlipCard from "./Components/FlipCard";
import { useCardStore } from "../../stores/cardStore";

const FlipCardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Route parametrelerini güvenli bir şekilde al
  const params = route.params as
    | {
        deckId?: string;
        deckTitle?: string;
      }
    | undefined;

  const deckId = params?.deckId || "default";
  const deckTitle = params?.deckTitle || "Common Words";

  // Store'dan kartları al ve sayısını hesapla
  const { getCards } = useCardStore();
  const cards = getCards(deckId);
  const cardCount = cards.length;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Üst Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <LeftArrow />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{deckTitle}</Text>
            <Text style={styles.subtitle}>
              {cardCount} {cardCount === 1 ? "word" : "words"}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar} />
            </View>
          </View>
        </View>

        {/* Kart Bölgesi */}
        <View style={styles.cardContainer}>
          <FlipCard deckId={deckId} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default FlipCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  backButton: {
    padding: 10,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D2D2D",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
  },
  progressBarContainer: {
    width: "90%",
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginTop: 4,
  },
  progressBar: {
    width: "40%", // Bu değer ilerleme durumuna göre güncellenebilir
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
