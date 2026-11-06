import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { X } from "lucide-react-native";
import AppText from "./AppText";
import { colors, fonts, radii, space } from "../../theme/theme";

export const correctTone = colors.correct;
export const wrongTone = colors.wrong;

type Props = {
  deckName: string;
  correct: number;
  wrong: number;
  position: number;
  total: number;
  progress: number;
  onExit: () => void;
};

export default function SessionHeader({
  deckName,
  correct,
  wrong,
  position,
  total,
  progress,
  onExit,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel="Oturumu bitir"
          onPress={onExit}
          style={({ pressed }) => [
            styles.closeBtn,
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <X size={18} color={colors.ink} strokeWidth={2} />
        </Pressable>
        <View style={styles.content}>
          <AppText weight="semibold" style={styles.title} numberOfLines={1}>
            {deckName}
          </AppText>
          <AppText style={styles.subtitle}>
            <AppText style={styles.correct}>{correct} doğru</AppText>
            {" · "}
            <AppText style={styles.wrong}>{wrong} yanlış</AppText>
          </AppText>
        </View>
        <AppText weight="mono" style={styles.counter}>
          {Math.min(position, total)}/{total}
        </AppText>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(100, Math.max(0, progress) * 100)}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: space[4],
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    letterSpacing: -0.255,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  correct: {
    fontSize: 12,
    color: colors.correct,
    fontFamily: fonts.regular,
  },
  wrong: {
    fontSize: 12,
    color: colors.wrong,
    fontFamily: fonts.regular,
  },
  counter: {
    fontSize: 13,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  progressTrack: {
    marginTop: 12,
    height: 4,
    backgroundColor: "rgba(222,219,238,0.7)",
    borderRadius: radii.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: radii.full,
  },
});
