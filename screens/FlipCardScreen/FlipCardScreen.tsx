import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import FlipCard, {
  FlipSessionCompletePayload,
  FlipSessionProgress,
} from "./Components/FlipCard";
import { RootStackParamList } from "../RootStackParams";
import SessionHeader from "../../Components/ui/SessionHeader";
import { colors } from "../../theme/theme";

const FlipCardScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "FlipCardScreen">>();

  const {
    deckId,
    deckTitle,
    mode = "normal",
    shuffle = true,
    hideMastered = false,
  } = route.params;

  const [progress, setProgress] = useState<FlipSessionProgress>({
    remaining: 0,
    total: 0,
    correct: 0,
    wrong: 0,
  });

  const handleProgress = useCallback((next: FlipSessionProgress) => {
    setProgress(next);
  }, []);

  const handleSessionComplete = useCallback(
    (payload: FlipSessionCompletePayload) => {
      navigation.replace("StudyResult", {
        deskId: payload.deskId,
        deckTitle: payload.deckTitle,
        correct: payload.correct,
        wrong: payload.wrong,
        total: payload.total,
        durationMs: payload.durationMs,
        points: payload.points,
        mode: payload.mode,
        exercise: "flip",
        source: "flip",
      });
    },
    [navigation],
  );

  const doneCount = progress.total - progress.remaining;
  const progressRatio =
    progress.total > 0 ? doneCount / progress.total : 0;
  const position =
    progress.remaining > 0 ? doneCount + 1 : progress.total;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <SessionHeader
          deckName={deckTitle}
          correct={progress.correct}
          wrong={progress.wrong}
          position={position}
          total={progress.total}
          progress={progressRatio}
          onExit={() => navigation.goBack()}
        />

        <View style={styles.cardContainer}>
          <FlipCard
            deckId={deckId}
            deckTitle={deckTitle}
            mode={mode}
            shuffle={shuffle}
            hideMastered={hideMastered}
            onProgress={handleProgress}
            onSessionComplete={handleSessionComplete}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default FlipCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});
