import React from "react";
import { View, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useAuthStore } from "../../stores/userStore";
import ProfileHeader from "./components/ProfileHeader";
import SettingsSection from "./components/SettingsSection";
import LogoutButton from "./components/LogoutButton";

const ProfileScreen = () => {
  const username = useAuthStore((state) => state.user.username);
  const name = useAuthStore((state) => state.user.name);
  const surname = useAuthStore((state) => state.user.surname);

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <ProfileHeader name={name!} surname={surname!} username={username!} />

        <SettingsSection />

        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },
});

export default ProfileScreen;
