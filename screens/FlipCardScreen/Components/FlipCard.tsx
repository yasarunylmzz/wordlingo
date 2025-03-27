import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// Kart verilerinin türünü tanımlama
interface CardData {
  front: string;
  back: string;
}

const FlipCard: React.FC = () => {
  // Varsayılan kart verileri
  const [cardData, setCardData] = useState<CardData[]>([
    { front: "Ön Yüz 1", back: "Arka Yüz 1" },
    { front: "Ön Yüz 2", back: "Arka Yüz 2" },
    { front: "Ön Yüz 3", back: "Arka Yüz 3" },
  ]);

  // Kartların çevrilme durumlarını yönetmek için state
  const [flippedStates, setFlippedStates] = useState<boolean[]>(
    new Array(cardData.length).fill(false)
  );

  // Her kart için animasyon değeri
  const animationValues = cardData.map(() => useSharedValue(0));

  // Kartı çevirme fonksiyonu
  const toggleFlip = (index: number) => {
    // Çevirme durumunu tersine çevir
    const newFlippedStates = [...flippedStates];
    newFlippedStates[index] = !newFlippedStates[index];
    setFlippedStates(newFlippedStates);

    // Animasyon değerini güncelle
    animationValues[index].value = newFlippedStates[index] ? 1 : 0;
  };

  return (
    <View style={styles.container}>
      {cardData.map((card, index) => {
        const translateX = useSharedValue(0);
        const pan = Gesture.Pan()
          .onUpdate((event) => {
            translateX.value = event.translationX;
          })
          .onEnd(() => {
            if (translateX.value > 100) {
              console.log("Right Swipe", translateX.value, card.back);
            } else if (translateX.value < -100) {
              console.log("Left Swipe", translateX.value, card.front);
            }
          });

        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              { translateX: translateX.value },
              { rotate: `${translateX.value / 10}deg` },
              { scale: 1 + Math.abs(translateX.value / 1000) },
            ],
          };
        });
        // Kartın ön yüz animasyon stili
        const regularCardAnimatedStyle = useAnimatedStyle(() => {
          const spinValue = interpolate(
            animationValues[index].value,
            [0, 1],
            [0, 180]
          );
          return {
            transform: [
              { rotateY: withTiming(`${spinValue}deg`, { duration: 500 }) },
            ],
          };
        });

        // Kartın arka yüz animasyon stili
        const flippedCardAnimatedStyle = useAnimatedStyle(() => {
          const spinValue = interpolate(
            animationValues[index].value,
            [0, 1],
            [180, 360]
          );
          return {
            transform: [
              { rotateY: withTiming(`${spinValue}deg`, { duration: 500 }) },
            ],
          };
        });

        return (
          <View
            key={index}
            style={[
              styles.cardWrapper,
              {
                zIndex: -index,
                transform: [
                  { rotate: `${-index * 5}deg` },
                  { translateX: 0 },
                  { translateY: 0 },
                ],
                opacity: 1 / (index + 1),
              },
            ]}
          >
            <GestureDetector key={index} gesture={pan}>
              <Animated.View
                style={[
                  styles.card,
                  styles.frontCard,
                  regularCardAnimatedStyle,
                  animatedStyle,
                  { backfaceVisibility: "hidden" },
                ]}
              >
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => toggleFlip(index)}
                >
                  <Text>{card.front}</Text>
                </TouchableOpacity>
              </Animated.View>
            </GestureDetector>
            {/* Kartın ön yüzü */}

            {/* Kartın arka yüzü */}
            <GestureDetector key={index} gesture={pan}>
              <Animated.View
                style={[
                  styles.card,
                  styles.backCard,
                  flippedCardAnimatedStyle,
                  animatedStyle,
                  { backfaceVisibility: "hidden" },
                ]}
              >
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => toggleFlip(index)}
                >
                  <Text>{card.back}</Text>
                </TouchableOpacity>
              </Animated.View>
            </GestureDetector>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  cardWrapper: {
    borderRadius: 20,
    position: "absolute",
    width: "65%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  cardContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  frontCard: {
    backgroundColor: "#D8BFD8",
    borderRadius: 10,
  },
  backCard: {
    backgroundColor: "#90EE90",
    borderRadius: 10,
  },
});

export default FlipCard;
