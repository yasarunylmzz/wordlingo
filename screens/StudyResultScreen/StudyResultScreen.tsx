import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../RootStackParams";
import SessionSummary from "../../Components/ui/SessionSummary";
import { colors } from "../../theme/theme";

const StudyResultScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "StudyResult">>();
  const {
    deskId,
    deckTitle,
    correct,
    wrong,
    exercise = "flip",
    mode = "normal",
    source,
  } = route.params;

  const isQuiz = source === "quiz" || exercise === "quiz";
  const correctLabel = isQuiz ? "Doğru" : "Bildim";
  const wrongLabel = isQuiz ? "Yanlış" : "Bilemedim";

  const restart = (retryWrong: boolean) => {
    const shared = {
      deckId: deskId,
      deckTitle,
      mode: retryWrong ? ("wrong" as const) : mode,
      shuffle: true,
      hideMastered: false,
    };
    if (isQuiz) {
      navigation.replace("LearnScreen", {
        ...shared,
        quizDirection: "w1-w2",
        autoStart: true,
      });
      return;
    }
    navigation.replace("FlipCardScreen", shared);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <SessionSummary
        correct={correct}
        wrong={wrong}
        correctLabel={correctLabel}
        wrongLabel={wrongLabel}
        onRetryWrong={() => restart(true)}
        onRestart={() => restart(false)}
        onExit={() =>
          navigation.navigate("CardDecks", {
            deckId: deskId,
            deckTitle,
          })
        }
      />
    </SafeAreaView>
  );
};

export default StudyResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
});
