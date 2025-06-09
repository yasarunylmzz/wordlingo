import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "../../../svg/Avatar";

interface ProfileHeaderProps {
  name: string;
  surname: string;
  username: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  surname,
  username,
}) => {
  function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <View style={styles.topSection}>
      <Text style={styles.profileText}>Profile</Text>
      <View style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.profile}>
            <Avatar />
            <View style={styles.textProfileSection}>
              <Text style={styles.name}>
                {capitalize(name)} {capitalize(surname)}
              </Text>
              <Text style={styles.username}>@{username}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topSection: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  profile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scrollView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#4f24d8",
    alignItems: "center",
    borderRadius: 10,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4f24d8",
    padding: 20,
  },
  username: {
    color: "#fff",
    fontSize: 11,
  },
  textProfileSection: {
    display: "flex",
    gap: 2,
  },
});

export default ProfileHeader;
