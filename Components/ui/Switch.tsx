import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { colors, radii } from "../../theme/theme";

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
};

export default function Switch({ checked, onChange, label }: Props) {
  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(checked ? 20 : 0, { duration: 180 }) },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange(!checked)}
      style={[styles.track, checked ? styles.trackOn : styles.trackOff]}
    >
      <Animated.View style={[styles.knob, knobStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: radii.full,
    padding: 2,
    justifyContent: "center",
  },
  trackOn: { backgroundColor: colors.accent },
  trackOff: { backgroundColor: colors.bar },
  knob: {
    width: 24,
    height: 24,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
