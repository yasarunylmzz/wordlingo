import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import AppText from "./AppText";
import { colors, radii, space } from "../../theme/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Prototype primary CTA: h52, radius 16, left label, right 36×36 arrow chip. */
export default function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  trailing,
  style,
}: Props) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && { transform: [{ scale: 0.98 }] },
        style,
      ]}
    >
      <AppText
        weight="semibold"
        style={[styles.label, (disabled || loading) && styles.labelDisabled]}
      >
        {label}
      </AppText>
      <View
        style={[
          styles.chip,
          (disabled || loading) && { backgroundColor: "transparent" },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          trailing ?? (
            <ArrowRight
              size={18}
              color={disabled ? colors.muted : colors.white}
              strokeWidth={2.25}
            />
          )
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    paddingLeft: space[5],
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  disabled: {
    backgroundColor: colors.bar,
  },
  label: {
    fontSize: 15,
    color: colors.white,
  },
  labelDisabled: {
    color: colors.muted,
  },
  chip: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});
