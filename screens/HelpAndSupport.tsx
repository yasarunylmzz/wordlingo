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

const HelpAndSupport = () => {
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
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Ionicons name="help-buoy" size={48} color="#2F80ED" />
          <Text style={styles.heroTitle}>How Can We Help You?</Text>
          <Text style={styles.heroSubtitle}>
            Find answers to common questions or contact our support team
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQS.map((faq, index) => (
            <View key={index} style={styles.faqCard}>
              <View style={styles.faqHeader}>
                <Ionicons name={faq.icon} size={20} color="#2F80ED" />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </View>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Direct Contact</Text>
          <View style={styles.contactCard}>
            <Ionicons name="mail" size={32} color="#2F80ED" />
            <Text style={styles.contactTitle}>Email Support</Text>
            <Text style={styles.contactText}>
              We typically respond within 24 hours
            </Text>
            <TouchableOpacity style={styles.emailButton}>
              <Text style={styles.emailButtonText}>info@wordlingo.com</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  heroContainer: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3436",
    marginTop: 16,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#636E72",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 16,
    paddingLeft: 8,
  },
  faqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D3436",
    marginLeft: 12,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#636E72",
    lineHeight: 20,
    paddingLeft: 32,
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginVertical: 16,
  },
  contactText: {
    fontSize: 14,
    color: "#636E72",
    marginBottom: 16,
    textAlign: "center",
  },
  emailButton: {
    backgroundColor: "#F0F5FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  emailButtonText: {
    color: "#2F80ED",
    fontWeight: "500",
    fontSize: 14,
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

export default HelpAndSupport;
