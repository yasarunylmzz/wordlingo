import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import PlayIcon from "../../../svg/PlayIcon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../RootStackParams";

interface BottomButtonProps {
  deckId: string;
  deckTitle: string;
}

/** Play opens StudySetup (mode / exercise / shuffle / hideMastered). */
const BottomButton: React.FC<BottomButtonProps> = ({ deckId, deckTitle }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("StudySetup", { deckId, deckTitle })
        }
        style={[
          styles.buttonStyles,
          {
            backgroundColor: "#4f42d8",
            shadowColor: "#4f42d8",
            flexDirection: "row",
            alignItems: "center",
            width: 180,
          },
        ]}
      >
        <PlayIcon />
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
    </View>
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

export default BottomButton;
