import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Google from "../../../svg/Google";
import Facebook from "../../../svg/Facebook";
import Apple from "../../../svg/Apple";

const AlternativLogin = () => {
  return (
    <View style={styles.alternativeLogin}>
      <View style={styles.logoContent}>
        <Google />
      </View>
      <View style={styles.logoContent}>
        <Facebook />
      </View>
      <View style={styles.logoContent}>
        <Apple />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alternativeLogin: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 15,
  },
  logoContent: {
    height: 50,
    backgroundColor: "#FFFFFF",
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E3E8F1",
    borderWidth: 1,
  },
});

export default AlternativLogin;
