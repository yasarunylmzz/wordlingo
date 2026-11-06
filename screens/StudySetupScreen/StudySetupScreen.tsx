import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  GalleryHorizontalEnd,
  ListChecks,
} from "lucide-react-native";
import { RootStackParamList } from "../RootStackParams";
import type {
  QuizDirection,
  StudyExercise,
  StudyMode,
} from "../../domain/learning/types";
import { useCardStore } from "../../stores/cardStore";
import { useLearningStore } from "../../stores/learningStore";
import { mergeCardWithLearning } from "../../domain/learning/merge";
import { selectSessionCards } from "../../domain/learning/session";
import AppText from "../../Components/ui/AppText";
import Switch from "../../Components/ui/Switch";
import { QUIZ_MIN_CARDS } from "../../domain/learning/quiz";
import { colors, radii, space } from "../../theme/theme";

const EXERCISES: {
  id: StudyExercise;
  title: string;
  hint: string;
  Icon: typeof ListChecks;
}[] = [
  { id: "quiz", title: "Quiz", hint: "Çoktan seçmeli", Icon: ListChecks },
  {
    id: "flip",
    title: "Kart çevir",
    hint: "Sağa doğru, sola yanlış",
    Icon: GalleryHorizontalEnd,
  },
];

const MODES: { id: StudyMode; title: string; hint: string }[] = [
  { id: "today", title: "Bugün", hint: "Vadesi gelen kartlar" },
  { id: "normal", title: "Normal", hint: "Destedeki tüm kartlar" },
  { id: "wrong", title: "Yanlışlar", hint: "Daha önce yanlış bildiklerin" },
  { id: "hard", title: "Zor", hint: "Zor olarak işaretlediklerin" },
  {
    id: "review",
    title: "Karışık tekrar",
    hint: "Desteden karışık bir tur",
  },
];

const StudySetupScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "StudySetup">>();
  const { deckId, deckTitle } = route.params;

  const rawCards = useCardStore((state) => state.getCards(deckId));
  const byCardId = useLearningStore((state) => state.byCardId);

  const studyCards = useMemo(
    () =>
      rawCards.map((c) =>
        mergeCardWithLearning(
          { ...c, deskID: c.deskID || deckId },
          byCardId[c.id],
        ),
      ),
    [rawCards, byCardId, deckId],
  );

  const [exercise, setExercise] = useState<StudyExercise>("quiz");
  const [mode, setMode] = useState<StudyMode>("today");
  const [shuffle, setShuffle] = useState(true);
  const [hideMastered, setHideMastered] = useState(false);
  const [quizDirection, setQuizDirection] =
    useState<QuizDirection>("w1-w2");

  const poolCount = (m: StudyMode) =>
    selectSessionCards(studyCards, {
      deskId: deckId,
      mode: m,
      exercise: "flip",
      quizDirection: "w1-w2",
      limit: 999,
      shuffle: false,
      hideMastered,
    }).length;

  const eligible = poolCount(mode);
  const sample = studyCards[0];
  const dirLabels: Record<QuizDirection, string> = {
    "w1-w2": "Kelime → Anlam",
    "w2-w1": "Anlam → Kelime",
  };

  const start = () => {
    const shared = {
      deckId,
      deckTitle,
      mode,
      shuffle,
      hideMastered,
    };
    if (exercise === "flip") {
      navigation.navigate("FlipCardScreen", shared);
      return;
    }
    navigation.navigate("LearnScreen", {
      ...shared,
      quizDirection,
      autoStart: true,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Geri"
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={20} color={colors.ink} strokeWidth={2} />
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weight="semibold" style={styles.title}>
            Çalışma ayarları
          </AppText>
          <AppText style={styles.subtitle}>
            {deckTitle} · {rawCards.length} kart
          </AppText>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Egzersiz">
          <View style={styles.exerciseGrid}>
            {EXERCISES.map(({ id, title, hint, Icon }) => {
              const active = exercise === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => setExercise(id)}
                  style={[
                    styles.exerciseCard,
                    active && styles.exerciseCardOn,
                  ]}
                >
                  <View
                    style={[
                      styles.exerciseIcon,
                      active && styles.exerciseIconOn,
                    ]}
                  >
                    <Icon
                      size={18}
                      color={active ? colors.white : colors.muted}
                    />
                  </View>
                  <AppText weight="semibold" style={styles.exerciseTitle}>
                    {title}
                  </AppText>
                  <AppText style={styles.exerciseHint}>
                    {id === "quiz" && rawCards.length < QUIZ_MIN_CARDS
                      ? `En az ${QUIZ_MIN_CARDS} kart gerekir`
                      : hint}
                  </AppText>
                  {active && (
                    <View style={styles.check}>
                      <Check size={12} color={colors.white} strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Mod">
          <View style={styles.listCard}>
            {MODES.map((m) => {
              const active = mode === m.id;
              const n = poolCount(m.id);
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setMode(m.id)}
                  style={styles.modeRow}
                >
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <AppText
                      weight="medium"
                      style={[styles.modeTitle, active && { color: colors.accent }]}
                    >
                      {m.title}
                    </AppText>
                    <AppText style={styles.modeHint} numberOfLines={1}>
                      {m.hint}
                    </AppText>
                  </View>
                  <AppText
                    style={[
                      styles.modeCount,
                      n === 0 && { color: "rgba(111,109,123,0.6)" },
                    ]}
                  >
                    {n}
                  </AppText>
                  <View
                    style={[styles.radio, active && styles.radioOn]}
                  >
                    {active && <View style={styles.radioDot} />}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title="Yön">
          <View style={styles.segment}>
            {(["w1-w2", "w2-w1"] as QuizDirection[]).map((d) => {
              const active = quizDirection === d;
              return (
                <Pressable
                  key={d}
                  onPress={() => setQuizDirection(d)}
                  style={[styles.segmentBtn, active && styles.segmentBtnOn]}
                >
                  <AppText
                    weight="medium"
                    style={[
                      styles.segmentText,
                      active && { color: colors.accent },
                    ]}
                  >
                    {dirLabels[d]}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          {sample && (
            <AppText style={styles.sample}>
              Soru:{" "}
              <AppText>
                {quizDirection === "w1-w2" ? sample.word1 : sample.word2}
              </AppText>
              {"  "}· Cevap:{" "}
              <AppText>
                {quizDirection === "w1-w2" ? sample.word2 : sample.word1}
              </AppText>
            </AppText>
          )}
        </Section>

        <Section title="Seçenekler">
          <View style={styles.listCard}>
            <View style={styles.optionRow}>
              <View style={{ flex: 1 }}>
                <AppText weight="medium" style={styles.optionTitle}>
                  Karıştır
                </AppText>
                <AppText style={styles.optionHint}>
                  {mode === "today"
                    ? "Aynı günün içinde karıştırır; eski günler önde kalır"
                    : "Kartları rastgele sırala"}
                </AppText>
              </View>
              <Switch
                label="Karıştır"
                checked={shuffle}
                onChange={setShuffle}
              />
            </View>
            <View style={styles.optionRow}>
              <View style={{ flex: 1 }}>
                <AppText weight="medium" style={styles.optionTitle}>
                  Öğrenilenleri gizle
                </AppText>
                <AppText style={styles.optionHint}>
                  {mode === "today"
                    ? "Bugün kuyruğunda vadesi gelen seviye 3 kalır"
                    : "Seviye 3 kartları atla"}
                </AppText>
              </View>
              <Switch
                label="Öğrenilenleri gizle"
                checked={hideMastered}
                onChange={setHideMastered}
              />
            </View>
          </View>
        </Section>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={eligible === 0}
          onPress={start}
          style={[styles.start, eligible === 0 && styles.startDisabled]}
        >
          <AppText
            weight="semibold"
            style={[
              styles.startText,
              eligible === 0 && { color: colors.muted },
            ]}
          >
            {eligible === 0 ? "Bu modda kart yok" : "Başla"}
            {eligible > 0 && (
              <AppText style={styles.startCount}> {eligible} kart</AppText>
            )}
          </AppText>
          <View
            style={[
              styles.startIcon,
              eligible === 0 && { backgroundColor: "transparent" },
            ]}
          >
            <ArrowRight
              size={18}
              color={eligible === 0 ? colors.muted : colors.white}
              strokeWidth={2.25}
            />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      <View style={{ marginTop: 10 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: space[4],
    paddingVertical: 8,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 17, letterSpacing: -0.255 },
  subtitle: { fontSize: 12, color: colors.muted },
  content: { paddingHorizontal: space[4], paddingBottom: 24, paddingTop: 8 },
  section: { marginTop: 28 },
  sectionTitle: {
    paddingHorizontal: 4,
    fontSize: 13,
    color: colors.muted,
  },
  exerciseGrid: { flexDirection: "row", gap: 10 },
  exerciseCard: {
    flex: 1,
    borderRadius: radii.xl,
    backgroundColor: colors.white,
    padding: space[4],
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  exerciseCardOn: { borderColor: colors.accent },
  exerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseIconOn: { backgroundColor: colors.accent },
  exerciseTitle: {
    marginTop: 16,
    fontSize: 15,
    letterSpacing: -0.15,
  },
  exerciseHint: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  check: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  listCard: {
    borderRadius: radii["2xl"],
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: space[4],
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.line,
  },
  modeTitle: { fontSize: 15 },
  modeHint: { fontSize: 12, color: colors.muted },
  modeCount: {
    fontSize: 13,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(22,21,29,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  segment: {
    flexDirection: "row",
    gap: 4,
    borderRadius: radii.lg,
    backgroundColor: colors.segmentTrack,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    height: 40,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnOn: {
    backgroundColor: colors.white,
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  segmentText: { fontSize: 14, color: colors.muted },
  sample: {
    marginTop: 8,
    paddingHorizontal: 4,
    fontSize: 12,
    color: colors.muted,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: space[4],
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.line,
  },
  optionTitle: { fontSize: 15 },
  optionHint: { fontSize: 12, color: colors.muted },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.line,
    paddingHorizontal: space[4],
    paddingTop: 12,
    paddingBottom: 12,
  },
  start: {
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    paddingLeft: space[5],
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  startDisabled: { backgroundColor: colors.bar },
  startText: { fontSize: 15, color: colors.white },
  startCount: {
    fontSize: 15,
    fontFamily: undefined,
    color: "rgba(255,255,255,0.65)",
  },
  startIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StudySetupScreen;
