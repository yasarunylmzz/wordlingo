import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Expo'da Ionicons kullanımı, başka bir ikon kütüphanesi de tercih edebilirsiniz
import { ScrollView } from "react-native";

const HelpAndSupport = () => {
  const navigation = useNavigation(); // Geri çıkma butonu için navigation kullanımı

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* Üst Kısım (Başlık ve Geri Butonu) */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#12175E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
        </View>

        {/* İçerik Bölümü */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>How Can We Help You?</Text>
            <Text style={styles.subtitle}>
              Here you'll find common questions and solutions. Feel free to
              reach out if you need further assistance.
            </Text>
          </View>

          {/* Sıkça Sorulan Sorular (SSS) */}
          <View style={styles.descriptionSection}>
            <Text style={styles.featuresTitle}>
              Frequently Asked Questions:
            </Text>
            <Text style={styles.featureItem}>
              • How do I reset my password? {"\n"}If you've forgotten your
              password, you can reset it by visiting the password recovery
              section in the app's settings.
            </Text>
            <Text style={styles.featureItem}>
              • How do I create a new flashcard deck? {"\n"}Creating a new
              flashcard deck is easy! Simply go to the 'Decks' section and tap
              on the 'Create New Deck' button to get started.
            </Text>
            <Text style={styles.featureItem}>
              • How do I track my progress? {"\n"}Your progress is automatically
              tracked by the app. You can view your stats and performance in the
              'Progress' tab.
            </Text>
            <Text style={styles.featureItem}>
              • How do I contact support? {"\n"}You can contact our support team
              via email at support@wordlingo.com or by filling out the contact
              form in the 'Support' section of the app.
            </Text>
          </View>

          {/* İletişim Bilgileri */}
          <View style={styles.contactSection}>
            <Text style={styles.featuresTitle}>Need More Help?</Text>
            <Text style={styles.description}>
              If you couldn't find the answer you're looking for, please reach
              out to our support team. We're here to help you with any issues or
              questions you might have.
            </Text>
            <Text style={styles.contactInfo}>
              Email us at: support@wordlingo.com
            </Text>
          </View>
        </View>

        {/* Footer */}
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
    backgroundColor: "#fff",
    paddingVertical: 15,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 10,
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#12175E",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  titleSection: {
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
    textAlign: "center",
    marginTop: 8,
  },
  descriptionSection: {
    marginBottom: 20,
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
    marginBottom: 10,
    lineHeight: 20,
  },
  contactSection: {
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 22,
  },
  contactInfo: {
    fontSize: 16,
    color: "#12175E",
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  footerText: {
    fontSize: 12,
    color: "#888",
  },
});

export default HelpAndSupport;
