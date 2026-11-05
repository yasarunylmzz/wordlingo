import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Play, Plus } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../RootStackParams";
import AppText from "../../../Components/ui/AppText";
import { colors, radii } from "../../../theme/theme";

interface BottomButtonProps {
  deckId: string;
  deckTitle: string;
  cardCount: number;
  onAdd: () => void;
}

const BottomButton: React.FC<BottomButtonProps> = ({
  deckId,
  deckTitle,
  cardCount,
  onAdd,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [
          styles.add,
          pressed && { transform: [{ scale: 0.98 }] },
        ]}
      >
        <Plus size={17} color={colors.ink} strokeWidth={2.25} />
        <AppText weight="semibold" style={styles.addText}>
          Kart ekle
        </AppText>
      </Pressable>
      <Pressable
        disabled={cardCount === 0}
        onPress={() =>
          navigation.navigate("StudySetup", { deckId, deckTitle })
        }
        style={({ pressed }) => [
          styles.study,
          cardCount === 0 && styles.studyDisabled,
          pressed && cardCount > 0 && { transform: [{ scale: 0.98 }] },
        ]}
      >
        <Play
          size={15}
          color={cardCount === 0 ? colors.muted : colors.white}
          fill={cardCount === 0 ? colors.muted : colors.white}
          strokeWidth={0}
        />
        <AppText
          weight="semibold"
          style={[styles.studyText, cardCount === 0 && { color: colors.muted }]}
        >
          Çalış
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  add: {
    flex: 1,
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addText: { fontSize: 15 },
  study: {
    flex: 1.4,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  studyDisabled: {
    backgroundColor: colors.bar,
  },
  studyText: {
    fontSize: 15,
    color: colors.white,
  },
});

export default BottomButton;
