import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { loadSession, finishSession } from "../../../services/studySessionService";
import { withFlipLevelZeroRetry } from "../../../domain/learning/session";
import { useLearningStore } from "../../../stores/learningStore";
import type { StudyCard, StudyMode } from "../../../domain/learning/types";

const { width, height } = Dimensions.get("window");

/** Plan Phase 2: right = correct, left = wrong (TR/EN labels match). */
export type FlipSwipeDirection = "left" | "right";

export type FlipSessionProgress = {
  remaining: number;
  total: number;
  correct: number;
  wrong: number;
};

export type FlipSessionCompletePayload = {
  deskId: string;
  deckTitle: string;
  correct: number;
  wrong: number;
  total: number;
  durationMs: number;
  points: number;
  mode: StudyMode;
};

interface FlipCardProps {
  deckId: string;
  deckTitle: string;
  mode?: StudyMode;
  shuffle?: boolean;
  hideMastered?: boolean;
  onProgress?: (progress: FlipSessionProgress) => void;
  onSessionComplete?: (payload: FlipSessionCompletePayload) => void;
}

const FlipCard: React.FC<FlipCardProps> = ({
  deckId,
  deckTitle,
  mode = "normal",
  shuffle = true,
  hideMastered = false,
  onProgress,
  onSessionComplete,
}) => {
  const [stack, setStack] = useState<StudyCard[]>([]);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [finished, setFinished] = useState(false);

  const startedAtRef = useRef(Date.now());
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const totalRef = useRef(0);
  const completedRef = useRef(false);
  const stackRef = useRef<StudyCard[]>([]);
  const levelZeroRetriedRef = useRef(new Set<string>());

  const replaceStack = useCallback((next: StudyCard[]) => {
    stackRef.current = next;
    setStack(next);
  }, []);

  const translateX = useSharedValue(0);
  const flipAnimValue = useSharedValue(0);

  const SWIPE_THRESHOLD = 120;

  const emitProgress = useCallback(
    (remaining: number, nextCorrect: number, nextWrong: number, nextTotal: number) => {
      onProgress?.({
        remaining,
        total: nextTotal,
        correct: nextCorrect,
        wrong: nextWrong,
      });
    },
    [onProgress]
  );

  useEffect(() => {
    completedRef.current = false;
    startedAtRef.current = Date.now();
    correctRef.current = 0;
    wrongRef.current = 0;
    levelZeroRetriedRef.current = new Set();
    setCorrect(0);
    setWrong(0);
    setFinished(false);
    setIsFlipped(false);
    flipAnimValue.value = 0;
    translateX.value = 0;

    try {
      const { cards } = loadSession({
        deskId: deckId,
        mode,
        exercise: "flip",
        quizDirection: "w1-w2",
        limit: 50,
        shuffle,
        hideMastered,
      });
      // Stack top = last index (matches existing Flip UI)
      replaceStack(cards);
      setTotal(cards.length);
      totalRef.current = cards.length;
      emitProgress(cards.length, 0, 0, cards.length);
    } catch (error) {
      console.error("Load flip session error:", error);
      replaceStack([]);
      setTotal(0);
      totalRef.current = 0;
      emitProgress(0, 0, 0, 0);
    }
  }, [deckId, emitProgress, hideMastered, mode, replaceStack, shuffle]);

  const completeSession = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    const durationMs = Math.max(0, Date.now() - startedAtRef.current);
    const summaryCorrect = correctRef.current;
    const summaryWrong = wrongRef.current;
    const summaryTotal = totalRef.current;
    const points = summaryCorrect * 5;

    finishSession({
      deskId: deckId,
      exercise: "flip",
      mode,
      correct: summaryCorrect,
      wrong: summaryWrong,
      total: summaryTotal,
      points,
      durationMs,
    });

    setFinished(true);
    onSessionComplete?.({
      deskId: deckId,
      deckTitle,
      correct: summaryCorrect,
      wrong: summaryWrong,
      total: summaryTotal,
      durationMs,
      points,
      mode,
    });
  }, [deckId, deckTitle, mode, onSessionComplete]);

  const rateAndRemove = (direction: FlipSwipeDirection) => {
    const prev = stackRef.current;
    if (prev.length === 0) return;
    const card = prev[prev.length - 1];
    const learning = useLearningStore.getState();
    let next = prev.slice(0, -1);

    if (direction === "right") {
      // Sağ = Doğru / Knew it
      learning.applyCorrect(card.id);
      const nextCorrect = correctRef.current + 1;
      correctRef.current = nextCorrect;
      setCorrect(nextCorrect);
    } else {
      // Sol = Yanlış / Forgot
      const updated = learning.applyWrong(card.id);
      const nextWrong = wrongRef.current + 1;
      wrongRef.current = nextWrong;
      setWrong(nextWrong);
      if (updated) {
        const retried = withFlipLevelZeroRetry(
          prev,
          updated.learningLevel,
          levelZeroRetriedRef.current
        );
        next = retried.stack;
        if (retried.appended) {
          levelZeroRetriedRef.current.add(card.id);
          totalRef.current += 1;
          setTotal(totalRef.current);
        }
      }
    }

    replaceStack(next);
    emitProgress(
      next.length,
      correctRef.current,
      wrongRef.current,
      totalRef.current
    );
    if (next.length === 0) {
      // Defer so state flush finishes before navigate
      setTimeout(() => completeSession(), 0);
    }

    translateX.value = 0;
    setIsFlipped(false);
    flipAnimValue.value = 0;
  };

  const toggleFlip = () => {
    if (isGestureActive) return;

    try {
      const newFlipState = !isFlipped;
      setIsFlipped(newFlipState);
      flipAnimValue.value = withTiming(newFlipState ? 1 : 0, { duration: 400 });
    } catch (error) {
      console.error("Toggle flip error:", error);
    }
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setIsGestureActive)(true);
    })
    .onUpdate((event) => {
      "worklet";
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      "worklet";
      const currentTranslateX = translateX.value;

      if (Math.abs(currentTranslateX) > SWIPE_THRESHOLD) {
        const direction: FlipSwipeDirection =
          currentTranslateX > 0 ? "right" : "left";
        const targetX = direction === "right" ? width : -width;

        translateX.value = withTiming(
          targetX,
          { duration: 300 },
          (finishedAnim) => {
            if (finishedAnim) {
              runOnJS(rateAndRemove)(direction);
              runOnJS(setIsGestureActive)(false);
            }
          }
        );
      } else {
        translateX.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(setIsGestureActive)(false);
        });
      }
    });

  const panStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value / 10}deg` },
      { scale: 1 + Math.abs(translateX.value / 1000) },
    ],
  }));

  const leftHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], "clamp"),
  }));

  const rightHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], "clamp"),
  }));

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimValue.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden" as const,
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimValue.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden" as const,
    };
  });

  if (finished || (stack.length === 0 && total > 0)) {
    return (
      <View style={styles.container}>
        <View style={styles.noCardsContainer}>
          <Text style={styles.noCardsText}>Oturum tamamlandı</Text>
          <Text style={styles.hintSubtext}>
            {correct} doğru · {wrong} yanlış
          </Text>
        </View>
      </View>
    );
  }

  if (stack.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.noCardsContainer}>
          <Text style={styles.noCardsText}>Kart yok</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.stackContainer}>
        {stack.map((card, index) => {
          const isTopCard = index === stack.length - 1;
          const stackIndex = stack.length - 1 - index;
          const maxVisibleCards = 3;

          if (stackIndex >= maxVisibleCards) return null;

          const uniqueKey = `${card.id}-${index}`;

          return isTopCard ? (
            <GestureDetector key={uniqueKey} gesture={pan}>
              <Animated.View
                style={[
                  styles.stackCard,
                  {
                    backgroundColor: "#ffffff",
                    zIndex: index,
                    transform: [
                      { translateY: stackIndex * 12 },
                      { scale: 1 - stackIndex * 0.05 },
                    ],
                    opacity: 1 - stackIndex * 0.3,
                  },
                  panStyle,
                ]}
              >
                <Animated.View style={[styles.swipeHintRight, rightHintStyle]}>
                  <Text style={styles.swipeHintRightText}>Bildim</Text>
                </Animated.View>
                <Animated.View style={[styles.swipeHintLeft, leftHintStyle]}>
                  <Text style={styles.swipeHintLeftText}>Bilemedim</Text>
                </Animated.View>

                <View style={{ flex: 1 }}>
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFillObject,
                      styles.card,
                      styles.cardFront,
                      frontStyle,
                      { opacity: isFlipped ? 0 : 1 },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.cardContent}
                      onPress={toggleFlip}
                      activeOpacity={1}
                    >
                      <Text style={styles.faceLabel}>Kelime</Text>
                      <Text style={styles.cardTextFront}>{card.word1}</Text>
                      <Text style={styles.flipHint}>Çevirmek için dokun</Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View
                    style={[
                      StyleSheet.absoluteFillObject,
                      styles.card,
                      styles.cardBack,
                      backStyle,
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.cardContent}
                      onPress={toggleFlip}
                      activeOpacity={1}
                    >
                      <Text style={styles.faceLabelBack}>Anlam</Text>
                      <Text style={styles.cardTextBackPrompt}>{card.word1}</Text>
                      <Text style={styles.cardTextBack}>{card.word2}</Text>
                      <Text style={styles.flipHintBack}>
                        Bildiysen sağa, bilemediysen sola kaydır
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </Animated.View>
            </GestureDetector>
          ) : (
            <View
              key={uniqueKey}
              style={[
                styles.stackCard,
                {
                  backgroundColor: "#ffffff",
                  zIndex: index,
                  transform: [
                    { translateY: stackIndex * 12 },
                    { scale: 1 - stackIndex * 0.05 },
                  ],
                  opacity: 1 - stackIndex * 0.3,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f8",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  stackContainer: {
    position: "relative",
    width: width - 48,
    height: height * 0.55,
    alignItems: "center",
    justifyContent: "center",
  },
  stackCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#16151d",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  card: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  cardFront: {
    backgroundColor: "#ffffff",
  },
  cardBack: {
    backgroundColor: "#4f40d8",
  },
  swipeHintLeft: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 20,
    borderWidth: 2,
    borderColor: "#d9492f",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#ffffff",
    transform: [{ rotate: "6deg" }],
  },
  swipeHintLeftText: {
    color: "#d9492f",
    fontWeight: "600",
    fontSize: 14,
  },
  swipeHintRight: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 20,
    borderWidth: 2,
    borderColor: "#13865d",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#ffffff",
    transform: [{ rotate: "-6deg" }],
  },
  swipeHintRightText: {
    color: "#13865d",
    fontWeight: "600",
    fontSize: 14,
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCardsText: {
    fontSize: 20,
    color: "#6f6d7b",
    fontWeight: "600",
  },
  hintSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#6f6d7b",
  },
  cardContent: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  faceLabel: {
    alignSelf: "flex-start",
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: "uppercase",
    color: "#6f6d7b",
    fontFamily: "GeistMono_400Regular",
  },
  faceLabelBack: {
    alignSelf: "flex-start",
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
    fontFamily: "GeistMono_400Regular",
  },
  cardTextFront: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: -1.26,
    lineHeight: 40,
    color: "#16151d",
    fontFamily: "Geist_600SemiBold",
  },
  cardTextBackPrompt: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    fontFamily: "Geist_400Regular",
  },
  cardTextBack: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: "600",
    letterSpacing: -1.26,
    lineHeight: 40,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Geist_600SemiBold",
  },
  flipHint: {
    fontSize: 12,
    color: "#6f6d7b",
    fontFamily: "Geist_400Regular",
  },
  flipHintBack: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    fontFamily: "Geist_400Regular",
  },
});

export default FlipCard;
