import React, { useRef } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

/**
 *
 * use zustand for card index and send to flipCardScreen for delete button
 */

const FlipCard = () => {
  const [cardData, setCardData] = React.useState([
    {
      front: "Front 1",
      back: "Back 1",
    },
    {
      front: "Front 2",
      back: "Back 2",
    },
    {
      front: "Front 3",
      back: "Back 3",
    },
  ]);
  const flippedValuesRef = useRef(cardData.map(() => useSharedValue(0)));
  const flippedValues = flippedValuesRef.current;
  const toggleFlip = (index: number) => {
    flippedValues[index].value = flippedValues[index].value === 0 ? 1 : 0;
    console.log(`Card ${index} flipped: ${flippedValues[index].value}`);
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {flippedValues.map((isFlipped, index) => {
        const regularCardAnimatedStyle = useAnimatedStyle(() => {
          const spinValue = interpolate(isFlipped.value, [0, 1], [0, 180]);
          return {
            transform: [
              { rotateY: withTiming(`${spinValue}deg`, { duration: 500 }) },
            ],
          };
        });

        const flippedCardAnimatedStyle = useAnimatedStyle(() => {
          const spinValue = interpolate(isFlipped.value, [0, 1], [180, 360]);
          return {
            transform: [
              { rotateY: withTiming(`${spinValue}deg`, { duration: 500 }) },
            ],
          };
        });

        return (
          <View
            style={[
              {
                zIndex: -index,
                transform: [
                  { rotate: `${-index * 5}deg` },
                  { translateX: 0 },
                  { translateY: 0 },
                ],

                borderRadius: 20,
                position: "absolute",
                width: "65%",
                height: "80%",
                justifyContent: "center",
                alignItems: "center",
                opacity: 1 / (index + 1),
              },
            ]}
            key={index}
          >
            <Animated.View
              style={[styles.regularCard, regularCardAnimatedStyle]}
            >
              <View
                onTouchStart={() => toggleFlip(index)}
                style={styles.frontCard}
              >
                <Text>{cardData[index] ? cardData[index]["front"] : null}</Text>
              </View>
            </Animated.View>
            <Animated.View
              style={[styles.flippedCard, flippedCardAnimatedStyle]}
            >
              <View
                onTouchStart={() => toggleFlip(index)}
                style={styles.backCard}
              >
                <Text>{cardData[index] ? cardData[index]["back"] : null}</Text>
              </View>
            </Animated.View>
          </View>
        );
      })}
    </View>
  );
};

export default FlipCard;

const styles = StyleSheet.create({
  regularCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    zIndex: 1,
  },
  flippedCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    zIndex: 2,
  },
  frontCard: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D8BFD8",
    borderRadius: 10,
  },
  backCard: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#90EE90",
    borderRadius: 10,
  },
});
