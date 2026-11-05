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
import { useLearningStore } from "../../../stores/learningStore";
import type { StudyCard } from "../../../domain/learning/types";

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
};

interface FlipCardProps {
  deckId: string;
  deckTitle: string;
  onProgress?: (progress: FlipSessionProgress) => void;
  onSessionComplete?: (payload: FlipSessionCompletePayload) => void;
}

const FlipCard: React.FC<FlipCardProps> = ({
  deckId,
  deckTitle,
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
    setCorrect(0);
    setWrong(0);
    setFinished(false);
    setIsFlipped(false);
    flipAnimValue.value = 0;
    translateX.value = 0;

    try {
      const { cards } = loadSession({
        deskId: deckId,
        mode: "normal",
        exercise: "flip",
        quizDirection: "w1-w2",
        limit: 50,
        shuffle: true,
        hideMastered: false,
      });
      // Stack top = last index (matches existing Flip UI)
      setStack(cards);
      setTotal(cards.length);
      totalRef.current = cards.length;
      emitProgress(cards.length, 0, 0, cards.length);
    } catch (error) {
      console.error("Load flip session error:", error);
      setStack([]);
      setTotal(0);
      totalRef.current = 0;
      emitProgress(0, 0, 0, 0);
    }
  }, [deckId, emitProgress]);

  const completeSession = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    const durationMs = Math.max(0, Date.now() - startedAtRef.current);
    const summaryCorrect = correctRef.current;
    const summaryWrong = wrongRef.current;
    const summaryTotal = totalRef.current;

    finishSession({
      deskId: deckId,
      exercise: "flip",
      mode: "normal",
      correct: summaryCorrect,
      wrong: summaryWrong,
      total: summaryTotal,
      points: summaryCorrect * 5,
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
    });
  }, [deckId, deckTitle, onSessionComplete]);

  const rateAndRemove = (direction: FlipSwipeDirection) => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      const card = prev[prev.length - 1];
      const learning = useLearningStore.getState();

      if (direction === "right") {
        // Sağ = Doğru / Knew it
        learning.applyCorrect(card.id);
        const nextCorrect = correctRef.current + 1;
        correctRef.current = nextCorrect;
        setCorrect(nextCorrect);
        const remaining = prev.length - 1;
        emitProgress(remaining, nextCorrect, wrongRef.current, totalRef.current);
      } else {
        // Sol = Yanlış / Forgot
        learning.applyWrong(card.id);
        const nextWrong = wrongRef.current + 1;
        wrongRef.current = nextWrong;
        setWrong(nextWrong);
        const remaining = prev.length - 1;
        emitProgress(remaining, correctRef.current, nextWrong, totalRef.current);
      }

      const next = prev.slice(0, -1);
      if (next.length === 0) {
        // Defer so state flush finishes before navigate
        setTimeout(() => completeSession(), 0);
      }
      return next;
    });

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
      <View style={styles.legendRow}>
        <Text style={styles.legendLeft}>← Yanlış / Forgot</Text>
        <Text style={styles.legendRight}>Doğru / Knew it →</Text>
      </View>

      <View style={styles.stackContainer}>
        {stack.map((card, index) => {
          const isTopCard = index === stack.length - 1;
          const stackIndex = stack.length - 1 - index;
          const maxVisibleCards = 4;

          if (stackIndex >= maxVisibleCards) return null;

          const uniqueKey = `${card.id}-${index}`;

          return isTopCard ? (
            <GestureDetector key={uniqueKey} gesture={pan}>
              <Animated.View
                style={[
                  styles.stackCard,
                  {
                    backgroundColor: getCardColor(index),
                    zIndex: index,
                    transform: [
                      { translateY: -stackIndex * 6 },
                      { translateX: stackIndex * 3 },
                      { scale: 1 - stackIndex * 0.03 },
                      { rotate: `${stackIndex * 2}deg` },
                    ],
                  },
                  panStyle,
                ]}
              >
                <Animated.View style={[styles.swipeHintLeft, leftHintStyle]}>
                  <Text style={styles.swipeHintLeftText}>Yanlış</Text>
                  <Text style={styles.swipeHintLeftSub}>Forgot</Text>
                </Animated.View>
                <Animated.View style={[styles.swipeHintRight, rightHintStyle]}>
                  <Text style={styles.swipeHintRightText}>Doğru</Text>
                  <Text style={styles.swipeHintRightSub}>Knew it</Text>
                </Animated.View>

                <View style={{ flex: 1 }}>
                  <Animated.View
                    style={[
                      StyleSheet.absoluteFillObject,
                      styles.card,
                      frontStyle,
                      { opacity: isFlipped ? 0 : 1 },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.cardContent}
                      onPress={toggleFlip}
                    >
                      <Text style={[styles.cardText, { color: "#1E293B" }]}>
                        {card.word1}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>

                  <Animated.View
                    style={[
                      StyleSheet.absoluteFillObject,
                      styles.card,
                      backStyle,
                      { backgroundColor: "#4F46E5" },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.cardContent}
                      onPress={toggleFlip}
                    >
                      <Text style={styles.cardText}>{card.word2}</Text>
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
                  backgroundColor: getCardColor(index),
                  zIndex: index,
                  transform: [
                    { translateY: -stackIndex * 6 },
                    { translateX: stackIndex * 3 },
                    { scale: 1 - stackIndex * 0.03 },
                    { rotate: `${stackIndex * 2}deg` },
                  ],
                },
              ]}
            >
              <View style={styles.cardContent}>
                <Text style={[styles.cardText, { color: "#1E293B" }]}>
                  {card.word1}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  function getCardColor(index: number) {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
    ];
    return colors[index % colors.length];
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  legendRow: {
    width: width * 0.85,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  legendLeft: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "600",
  },
  legendRight: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "600",
  },
  stackContainer: {
    position: "relative",
    width: width * 0.85,
    height: height * 0.55,
    alignItems: "center",
    justifyContent: "center",
  },
  stackCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  card: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  swipeHintLeft: {
    position: "absolute",
    top: 24,
    left: 20,
    zIndex: 20,
    borderWidth: 3,
    borderColor: "#DC2626",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    transform: [{ rotate: "-12deg" }],
  },
  swipeHintLeftText: {
    color: "#DC2626",
    fontWeight: "800",
    fontSize: 16,
  },
  swipeHintLeftSub: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "600",
  },
  swipeHintRight: {
    position: "absolute",
    top: 24,
    right: 20,
    zIndex: 20,
    borderWidth: 3,
    borderColor: "#16A34A",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    transform: [{ rotate: "12deg" }],
  },
  swipeHintRightText: {
    color: "#16A34A",
    fontWeight: "800",
    fontSize: 16,
  },
  swipeHintRightSub: {
    color: "#16A34A",
    fontSize: 11,
    fontWeight: "600",
  },
  noCardsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCardsText: {
    fontSize: 20,
    color: "#8B9CB6",
    fontWeight: "600",
  },
  hintSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#94A3B8",
  },
  cardContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  cardText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 36,
    color: "#ffffff",
  },
});

export default FlipCard;
