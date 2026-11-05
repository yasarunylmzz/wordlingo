import React, { useCallback, useState } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { X } from "lucide-react-native";
import FlipCard, {
  FlipSessionCompletePayload,
  FlipSessionProgress,
} from "./Components/FlipCard";
import { RootStackParamList } from "../RootStackParams";
import AppText from "../../Components/ui/AppText";
import { colors, fonts, radii, space } from "../../theme/theme";

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <View style={styles.topRow}>
            <Pressable
              accessibilityLabel="Oturumu bitir"
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <X size={18} color={colors.ink} strokeWidth={2} />
            </Pressable>
            <View style={styles.headerContent}>
              <AppText weight="semibold" style={styles.title} numberOfLines={1}>
                {deckTitle}
              </AppText>
              <AppText style={styles.subtitle}>
                <AppText style={styles.correct}>{progress.correct} doğru</AppText>
                {" · "}
                <AppText style={styles.wrong}>{progress.wrong} yanlış</AppText>
              </AppText>
            </View>
            <AppText weight="mono" style={styles.counter}>
              {Math.min(doneCount + (progress.remaining > 0 ? 1 : 0), progress.total)}
              /{progress.total}
            </AppText>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, progressRatio * 100)}%` },
              ]}
            />
          </View>
        </View>

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
  topBar: {
    paddingHorizontal: space[4],
    paddingTop: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    letterSpacing: -0.255,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  correct: {
    fontSize: 12,
    color: colors.correct,
    fontFamily: fonts.regular,
  },
  wrong: {
    fontSize: 12,
    color: colors.wrong,
    fontFamily: fonts.regular,
  },
  counter: {
    fontSize: 13,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  progressBarContainer: {
    marginTop: 12,
    height: 4,
    backgroundColor: "rgba(222,219,238,0.7)",
    borderRadius: radii.full,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: radii.full,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});
