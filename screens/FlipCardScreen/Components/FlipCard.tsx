import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const FlipCard = ({ RegularContent, FlippedContent }) => {
  const flippedValues = useMemo(() => {
    return Array(4)
      .fill(0)
      .map(() => useSharedValue(0));
  }, []);

  const toggleFlip = (index) => {
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
                transform: [{ rotate: `${-index * 5}deg` }],

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
                {RegularContent}
              </View>
            </Animated.View>
            <Animated.View
              style={[styles.flippedCard, flippedCardAnimatedStyle]}
            >
              <View
                onTouchStart={() => toggleFlip(index)}
                style={styles.backCard}
              >
                {FlippedContent}
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
