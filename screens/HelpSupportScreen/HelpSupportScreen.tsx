import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeroSection from "./components/HeroSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "./components/ContactSection";

const HelpSupportScreen = () => {
  const navigation = useNavigation();

  const FAQS = [
    {
      question: "How do I reset my password?",
      answer:
        "If you've forgotten your password, you can reset it by visiting the password recovery section in the app's settings.",
      icon: "key",
    },
    {
      question: "How do I create a new flashcard deck?",
      answer:
        "Creating a new flashcard deck is easy! Simply go to the 'Decks' section and tap on the 'Create New Deck' button to get started.",
      icon: "add-circle",
    },
    {
      question: "How do I track my progress?",
      answer:
        "Your progress is automatically tracked by the app. You can view your stats and performance in the 'Progress' tab.",
      icon: "stats-chart",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact our support team via email at info@wordlingo.com or by filling out the contact form in the 'Support' section.",
      icon: "chatbubbles",
    },
  ];

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
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <HeroSection />
        <FAQSection faqs={FAQS} />
        <ContactSection />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 Word Lingo</Text>
          <Text style={styles.footerText}>Version 1.0.0</Text>
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

export default HelpSupportScreen;
