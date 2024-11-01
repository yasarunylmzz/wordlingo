import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Expo'da Ionicons kullanımı, başka bir ikon kütüphanesi de tercih edebilirsiniz

const AboutApp = () => {
  const navigation = useNavigation(); // Geri çıkma butonu için navigation kullanımı

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#12175E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About App</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Welcome to Word Lingo</Text>
          <Text style={styles.subtitle}>Master Vocabulary with Flashcards</Text>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Word Lingo is an innovative flashcard app designed to help you
            expand your vocabulary in a fun and effective way. Whether you're
            preparing for a language exam or just love learning new words, Word
            Lingo is your perfect companion.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Key Features:</Text>
          <Text style={styles.featureItem}>
            • Create custom flashcard decks
          </Text>
          <Text style={styles.featureItem}>• Track progress and mastery</Text>
          <Text style={styles.featureItem}>
            • Spaced repetition for better retention
          </Text>
          <Text style={styles.featureItem}>
            • Access pre-made word lists in multiple languages
          </Text>
          <Text style={styles.featureItem}>
            • Dark mode for night-time studying
          </Text>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Word Lingo - All Rights Reserved
          </Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", // İstenilen renk tonu
    paddingVertical: 15,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,
    padding: 10,
    color: "#12175E",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#12175E",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },
  descriptionSection: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
  },
  featuresSection: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  featureItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
  },
});

export default AboutApp;
