import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import { correctTone, wrongTone } from "./SessionHeader";
import { colors, radii, space } from "../../theme/theme";

type Props = {
  correct: number;
  wrong: number;
  correctLabel: string;
  wrongLabel: string;
  onRetryWrong: () => void;
  onRestart: () => void;
  onExit: () => void;
};

export default function SessionSummary({
  correct,
  wrong,
  correctLabel,
  wrongLabel,
  onRetryWrong,
  onRestart,
  onExit,
}: Props) {
  const total = correct + wrong;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const message =
    pct === 100
      ? "Hepsini bildin, harika."
      : pct >= 60
        ? "İyi gidiyorsun, yanlışları bir tur daha dene."
        : "Yanlışları tekrar etmek akılda kalıcılığı artırır.";

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <AppText weight="mono" style={styles.eyebrow}>
          {"Tur tamamlandı".toLocaleUpperCase("tr-TR")}
        </AppText>
        <AppText weight="semibold" style={styles.pct}>
          %{pct}
        </AppText>
        <AppText style={styles.message}>{message}</AppText>

        <View style={styles.barTrack}>
          {correct > 0 && (
            <View style={[styles.barCorrect, { flex: correct }]} />
          )}
          {wrong > 0 && <View style={[styles.barWrong, { flex: wrong }]} />}
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <AppText weight="medium" style={[styles.statLabel, { color: correctTone }]}>
              {correctLabel}
            </AppText>
            <AppText weight="semibold" style={styles.statVal}>
              {correct}
            </AppText>
          </View>
          <View style={styles.statCard}>
            <AppText weight="medium" style={[styles.statLabel, { color: wrongTone }]}>
              {wrongLabel}
            </AppText>
            <AppText weight="semibold" style={styles.statVal}>
              {wrong}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.primary,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          onPress={wrong > 0 ? onRetryWrong : onRestart}
        >
          <AppText weight="semibold" style={styles.primaryText}>
            {wrong > 0
              ? `Yanlışları tekrar et (${wrong})`
              : "Tekrar çalış"}
          </AppText>
        </Pressable>
        <Pressable onPress={onExit} style={styles.secondary}>
          <AppText weight="semibold" style={styles.secondaryText}>
            Desteye dön
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: space[4],
    paddingBottom: space[9],
  },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.54,
    color: colors.muted,
  },
  pct: {
    marginTop: 12,
    fontSize: 64,
    lineHeight: 64,
    letterSpacing: -3.2,
    fontVariant: ["tabular-nums"],
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    color: colors.muted,
  },
  barTrack: {
    marginTop: 32,
    height: 8,
    borderRadius: radii.full,
    overflow: "hidden",
    flexDirection: "row",
    gap: 3,
  },
  barCorrect: { backgroundColor: colors.correct },
  barWrong: { backgroundColor: colors.wrong },
  stats: {
    marginTop: space[4],
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    padding: space[4],
  },
  statLabel: { fontSize: 12 },
  statVal: {
    marginTop: 4,
    fontSize: 24,
    letterSpacing: -0.48,
    fontVariant: ["tabular-nums"],
  },
  actions: { gap: 10 },
  primary: {
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontSize: 15, color: colors.white },
  secondary: {
    height: 48,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontSize: 15, color: colors.ink },
});
