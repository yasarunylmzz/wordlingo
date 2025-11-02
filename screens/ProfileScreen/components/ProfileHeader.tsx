import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Avatar from "../../../svg/Avatar";

interface ProfileHeaderProps {
  name: string;
  surname: string;
  username: string;
  onSettingsPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  surname,
  username,
  onSettingsPress,
}) => {
  function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.profileText}>Profile</Text>
        <TouchableOpacity
          onPress={onSettingsPress}
          style={styles.settingsButton}
        >
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Avatar />
        </View>
        <Text style={styles.name}>
          {capitalize(name)} {capitalize(surname)}
        </Text>
        <Text style={styles.username}>@{username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  profileText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4f24d8",
  },
  settingsButton: {
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
  },
  settingsIcon: {
    fontSize: 18,
    color: "#666",
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
    transform: [{ scale: 1.2 }],
  },
  name: {
    color: "#1a1a1a",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  username: {
    color: "#666",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
});

export default ProfileHeader;
