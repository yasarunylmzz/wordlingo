// FlipCardScreen.js

/**
 * use zustand for delete item from array and update the state with buttons in FlipCardScreen
 *  */
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useNavigation } from "@react-navigation/native";
import LeftArrow from "../../svg/LeftArrow";
import FlipCard from "./Components/FlipCard";
import Confuse from "../../svg/Confuse";
import ThumbsUp from "../../svg/ThumbsUp";

const FlipCardScreen = () => {
  const navigation = useNavigation();

  const [activeButton, setActiveButton] = useState(null);
  const handleButtonPress = (buttonType) => {
    setActiveButton(buttonType);
  };

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
            <Text style={styles.title}>Common Words</Text>
            <Text style={styles.subtitle}>55 words</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar} />
            </View>
          </View>
        </View>

        {/* Öğrenme, Gözden Geçirme, ve Ustalaşma Bölümü */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.circle, { backgroundColor: "#FF4242" }]} />
            <Text style={styles.statLabel}>Learning</Text>
            <Text style={styles.statValue}>5</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.circle, { backgroundColor: "orange" }]} />
            <Text style={styles.statLabel}>Reviewing</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.circle, { backgroundColor: "#00D078" }]} />
            <Text style={styles.statLabel}>Mastered</Text>
            <Text style={styles.statValue}>16</Text>
          </View>
        </View>

        {/* Kart Bölgesi */}
        <View style={styles.cardContainer}>
          <FlipCard />
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

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginTop: 15,
  },
  statItem: {
    alignItems: "center",
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D2D2D",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  newButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 8, // Butonlar arası boşluk
  },
  newButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24, // Daha yuvarlak köşeler
    borderWidth: 2, // Kalın kenarlık
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "#E0E0E0", // Pasif durumda gri kenarlık
  },
  buttonText: {
    color: "#757575", // Daha soft gri renk
    fontWeight: "600",
    fontSize: 14,
  },
  activeButtonText: {
    color: "white",
    fontWeight: "700", // Aktif metin daha kalın
  },
  activeLearnButton: {
    backgroundColor: "#FF4242",
    borderColor: "#FF4242", // Kenarlık rengi arka planla aynı
  },
  activeReviewButton: {
    backgroundColor: "orange",
    borderColor: "orange",
  },
  activeKnownButton: {
    backgroundColor: "#00D078",
    borderColor: "#00D078",
  },
});
