import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, ChevronLeft, Flame } from "lucide-react-native";
import {
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParams";
import { usePrefsStore } from "../../stores/prefsStore";
import AppText from "../../Components/ui/AppText";
import PrimaryButton from "../../Components/ui/PrimaryButton";
import { colors, radii, space } from "../../theme/theme";

type Step = {
  label: string;
  title: string;
  body: string;
  stage: "word" | "quiz" | "habit";
};

const steps: Step[] = [
  {
    label: "Günlük kelimeler",
    title: "Her gün birkaç yeni kelime.",
    body: "Kısa günlük setlerle öğrenmek hafif kalır. Ezber yok, baskı yok.",
    stage: "word",
  },
  {
    label: "Quiz",
    title: "Kısa quizlerle pekiştir.",
    body: "Doğru anlamı seç, her cevapta anında geri bildirim al.",
    stage: "quiz",
  },
  {
    label: "Alışkanlık",
    title: "Kalıcı bir alışkanlık kur.",
    body: "Serini takip et, kelime hazinenin her gün biraz daha büyüdüğünü gör.",
    stage: "habit",
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const setOnboardingSeen = usePrefsStore((s) => s.setOnboardingSeen);
  const [step, setStep] = useState(0);
  const startX = useRef<number | null>(null);
  const last = step === steps.length - 1;
  const current = steps[step];

  const finish = () => {
    setOnboardingSeen(true);
    navigation.replace("Welcome");
  };

  const next = () => (last ? finish() : setStep((s) => s + 1));
  const prev = () => step > 0 && setStep((s) => s - 1);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.progressRow}>
        <View style={styles.bars}>
          {steps.map((_, i) => (
            <Pressable
              key={i}
              accessibilityLabel={`Adım ${i + 1}`}
              onPress={() => setStep(i)}
              style={styles.barTrack}
            >
              <View
                style={[
                  styles.barFill,
                  { width: i <= step ? "100%" : "0%" },
                ]}
              />
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={finish}
          style={{ opacity: last ? 0 : 1 }}
          disabled={last}
        >
          <AppText weight="medium" style={styles.skip}>
            Atla
          </AppText>
        </Pressable>
      </View>

      <View
        style={styles.main}
        onStartShouldSetResponder={() => true}
        onResponderGrant={(e) => {
          startX.current = e.nativeEvent.pageX;
        }}
        onResponderRelease={(e) => {
          if (startX.current === null) return;
          const dx = e.nativeEvent.pageX - startX.current;
          startX.current = null;
          if (dx < -60) next();
          else if (dx > 60) prev();
        }}
      >
        <View style={styles.stage}>
          <View style={styles.blob} />
          {current.stage === "word" && <WordStage />}
          {current.stage === "quiz" && <QuizStage />}
          {current.stage === "habit" && <HabitStage />}
        </View>

        <View style={styles.copy}>
          <AppText weight="mono" style={styles.stepLabel}>
            {`${String(step + 1).padStart(2, "0")} · ${current.label}`.toLocaleUpperCase(
              "tr-TR",
            )}
          </AppText>
          <AppText weight="semibold" style={styles.title}>
            {current.title}
          </AppText>
          <AppText style={styles.body}>{current.body}</AppText>
        </View>
      </View>

      <View style={styles.footer}>
        {step > 0 && (
          <Pressable
            accessibilityLabel="Geri"
            onPress={prev}
            style={styles.prev}
          >
            <ChevronLeft size={20} color={colors.ink} />
          </Pressable>
        )}
        <PrimaryButton
          label={last ? "Başlayalım" : "Devam"}
          onPress={next}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

function WordStage() {
  return (
    // Outer box is larger than the card so the 7° plate + badge can peek
    // without being clipped by the stage (matches prototype stacking).
    <View style={styles.wordScene}>
      <View style={styles.wordWrap}>
        {/* Accent plate behind — rotate 7° like prototype */}
        <View style={styles.wordPlate} />
        {/* Front card: explicit size (not absoluteFill) so flex center lays out */}
        <View style={styles.wordCard}>
          <AppText weight="mono" style={styles.cardMono}>
            {"Günün kelimesi".toLocaleUpperCase("tr-TR")}
          </AppText>
          <View style={styles.wordCenter}>
            <AppText weight="semibold" style={styles.wordBig}>
              Güneş
            </AppText>
            <AppText weight="mono" style={styles.wordAccent}>
              sun
            </AppText>
          </View>
          <View style={styles.wordExampleBlock}>
            <AppText style={styles.wordExample}>
              Bugün güneş çok parlak.
            </AppText>
            <AppText style={styles.wordExampleEn}>
              The sun is very bright today.
            </AppText>
          </View>
        </View>
        <View style={styles.wordBadge}>
          <AppText weight="semibold" style={styles.wordBadgeText}>
            +5 kelime bugün
          </AppText>
        </View>
      </View>
    </View>
  );
}

function QuizStage() {
  const options = [
    { label: "Pencere", correct: false },
    { label: "Kitap", correct: true },
    { label: "Masa", correct: false },
  ];
  return (
    <View style={styles.quizCard}>
      <AppText weight="mono" style={styles.cardMono}>
        {"Quiz".toLocaleUpperCase("tr-TR")}
      </AppText>
      <AppText weight="semibold" style={styles.quizQ}>
        “Book” ne demek?
      </AppText>
      <View style={{ marginTop: 16, gap: 8 }}>
        {options.map((o, i) => (
          <View
            key={o.label}
            style={[
              styles.quizOpt,
              o.correct ? styles.quizOptOk : styles.quizOptDim,
            ]}
          >
            <View
              style={[
                styles.quizBadge,
                o.correct ? styles.quizBadgeOk : styles.quizBadgeDim,
              ]}
            >
              {o.correct ? (
                <Check size={12} color={colors.white} strokeWidth={3} />
              ) : (
                <AppText weight="mono" style={{ fontSize: 11, color: colors.muted }}>
                  {"ABC"[i]}
                </AppText>
              )}
            </View>
            <AppText weight="medium" style={{ fontSize: 14 }}>
              {o.label}
            </AppText>
          </View>
        ))}
      </View>
      <AppText weight="semibold" style={styles.quizFeedback}>
        Doğru, devam et.
      </AppText>
    </View>
  );
}

function HabitStage() {
  const days = ["P", "S", "Ç", "P", "C", "C", "P"];
  const done = 5;
  return (
    <View style={styles.habitCard}>
      <View style={styles.habitTop}>
        <View>
          <AppText weight="semibold" style={styles.habitNum}>
            {done}
          </AppText>
          <AppText style={{ marginTop: 6, fontSize: 13, color: colors.muted }}>
            günlük seri
          </AppText>
        </View>
        <View style={styles.flame}>
          <Flame size={19} color="#f5a524" fill="#f5a524" strokeWidth={0} />
        </View>
      </View>
      <View style={styles.habitDays}>
        {days.map((d, i) => {
          const isDone = i < done;
          const today = i === done;
          return (
            <View key={i} style={styles.habitDay}>
              <View
                style={[
                  styles.habitDot,
                  isDone && styles.habitDotOn,
                  today && styles.habitDotToday,
                ]}
              >
                {isDone && <Check size={13} color={colors.white} strokeWidth={3} />}
              </View>
              <AppText
                weight={today ? "semibold" : "regular"}
                style={{
                  fontSize: 10,
                  color: today ? colors.accent : colors.muted,
                }}
              >
                {d}
              </AppText>
            </View>
          );
        })}
      </View>
      <View style={styles.habitProgress}>
        <View style={styles.habitProgressRow}>
          <AppText style={{ fontSize: 12, color: colors.muted }}>
            Öğrenilen kelime
          </AppText>
          <AppText weight="semibold" style={{ fontSize: 12 }}>
            42
            <AppText style={{ color: colors.muted }}>/60</AppText>
          </AppText>
        </View>
        <View style={styles.habitBar}>
          <View style={[styles.habitBarFill, { width: "70%" }]} />
        </View>
      </View>
    </View>
  );
}

export default OnboardingScreen;

const cardShadow = {
  // Prototype: 0 1px 2px soft + 0 20px 40px -20px purple
  shadowColor: "rgba(46,34,160,0.35)",
  shadowOpacity: 1,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 10 },
  elevation: 8,
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  progressRow: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: space[5],
  },
  bars: { flex: 1, flexDirection: "row", gap: 6 },
  barTrack: {
    flex: 1,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.bar,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: radii.full,
    backgroundColor: colors.accent,
  },
  skip: { fontSize: 14, color: colors.muted },
  main: { flex: 1, minHeight: 0 },
  stage: {
    marginHorizontal: space[4],
    marginTop: 8,
    flex: 1,
    maxHeight: 520,
    borderRadius: 32,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    right: -96,
    top: -96,
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  copy: { paddingHorizontal: space[6], paddingTop: 28 },
  stepLabel: {
    fontSize: 11,
    letterSpacing: 1.54,
    color: colors.accent,
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -0.98,
  },
  body: {
    marginTop: 10,
    maxWidth: 310,
    fontSize: 15,
    lineHeight: 22.5,
    color: colors.muted,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: space[5],
    paddingBottom: space[9],
    paddingTop: 28,
  },
  prev: {
    width: 52,
    height: 52,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  /** Padding around the 220×250 card so plate rotation + badge aren’t clipped. */
  wordScene: {
    width: 260,
    height: 290,
    alignItems: "center",
    justifyContent: "center",
  },
  wordWrap: {
    width: 220,
    height: 250,
  },
  wordPlate: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 220,
    height: 250,
    borderRadius: 26,
    backgroundColor: colors.accent,
    transform: [{ rotate: "7deg" }],
    zIndex: 0,
  },
  wordCard: {
    width: 220,
    height: 250,
    borderRadius: 26,
    backgroundColor: colors.white,
    padding: 20,
    zIndex: 1,
    ...cardShadow,
  },
  cardMono: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.muted,
  },
  wordCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wordBig: {
    fontSize: 34,
    letterSpacing: -1.19,
    lineHeight: 34,
    color: colors.ink,
    textAlign: "center",
  },
  wordAccent: {
    marginTop: 8,
    fontSize: 13,
    color: colors.accent,
    textAlign: "center",
  },
  wordExampleBlock: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.line,
    paddingTop: 12,
  },
  wordExample: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
  },
  wordExampleEn: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 17,
    color: "rgba(22,21,29,0.7)",
  },
  wordBadge: {
    position: "absolute",
    right: -20,
    top: -12,
    zIndex: 2,
    borderRadius: radii.full,
    backgroundColor: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  wordBadgeText: { fontSize: 12, color: colors.white },
  quizCard: {
    width: 262,
    borderRadius: 26,
    backgroundColor: colors.white,
    padding: space[4],
    ...cardShadow,
  },
  quizQ: {
    marginTop: 8,
    fontSize: 20,
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  quizOpt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  quizOptOk: {
    borderColor: colors.correct,
    backgroundColor: colors.correctBg,
  },
  quizOptDim: {
    borderColor: "transparent",
    backgroundColor: colors.paper,
    opacity: 0.6,
  },
  quizBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quizBadgeOk: { backgroundColor: colors.correct },
  quizBadgeDim: { backgroundColor: colors.white },
  quizFeedback: {
    marginTop: 14,
    fontSize: 12,
    color: colors.correct,
  },
  habitCard: {
    width: 262,
    borderRadius: 26,
    backgroundColor: colors.white,
    padding: space[5],
    ...cardShadow,
  },
  habitTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  habitNum: {
    fontSize: 52,
    lineHeight: 52,
    letterSpacing: -2.6,
  },
  flame: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff3e0",
    alignItems: "center",
    justifyContent: "center",
  },
  habitDays: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  habitDay: { alignItems: "center", gap: 6 },
  habitDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  habitDotOn: { backgroundColor: colors.accent },
  habitDotToday: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.accent,
  },
  habitProgress: {
    marginTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.line,
    paddingTop: 16,
  },
  habitProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  habitBar: {
    marginTop: 8,
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.bar,
    overflow: "hidden",
  },
  habitBarFill: {
    height: "100%",
    borderRadius: radii.full,
    backgroundColor: colors.accent,
  },
});
