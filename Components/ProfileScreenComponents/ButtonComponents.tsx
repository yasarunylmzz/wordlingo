import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import ProfileIcon from "../../svg/ProfileIcon";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../screens/RootStackParams";

interface ButtonComponentsProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  targetScreen: keyof RootStackParamList;
}
type NavigationType = NavigationProp<RootStackParamList>;

const ButtonComponents: React.FC<ButtonComponentsProps> = ({
  title,
  description,
  icon,
  targetScreen,
}) => {
  const navigation = useNavigation<NavigationType>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(targetScreen);
      }}
    >
      <View style={styles.settings1Top}>
        <View style={styles.settings1}>{icon}</View>
        <View style={styles.textSection}>
          <Text style={styles.text1}>{title}</Text>
          <Text style={styles.text2}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settings1Top: {
    width: "100%",
    height: 40,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  settings1: {
    width: 50,
    height: 50,
    backgroundColor: "#f3f2fb",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    display: "flex",
    gap: 4,
  },
  text1: {
    fontSize: 13,
    fontWeight: "bold",
  },
  text2: {
    fontSize: 11,
    color: "#A4A4A6",
  },
});

export default ButtonComponents;
