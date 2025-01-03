// FlipCard.js

import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const FlipCard = ({ isFlipped, cardStyle, RegularContent, FlippedContent }) => {
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
    <View style={cardStyle}>
      <Animated.View style={[styles.regularCard, regularCardAnimatedStyle]}>
        {RegularContent}
      </Animated.View>
      <Animated.View style={[styles.flippedCard, flippedCardAnimatedStyle]}>
        {FlippedContent}
      </Animated.View>
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
});
