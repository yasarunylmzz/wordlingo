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
import { Ionicons } from "@expo/vector-icons";

const AboutApp = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About App</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Ionicons name="book" size={48} color="#2F80ED" style={styles.icon} />
          <Text style={styles.title}>Word Lingo</Text>
          <Text style={styles.subtitle}>Vocabulary Mastery App</Text>
        </View>

        {/* Content Container */}
        <View style={styles.content}>
          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              Word Lingo is an innovative flashcard app designed to help you
              expand your vocabulary in a fun and effective way. Perfect for
              language learners and exam preparers, our app combines
              science-backed techniques with intuitive design.
            </Text>
          </View>

          {/* Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featureItem}>
              <Ionicons name="add-circle" size={20} color="#2F80ED" />
              <Text style={styles.featureText}>Create custom flashcards</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="stats-chart" size={20} color="#2F80ED" />
              <Text style={styles.featureText}>Track learning progress</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="repeat" size={20} color="#2F80ED" />
              <Text style={styles.featureText}>Smart spaced repetition</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="globe" size={20} color="#2F80ED" />
              <Text style={styles.featureText}>Multiple language support</Text>
            </View>
          </View>

          {/* Technical Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>Lingo Team</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Word Lingo</Text>
          <Text style={styles.footerText}>All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FD",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  container: {
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    width: "100%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2D3436",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#636E72",
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#636E72",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 15,
    marginLeft: 12,
    color: "#2D3436",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#636E72",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3436",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  footerText: {
    fontSize: 12,
    color: "#636E72",
    marginBottom: 4,
  },
});

export default AboutApp;
