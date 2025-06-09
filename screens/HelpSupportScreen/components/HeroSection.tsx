import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HeroSection: React.FC = () => {
  return (
    <View style={styles.heroContainer}>
      <Ionicons name="help-buoy" size={48} color="#2F80ED" />
      <Text style={styles.heroTitle}>How Can We Help You?</Text>
      <Text style={styles.heroSubtitle}>
        Find answers to common questions or contact our support team
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#636E72",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default HeroSection;
