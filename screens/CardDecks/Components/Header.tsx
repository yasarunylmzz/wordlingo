import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import LeftArrow from "../../../svg/LeftArrow";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.appBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <LeftArrow />
      </TouchableOpacity>
      <Text style={styles.appbarText}>Biology</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    margin: 2,
    paddingHorizontal: 20,
  },
  appbarText: {
    marginLeft: 20,
    fontSize: 24,
    fontWeight: "700",
  },
});

export default Header;
