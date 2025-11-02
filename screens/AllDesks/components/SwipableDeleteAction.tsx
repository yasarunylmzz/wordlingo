import React from "react";
import {
  Animated,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const SWIPE_WIDTH = width * 0.25;

interface SwipeableDeleteActionProps {
  progress: Animated.AnimatedInterpolation<number>;
  dragX: Animated.AnimatedInterpolation<number>;
  onDelete: () => void;
  isDeleting?: boolean;
}

const SwipeableDeleteAction: React.FC<SwipeableDeleteActionProps> = ({
  progress,
  dragX,
  onDelete,
  isDeleting = false,
}) => {
  const trans = dragX.interpolate({
    inputRange: [-SWIPE_WIDTH, 0],
    outputRange: [0, SWIPE_WIDTH],
    extrapolate: "clamp",
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <Animated.View
      style={[
        styles.deleteAction,
        {
          transform: [{ translateX: trans }],
          opacity,
        },
      ]}
    >
      <RectButton
        style={styles.deleteButton}
        onPress={onDelete}
        enabled={!isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="trash-outline" size={22} color="#fff" />
        )}
      </RectButton>
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
