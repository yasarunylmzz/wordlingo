// FlipCardScreen.js

import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import FlipCard from "../Components/FlipCard/FlipCard";
import { MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LeftArrow from "../svg/LeftArrow";
import ThumbsUp from "../svg/ThumbsUp";
import Confuse from "../svg/Confuse";
import { useNavigation } from "@react-navigation/native";

const FlipCardScreen = () => {
  const navigation = useNavigation();
  const isFlipped = useSharedValue(0);

  const toggleFlip = () => {
    isFlipped.value = isFlipped.value === 0 ? 1 : 0;
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
          <FlipCard
            isFlipped={isFlipped}
            cardStyle={styles.card}
            RegularContent={
              <TouchableOpacity onPress={toggleFlip} style={styles.frontCard}>
                <Text style={styles.cardText}>Ön Yüz</Text>
              </TouchableOpacity>
            }
            FlippedContent={
              <TouchableOpacity onPress={toggleFlip} style={styles.backCard}>
                <Text style={styles.cardText}>Arka Yüz</Text>
              </TouchableOpacity>
            }
          />
        </View>

        {/* Alt Butonlar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.roundButton, styles.redButton]}>
            <MaterialIcons name="close" size={30} color="#FF4242" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roundButton, styles.yellowButton]}>
            <Confuse />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roundButton, styles.greenButton]}>
            <ThumbsUp />
          </TouchableOpacity>
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
  card: {
    width: "90%",
    height: "90%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  frontCard: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D8BFD8",
    borderRadius: 10,
  },
  backCard: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#90EE90",
    borderRadius: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  roundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  redButton: {
    borderColor: "#FF4242",
  },
  yellowButton: {
    borderColor: "orange",
  },
  greenButton: {
    borderColor: "#00D078",
  },
});
