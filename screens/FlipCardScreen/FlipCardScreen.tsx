import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LeftArrow from "../../svg/LeftArrow";
import FlipCard, {
  FlipSessionCompletePayload,
  FlipSessionProgress,
} from "./Components/FlipCard";
import { RootStackParamList } from "../RootStackParams";

const FlipCardScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "FlipCardScreen">>();

  const deckId = route.params.deckId;
  const deckTitle = route.params.deckTitle;

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
      navigation.replace("FlipSessionResult", {
        deskId: payload.deskId,
        deckTitle: payload.deckTitle,
        correct: payload.correct,
        wrong: payload.wrong,
        total: payload.total,
        durationMs: payload.durationMs,
      });
    },
    [navigation]
  );

  const progressRatio =
    progress.total > 0
      ? (progress.total - progress.remaining) / progress.total
      : 0;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <LeftArrow />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{deckTitle}</Text>
            <Text style={styles.subtitle}>
              {progress.remaining}/{progress.total} remaining ·{" "}
              {progress.correct} doğru · {progress.wrong} yanlış
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${Math.min(100, progressRatio * 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <FlipCard
            deckId={deckId}
            deckTitle={deckTitle}
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
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  backButton: {
    padding: 10,
  },
  headerContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D2D2D",
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
  },
  progressBarContainer: {
    width: "90%",
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginTop: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
