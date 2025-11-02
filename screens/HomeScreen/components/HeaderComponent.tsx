import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootStackParams";
import { useAuthStore } from "../../../stores/userStore";

const HeaderComponent = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();

  const name = useAuthStore((state) => {
    const userName = state.user.name;
    return userName
      ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
      : "";
  });

  return (
    <View style={styles.userContainer}>
      <View style={styles.topTextcontainer}>
        <Text style={styles.hiText}>Hi, {name}</Text>
        <Text style={styles.hiText2}>Let's make this day learn</Text>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationScreen")}
        ></TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileScreen")}
        ></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,

    borderEndEndRadius: 16,
    borderStartEndRadius: 16,
  },
  topTextcontainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  hiText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4f24d8",
  },
  hiText2: {
    fontSize: 14,
    color: "#575757",
  },
  users: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  rightSection: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconStyles: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  dotIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff763f",
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default HeaderComponent;
