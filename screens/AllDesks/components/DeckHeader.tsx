import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface DeckHeaderProps {
  title: string;
  onAddPress?: () => void;
}

const DeckHeader: React.FC<DeckHeaderProps> = ({ title, onAddPress }) => {
  const navigation = useNavigation();

  const handleAddPress = () => {
    if (onAddPress) {
      onAddPress();
    } else {
      navigation.navigate("CreateDeck");
    }
  };

  return (
    <View style={styles.header}>
      <View />
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPress}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={24} color="#0d141c" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    marginTop: 14,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4f24d8",
    flex: 1,
    marginLeft: 20,
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DeckHeader;
