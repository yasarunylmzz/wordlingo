import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import AppText from "./AppText";
import { colors, fonts, radii, space } from "../../theme/theme";

type Props = TextInputProps & {
  label: string;
};

export default function Field({ label, style, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <AppText weight="medium" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        placeholderTextColor="rgba(111,109,123,0.6)"
        {...props}
        style={[styles.input, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  label: {
    fontSize: 12,
    color: colors.muted,
  },
  input: {
    marginTop: 6,
    height: 44,
    width: "100%",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    paddingHorizontal: space[3.5],
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.ink,
  },
});
