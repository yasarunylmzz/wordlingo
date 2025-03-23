import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import EditIcon from "../../../svg/EditIcon";

const CustomButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonStyles,
        { backgroundColor: "#48c590", shadowColor: "#48c590" },
      ]}
    >
      <EditIcon color="white" />
      <Text style={styles.buttonText}>Create</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyles: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    borderRadius: 15,
    paddingVertical: 8,
    width: "45%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomButton;
