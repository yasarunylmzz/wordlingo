import React, { useMemo } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowUpRight, Flame } from "lucide-react-native";
import { RootStackParamList } from "../../RootStackParams";
import { useLearningStore } from "../../../stores/learningStore";
import { useCardStore } from "../../../stores/cardStore";
import { usePrefsStore } from "../../../stores/prefsStore";
import { streakFromDates } from "../../../domain/learning/stats";
import AppText from "../../../Components/ui/AppText";
import { colors, fonts, radii, space } from "../../../theme/theme";

const StudyProgressCard = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const studyDates = useLearningStore((state) => state.studyDates);
  const studyMinutes = useLearningStore((state) => state.studyMinutes);
  const sessions = useLearningStore((state) => state.sessionLedger.length);
  const byCardId = useLearningStore((state) => state.byCardId);
  const cards = useCardStore((state) => state.cards);
  const goalMinutes = usePrefsStore((s) => s.goalMinutes);

  const streak = streakFromDates(studyDates);
  const minutes = Math.round(studyMinutes);
  const progress = Math.min(minutes / Math.max(goalMinutes, 1), 1);
  const remaining = Math.max(goalMinutes - minutes, 0);

  const queues = useMemo(() => {
    const all = Object.values(cards).flat();
    const now = Date.now();
    let ladder = 0;
    let wrong = 0;
    let today = 0;
    for (const card of all) {
      const s = byCardId[card.id];
      const level = s?.learningLevel ?? 0;
      const wrongCount = s?.wrongCount ?? 0;
      if (level < 3) ladder += 1;
      if (wrongCount > 0 && level < 3) wrong += 1;
      // Missing dueAt is due now, same as the learning-store migration.
      if (typeof s?.dueAt !== "number" || s.dueAt <= now) today += 1;
    }
    return [
      { label: "Bugün", count: today },
      { label: "Yanlışlar", count: wrong },
      { label: "Seviye merdiveni", count: ladder },
    ];
  }, [cards, byCardId]);

  return (
    <View style={styles.card}>
      <View style={styles.orb} />
      <View style={styles.relative}>
        <View style={styles.topRow}>
          <AppText weight="mono" style={styles.eyebrow}>
            Öğrenme
          </AppText>
          <View style={styles.streakPill}>
            <Flame size={13} color={colors.flame} fill={colors.flame} strokeWidth={0} />
            <AppText weight="medium" style={styles.streakText}>
              {streak} gün seri
            </AppText>
          </View>
        </View>

        <AppText weight="semibold" style={styles.title}>
          Bugün çalıştın.{"\n"}
          <AppText weight="semibold" style={styles.titleMuted}>
            Hedefe {remaining} dk kaldı.
          </AppText>
        </AppText>

        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(progress * 100, 2)}%` },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <AppText weight="mono" style={styles.progressLabel}>
              {minutes} dk
            </AppText>
            <AppText weight="mono" style={styles.progressLabel}>
              {goalMinutes} dk
            </AppText>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { k: "Seri", v: `${streak}`, u: "gün" },
            { k: "Süre", v: `${minutes}`, u: "dk" },
            { k: "Oturum", v: `${sessions}`, u: "" },
          ].map((s, i) => (
            <View
              key={s.k}
              style={[styles.stat, i > 0 && styles.statBorder]}
            >
              <AppText style={styles.statKey}>{s.k}</AppText>
              <AppText weight="semibold" style={styles.statVal}>
                {s.v}
                {s.u ? (
                  <AppText style={styles.statUnit}> {s.u}</AppText>
                ) : null}
              </AppText>
            </View>
          ))}
        </View>

        <View style={styles.queueList}>
          {queues.map((q) => (
            <View key={q.label} style={styles.queueRow}>
              <AppText style={styles.queueLabel}>{q.label}</AppText>
              <AppText weight="mono" style={styles.queueCount}>
                {q.count}
              </AppText>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => navigation.navigate("AllDecks")}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        >
          <AppText weight="semibold" style={styles.ctaText}>
            Destelere git
          </AppText>
          <View style={styles.ctaIcon}>
            <ArrowUpRight size={18} color={colors.white} strokeWidth={2.25} />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default StudyProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accent,
    borderRadius: radii["3xl"],
    padding: space[5],
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    right: -64,
    top: -80,
    width: 224,
    height: 224,
    borderRadius: 112,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  relative: { position: "relative" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
  },
  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radii.full,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingVertical: 4,
    paddingLeft: 8,
    paddingRight: 10,
  },
  streakText: {
    fontSize: 12,
    color: colors.white,
  },
  title: {
    marginTop: 24,
    fontSize: 28,
    lineHeight: 29.4,
    letterSpacing: -0.84,
    color: colors.white,
  },
  titleMuted: {
    fontSize: 28,
    lineHeight: 29.4,
    letterSpacing: -0.84,
    color: "rgba(255,255,255,0.55)",
  },
  progressWrap: { marginTop: space[5] },
  progressTrack: {
    height: 4,
    borderRadius: radii.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.full,
    backgroundColor: colors.white,
  },
  progressLabels: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    fontVariant: ["tabular-nums"],
  },
  statsRow: {
    marginTop: space[5],
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: "rgba(255,255,255,0.15)",
    paddingTop: space[4],
  },
  stat: { flex: 1 },
  statBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth * 2,
    borderLeftColor: "rgba(255,255,255,0.15)",
    paddingLeft: space[4],
  },
  statKey: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  statVal: {
    marginTop: 2,
    fontSize: 22,
    letterSpacing: -0.44,
    color: colors.white,
    fontVariant: ["tabular-nums"],
  },
  statUnit: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: "rgba(255,255,255,0.6)",
  },
  queueList: {
    marginTop: space[5],
    borderRadius: radii.lg,
    overflow: "hidden",
  },
  queueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 1,
  },
  queueLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  queueCount: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    fontVariant: ["tabular-nums"],
  },
  cta: {
    marginTop: space[4],
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    paddingLeft: space[5],
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ctaPressed: { transform: [{ scale: 0.98 }] },
  ctaText: {
    fontSize: 15,
    color: colors.accentDeep,
  },
  ctaIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
