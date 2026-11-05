import React from "react";
import {
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { SharedValue } from "react-native-reanimated";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SWIPE_WIDTH = width * 0.25;

interface SwipeableDeleteActionProps {
  progress: SharedValue<number>;
  dragX: SharedValue<number>;
  onDelete: () => void;
  isDeleting?: boolean;
}

/** Right-action panel for RNGH 3 ReanimatedSwipeable (SharedValue progress/drag). */
const SwipeableDeleteAction: React.FC<SwipeableDeleteActionProps> = ({
  progress,
  dragX,
  onDelete,
  isDeleting = false,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const t = Math.min(Math.max(-dragX.value, 0), SWIPE_WIDTH);
    return {
      transform: [{ translateX: SWIPE_WIDTH - t }],
      opacity: Math.min(Math.max(progress.value, 0), 1),
    };
  });

  return (
    <Animated.View style={[styles.deleteAction, animatedStyle]}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        disabled={isDeleting}
        accessibilityRole="button"
        accessibilityLabel="Delete deck"
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="trash-outline" size={22} color="#fff" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  deleteAction: {
    width: SWIPE_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    marginVertical: 6,
    marginRight: 16,
    borderRadius: 16,
  },
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});

export default SwipeableDeleteAction;
