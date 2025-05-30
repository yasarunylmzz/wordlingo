import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";

import AlternativLogin from "./Components/AlternativLogin";
import BottomContent from "./Components/BottomContent";
import InputSection from "./Components/InputSection";

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.loginText}>Login</Text>

      <InputSection />

      <View style={styles.dividerSection}>
        <Divider style={styles.divider} />
        <Text style={{ color: "#C6CEDD" }}>or with</Text>
        <Divider style={styles.divider} />
      </View>

      <AlternativLogin />

      <BottomContent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    gap: 5,
  },
  dividerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E3E8F1",
    marginHorizontal: 10,
  },
  loginText: {
    marginLeft: 30,
    fontSize: 30,
    width: "90%",
    fontWeight: "bold",
    color: "#5B67CA",
  },
});

export default LoginScreen;
