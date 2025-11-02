import React, { useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useAuthStore } from "../../stores/userStore";
import { useCardStore } from "../../stores/cardStore";
import ProfileHeader from "./components/ProfileHeader";
import LogoutButton from "./components/LogoutButton";

const ProfileScreen = ({ navigation }: any) => {
  const username = useAuthStore((state) => state.user.username);
  const name = useAuthStore((state) => state.user.name);
  const surname = useAuthStore((state) => state.user.surname);
  const email = useAuthStore((state) => state.user.email);

  const cards = useCardStore((state) => state.cards);

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSettingsPress = () => {
    setShowSettingsModal(true);
  };

  const handleEditProfile = () => {
    setShowSettingsModal(false);
    navigation.navigate("MyAccount");
  };

  // Stats hesaplama
  const totalDecks = Object.keys(cards).length;
  const totalCards = Object.values(cards).reduce(
    (total, deckCards) => total + deckCards.length,
    0
  );

  const StatsComponent = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Statistics</Text>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalDecks}</Text>
          <Text style={styles.statLabel}>Desks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalCards}</Text>
          <Text style={styles.statLabel}>Cards</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Learned</Text>
        </View>
      </View>
    </View>
  );

  const UserInfoComponent = () => (
    <View style={styles.userInfoContainer}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>First Name</Text>
          <Text style={styles.infoValue}>{name}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Last Name</Text>
          <Text style={styles.infoValue}>{surname}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Username</Text>
          <Text style={styles.infoValue}>@{username}</Text>
        </View>
        {email && (
          <View style={[styles.infoCard, styles.fullWidth]}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: "center", paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader
            name={name!}
            surname={surname!}
            username={username!}
            onSettingsPress={handleSettingsPress}
          />

          <UserInfoComponent />

          <StatsComponent />
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showSettingsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setShowSettingsModal(false)}
          />
          <View style={styles.bottomPanel}>
            <View style={styles.panelIndicator} />
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Settings</Text>
              <TouchableOpacity
                onPress={() => setShowSettingsModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.settingOption}
              onPress={handleEditProfile}
            >
              <Text style={styles.settingOptionText}>Edit Profile</Text>
            </TouchableOpacity>

            <View style={styles.logoutContainer}>
              <LogoutButton />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    width: "100%",
  },
  userInfoContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 20,
    textAlign: "left",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: "48%",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  fullWidth: {
    width: "100%",
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  statsContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackground: {
    flex: 1,
  },
  bottomPanel: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 30,
    minHeight: 200,
  },
  panelIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#e9ecef",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  settingOption: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4f24d8",
    textAlign: "center",
  },
  logoutContainer: {
    marginTop: 16,
  },
});

export default ProfileScreen;
