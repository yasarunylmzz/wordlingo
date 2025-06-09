import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ContactSection: React.FC = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginTop: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#636E72",
    textAlign: "center",
    marginBottom: 16,
  },
  emailButton: {
    backgroundColor: "#2F80ED",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emailButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ContactSection;
