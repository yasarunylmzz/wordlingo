import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootStackParams";

const BottomContent = () => {
  type NavigationType = NavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<NavigationType>();

  return (
    <View style={styles.bottomContent}>
      <Text style={styles.text}>Don't have an account?</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignIn");
        }}
      >
        <Text style={styles.signUp}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContent: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 5,
    bottom: 0,
  },
  signUp: {
    color: "#2C406E",
    fontSize: 14,
    fontWeight: "bold",
  },
  text: {
    color: "#2C406E",
    fontSize: 14,
  },
});

export default BottomContent;
