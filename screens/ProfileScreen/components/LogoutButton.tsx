import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../../stores/userStore";
import LogoutIcon from "../../../svg/LogoutIcon";

const LogoutButton: React.FC = () => {
  const navigation = useNavigation();
  const logOut = useAuthStore().logOut;

  const handleLogout = () => {
    logOut();
    // Clear the auth data from the store
    useAuthStore.getState().clearAuthData();
    // Navigate to the login screen
    navigation.navigate("Login");
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutSection}>
      <LogoutIcon />
      <Text style={styles.logout}>Log Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutSection: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    height: 150,
  },
  logout: {
    color: "#DC143C",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default LogoutButton;
