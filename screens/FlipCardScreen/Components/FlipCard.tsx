import React, { useState, useEffect } from "react";
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
import { useCardStore } from "../../../stores/cardStore";

const { width, height } = Dimensions.get("window");

interface CardData {
  front: string;
  back: string;
}

interface FlipCardProps {
  deckId: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ deckId }) => {
  const { getCards } = useCardStore();

  const [cardData, setCardData] = useState<CardData[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGestureActive, setIsGestureActive] = useState(false);

  const translateX = useSharedValue(0);
  const flipAnimValue = useSharedValue(0);

  const SWIPE_THRESHOLD = 120;

  useEffect(() => {
    try {
      const freshCards = getCards(deckId);
      if (freshCards.length > 0) {
        const newCardData = freshCards.map((card) => ({
          front: card.word1 || "Front",
          back: card.word2 || "Back",
        }));
        setCardData([...newCardData]);
      } else {
        setCardData([]);
      }
    } catch (error) {
      console.error("Load cards error:", error);
      setCardData([]);
    }
  }, [deckId]);

  const removeCard = (direction: "left" | "right") => {
    const action =
      direction === "left" ? "I learned" : "I need to repeat myself";

    setCardData((prev) => {
      if (prev.length === 0) return prev;
      const cardToRemove = prev[prev.length - 1];
      console.log(action, "Removed card:", cardToRemove);
      return prev.slice(0, -1);
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
    .onEnd((event) => {
      "worklet";
      const currentTranslateX = translateX.value;

      if (Math.abs(currentTranslateX) > SWIPE_THRESHOLD) {
        const direction = currentTranslateX > 0 ? "right" : "left";
        const targetX = direction === "right" ? width : -width;

        translateX.value = withTiming(
          targetX,
          { duration: 300 },
          (finished) => {
            if (finished) {
              runOnJS(removeCard)(direction);
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

  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimValue.value, [0, 1], [0, 180]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimValue.value, [0, 1], [180, 360]);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  if (cardData.length === 0) {
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
        {cardData.map((card, index) => {
          const isTopCard = index === cardData.length - 1;
          const stackIndex = cardData.length - 1 - index;
          const maxVisibleCards = 4;

          if (stackIndex >= maxVisibleCards) return null;

          const uniqueKey = `${card.front}-${card.back}-${index}`;

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
                        {card.front}
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
                      <Text style={styles.cardText}>{card.back}</Text>
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
                  {card.front}
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
