import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { fonts, colors } from "../../theme/theme";

type Weight = "regular" | "medium" | "semibold" | "bold" | "mono" | "monoMedium";

type Props = TextProps & {
  weight?: Weight;
  muted?: boolean;
};

const weightMap: Record<Weight, string> = {
  regular: fonts.regular,
  medium: fonts.medium,
  semibold: fonts.semibold,
  bold: fonts.bold,
  mono: fonts.mono,
  monoMedium: fonts.monoMedium,
};

export default function AppText({
  weight = "regular",
  muted,
  style,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        styles.base,
        { fontFamily: weightMap[weight], color: muted ? colors.muted : colors.ink },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: fonts.regular,
    color: colors.ink,
  },
});
