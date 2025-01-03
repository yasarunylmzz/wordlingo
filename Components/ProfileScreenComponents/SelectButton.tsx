import { View, Text, StyleSheet, Switch } from "react-native";
import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../screens/RootStackParams";

interface ButtonComponentsProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

type NavigationType = NavigationProp<RootStackParamList>;

const ButtonComponents: React.FC<ButtonComponentsProps> = ({
  title,
  description,
  icon,
}) => {
  const navigation = useNavigation<NavigationType>();
  const [isTouchIdEnabled, setIsTouchIdEnabled] = useState(false);

  const toggleTouchId = () => {
    setIsTouchIdEnabled((prevState) => !prevState);
    // Touch ID ile ilgili işlemler burada yapılabilir
    console.log("Touch ID", !isTouchIdEnabled ? "enabled" : "disabled");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textSection}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
      <Switch
        value={isTouchIdEnabled}
        onValueChange={toggleTouchId}
        trackColor={{ false: "#d3d3d3", true: "#7b61ff" }}
        thumbColor={isTouchIdEnabled ? "#fff" : "#f4f4f4"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#f3f2fb",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    flex: 1,
    gap: 4,
  },
  titleText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 11,
    color: "#A4A4A6",
  },
});

export default ButtonComponents;
