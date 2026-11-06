import React, { ReactNode } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import AppText from "../AppText";
import { colors, fonts, radii, space } from "../../../theme/theme";

type Props = TextInputProps & {
  label: string;
  error?: string;
  prefix?: string;
  trailing?: ReactNode;
};

export default function TextField({
  label,
  error,
  prefix,
  trailing,
  style,
  ...props
}: Props) {
  return (
    <View style={styles.wrap}>
      <AppText weight="medium" style={styles.label}>
        {label}
      </AppText>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        {prefix ? (
          <AppText style={styles.prefix}>{prefix}</AppText>
        ) : null}
        <TextInput
          placeholderTextColor="rgba(111,109,123,0.6)"
          {...props}
          style={[styles.input, style]}
        />
        {trailing}
      </View>
      {error ? (
        <AppText style={styles.error}>{error}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  label: {
    fontSize: 13,
    color: colors.inkSoft,
  },
  field: {
    marginTop: 6,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: space[3.5],
  },
  fieldError: {
    borderColor: colors.wrong,
  },
  prefix: {
    marginRight: 2,
    fontSize: 15,
    color: colors.muted,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.ink,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    color: colors.wrong,
  },
});
