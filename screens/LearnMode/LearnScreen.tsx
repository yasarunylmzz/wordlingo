import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Check,
  ChevronLeft,
  GalleryHorizontalEnd,
  Plus,
  X,
} from "lucide-react-native";
import { RootStackParamList } from "../RootStackParams";
import {
  QUIZ_MIN_CARDS,
  buildQuizQuestions,
  uniqueAnswers,
  type QuizQuestion,
} from "../../domain/learning/quiz";
import type { QuizDirection, StudyMode } from "../../domain/learning/types";
import {
  finishSession,
  loadSession,
} from "../../services/studySessionService";
import { useLearningStore } from "../../stores/learningStore";
import { useCardStore } from "../../stores/cardStore";
import SessionHeader from "../../Components/ui/SessionHeader";
import SessionSummary from "../../Components/ui/SessionSummary";
import AppText from "../../Components/ui/AppText";
import PrimaryButton from "../../Components/ui/PrimaryButton";
import { colors, radii, space } from "../../theme/theme";

const LETTERS = ["A", "B", "C", "D"];
const norm = (s: string) => s.trim().toLocaleLowerCase("tr-TR");

type Phase = "loading" | "not-enough" | "quiz" | "empty-mode";

const LearnScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "LearnScreen">>();
  const {
    deckId,
    deckTitle,
    mode: routeMode = "normal",
    shuffle: routeShuffle = true,
    hideMastered: routeHideMastered = false,
    quizDirection: routeDirection = "w1-w2",
    autoStart = false,
  } = route.params;

  const mode = routeMode as StudyMode;
  const direction = routeDirection as QuizDirection;
  const shuffle = routeShuffle;
  const hideMastered = routeHideMastered;

  const rawCards = useCardStore((s) => s.getCards(deckId));
  const [phase, setPhase] = useState<Phase>(autoStart ? "loading" : "loading");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [done, setDone] = useState(false);
  const [optionCount, setOptionCount] = useState(0);

  const startedAtRef = useRef(Date.now());
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const finishedRef = useRef(false);
  const wrongCardIdsRef = useRef<string[]>([]);
  const answeredIdsRef = useRef<string[]>([]);
  const didStart = useRef(false);

  const startQuiz = useCallback(
    (overrideCards?: { cardIds?: string[] }) => {
      finishedRef.current = false;
      correctRef.current = 0;
      wrongRef.current = 0;
      wrongCardIdsRef.current = [];
      answeredIdsRef.current = [];
      setCorrectCount(0);
      setWrongCount(0);
      setIndex(0);
      setPicked(null);
      setRevealed(false);
      setDone(false);
      startedAtRef.current = Date.now();

      const answers = uniqueAnswers(
        useCardStore.getState().getCards(deckId).map((c) => ({
          id: c.id,
          deskId: deckId,
          word1: c.word1,
          word2: c.word2,
          learningLevel: 0 as const,
          correctCount: 0,
          wrongCount: 0,
          isHard: false,
          lastStudiedAt: null,
        })),
        direction,
      );
      // Prefer learning-merged pool from loadSession for real distractors
      const config = {
        deskId: deckId,
        mode,
        exercise: "quiz" as const,
        quizDirection: direction,
        limit: 999,
        shuffle,
        hideMastered,
      };
      const { pool, cards } = loadSession(config);
      const unique = uniqueAnswers(pool, direction);
      setOptionCount(unique.length);

      if (unique.length < QUIZ_MIN_CARDS) {
        setQuestions([]);
        setPhase("not-enough");
        return;
      }

      let sessionCards = cards;
      if (overrideCards?.cardIds?.length) {
        const byId = new Map(pool.map((c) => [c.id, c]));
        sessionCards = overrideCards.cardIds
          .map((id) => byId.get(id))
          .filter(Boolean) as typeof cards;
      }

      if (sessionCards.length === 0) {
        setQuestions([]);
        setPhase("empty-mode");
        return;
      }

      const built = buildQuizQuestions(sessionCards, pool, direction);
      if (built.length === 0) {
        setOptionCount(unique.length);
        setQuestions([]);
        setPhase("not-enough");
        return;
      }

      setQuestions(built);
      setPhase("quiz");
      void answers;
    },
    [deckId, direction, hideMastered, mode, shuffle],
  );

  useEffect(() => {
    if (didStart.current) return;
    didStart.current = true;
    startQuiz();
  }, [startQuiz]);

  const completeQuiz = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const durationMs = Math.max(0, Date.now() - startedAtRef.current);
    const correct = correctRef.current;
    const wrong = wrongRef.current;
    const total = questions.length;
    const points = correct * 5;

    finishSession({
      deskId: deckId,
      exercise: "quiz",
      mode,
      correct,
      wrong,
      total,
      points,
      durationMs,
    });
  }, [deckId, mode, questions.length]);

  const answer = useCallback(
    (option: string | null) => {
      if (revealed || done) return;
      const q = questions[index];
      if (!q) return;

      const ok = option !== null && norm(option) === norm(q.answer);
      const learning = useLearningStore.getState();
      if (ok) {
        learning.applyCorrect(q.cardId);
        const next = correctRef.current + 1;
        correctRef.current = next;
        setCorrectCount(next);
      } else {
        learning.applyWrong(q.cardId);
        wrongCardIdsRef.current = [...wrongCardIdsRef.current, q.cardId];
        const next = wrongRef.current + 1;
        wrongRef.current = next;
        setWrongCount(next);
      }
      answeredIdsRef.current = [...answeredIdsRef.current, q.cardId];
      setPicked(option);
      setRevealed(true);
    },
    [done, index, questions, revealed],
  );

  const next = useCallback(() => {
    if (index + 1 >= questions.length) {
      completeQuiz();
      setDone(true);
      return;
    }
    setPicked(null);
    setRevealed(false);
    setIndex((i) => i + 1);
  }, [completeQuiz, index, questions.length]);

  const progress = questions.length
    ? (done ? 1 : (revealed ? index + 1 : index) / questions.length)
    : 0;

  const exitToDeck = () => {
    navigation.navigate("CardDecks", { deckId, deckTitle });
  };

  const switchToFlip = () => {
    navigation.replace("FlipCardScreen", {
      deckId,
      deckTitle,
      mode,
      shuffle,
      hideMastered,
    });
  };

  const addCards = () => {
    navigation.navigate("CardDecks", {
      deckId,
      deckTitle,
      initialAdding: true,
    });
  };

  if (phase === "not-enough") {
    return (
      <NotEnoughCards
        deckName={deckTitle}
        cardCount={rawCards.length}
        optionCount={optionCount}
        onBack={() => navigation.goBack()}
        onSwitchToFlip={switchToFlip}
        onAddCards={addCards}
      />
    );
  }

  if (phase === "empty-mode") {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <SessionHeader
          deckName={deckTitle}
          correct={0}
          wrong={0}
          position={0}
          total={0}
          progress={0}
          onExit={() => navigation.goBack()}
        />
        <View style={styles.emptyWrap}>
          <AppText weight="mono" style={styles.eyebrow}>
            {"Quiz başlatılamadı".toLocaleUpperCase("tr-TR")}
          </AppText>
          <AppText weight="semibold" style={styles.emptyTitle}>
            Bu modda çalışılacak kart yok.
          </AppText>
          <Pressable style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
            <AppText weight="semibold">Ayarlara dön</AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === "loading" || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <SessionHeader
          deckName={deckTitle}
          correct={0}
          wrong={0}
          position={0}
          total={0}
          progress={0}
          onExit={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const q = questions[index];
  const answered = revealed;
  const isRight =
    answered && picked !== null && norm(picked) === norm(q?.answer ?? "");

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <SessionHeader
        deckName={deckTitle}
        correct={correctCount}
        wrong={wrongCount}
        position={done ? questions.length : index + 1}
        total={questions.length}
        progress={progress}
        onExit={() => navigation.goBack()}
      />

      {done ? (
        <SessionSummary
          correct={correctCount}
          wrong={wrongCount}
          correctLabel="Doğru"
          wrongLabel="Yanlış"
          onRetryWrong={() => startQuiz({ cardIds: wrongCardIdsRef.current })}
          onRestart={() => startQuiz({ cardIds: answeredIdsRef.current })}
          onExit={exitToDeck}
        />
      ) : (
        <>
          <View style={styles.body}>
            <View style={styles.promptCard}>
              <AppText weight="mono" style={styles.monoLabel}>
                {(direction === "w1-w2" ? "Kelime" : "Anlam").toLocaleUpperCase(
                  "tr-TR",
                )}
              </AppText>
              <AppText weight="semibold" style={styles.prompt}>
                {q.prompt}
              </AppText>
              <AppText style={styles.promptHint}>
                {direction === "w1-w2"
                  ? "Doğru anlamı seç"
                  : "Doğru kelimeyi seç"}
              </AppText>
            </View>

            <View style={styles.options}>
              {q.options.map((option, i) => {
                const isAnswer = norm(option) === norm(q.answer);
                const isPicked =
                  picked !== null && norm(option) === norm(picked);
                let tone = styles.optionIdle;
                let badge = styles.badgeIdle;
                if (answered && isAnswer) {
                  tone = styles.optionCorrect;
                  badge = styles.badgeCorrect;
                } else if (answered && isPicked) {
                  tone = styles.optionWrong;
                  badge = styles.badgeWrong;
                } else if (answered) {
                  tone = styles.optionDim;
                }
                return (
                  <Pressable
                    key={`${q.cardId}-${option}-${i}`}
                    disabled={answered}
                    onPress={() => answer(option)}
                    style={({ pressed }) => [
                      styles.option,
                      tone,
                      pressed && !answered && { transform: [{ scale: 0.99 }] },
                    ]}
                  >
                    <View style={[styles.badge, badge]}>
                      {answered && isAnswer ? (
                        <Check size={15} color={colors.white} strokeWidth={3} />
                      ) : answered && isPicked ? (
                        <X size={15} color={colors.white} strokeWidth={3} />
                      ) : (
                        <AppText weight="monoMedium" style={styles.badgeLetter}>
                          {LETTERS[i]}
                        </AppText>
                      )}
                    </View>
                    <AppText weight="medium" style={styles.optionText}>
                      {option}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.footer}>
            {answered ? (
              <View>
                <AppText style={styles.feedback}>
                  {isRight ? (
                    <AppText weight="semibold" style={{ color: colors.correct }}>
                      Doğru, devam et.
                    </AppText>
                  ) : (
                    <>
                      <AppText weight="semibold" style={{ color: colors.wrong }}>
                        {picked === null ? "Bilinmedi." : "Yanlış."}
                      </AppText>
                      <AppText style={{ color: colors.muted }}>
                        {" "}
                        Doğru cevap:{" "}
                      </AppText>
                      <AppText weight="semibold">{q.answer}</AppText>
                    </>
                  )}
                </AppText>
                <PrimaryButton
                  label={
                    index + 1 >= questions.length
                      ? "Sonuçları gör"
                      : "Devam"
                  }
                  onPress={next}
                />
              </View>
            ) : (
              <Pressable style={styles.dontKnow} onPress={() => answer(null)}>
                <AppText weight="semibold" style={styles.dontKnowText}>
                  Bilmiyorum, cevabı göster
                </AppText>
              </Pressable>
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

function NotEnoughCards({
  deckName,
  cardCount,
  optionCount,
  onBack,
  onSwitchToFlip,
  onAddCards,
}: {
  deckName: string;
  cardCount: number;
  optionCount: number;
  onBack: () => void;
  onSwitchToFlip: () => void;
  onAddCards: () => void;
}) {
  const missing = QUIZ_MIN_CARDS - optionCount;
  const duplicates = cardCount >= QUIZ_MIN_CARDS;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.neHeader}>
        <Pressable
          accessibilityLabel="Geri"
          onPress={onBack}
          style={styles.backBtn}
        >
          <ChevronLeft size={20} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText weight="semibold" style={{ fontSize: 17 }} numberOfLines={1}>
            {deckName}
          </AppText>
          <AppText style={{ fontSize: 12, color: colors.muted }}>Quiz</AppText>
        </View>
      </View>

      <View style={styles.neBody}>
        <View style={styles.slots}>
          {Array.from({ length: QUIZ_MIN_CARDS }, (_, i) => {
            const filled = i < optionCount;
            return (
              <View
                key={i}
                style={[styles.slot, filled ? styles.slotFilled : styles.slotEmpty]}
              >
                {filled ? (
                  <AppText weight="monoMedium" style={styles.slotLetter}>
                    {LETTERS[i]}
                  </AppText>
                ) : (
                  <Plus size={16} color="rgba(22,21,29,0.25)" />
                )}
              </View>
            );
          })}
        </View>

        <AppText weight="mono" style={[styles.eyebrow, { marginTop: 32 }]}>
          {"Quiz başlatılamadı".toLocaleUpperCase("tr-TR")}
        </AppText>
        <AppText weight="semibold" style={styles.neTitle}>
          {duplicates
            ? "Şık oluşturmak için yeterli farklı cevap yok."
            : `${missing} kart daha eklemen gerekiyor.`}
        </AppText>
        <AppText style={styles.neBodyText}>
          Her soruda 1 doğru ve 3 yanlış şık gösteriliyor, bu yüzden destede
          anlamı farklı en az {QUIZ_MIN_CARDS} kart olmalı. Bu destede{" "}
          <AppText weight="medium">{cardCount} kart</AppText> var
          {duplicates || optionCount < cardCount
            ? `, ${optionCount} farklı cevap`
            : ""}
          .
        </AppText>
      </View>

      <View style={styles.neFooter}>
        <Pressable
          onPress={onAddCards}
          style={({ pressed }) => [
            styles.addBtn,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <Plus size={18} color={colors.white} strokeWidth={2.25} />
          <AppText weight="semibold" style={{ color: colors.white, fontSize: 15 }}>
            Kart ekle
          </AppText>
        </Pressable>
        {cardCount > 0 && (
          <Pressable
            onPress={onSwitchToFlip}
            style={({ pressed }) => [
              styles.flipBtn,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
          >
            <GalleryHorizontalEnd size={17} color={colors.ink} />
            <AppText weight="semibold" style={{ fontSize: 15 }}>
              Kart çevir ile çalış
            </AppText>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

export default LearnScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  body: {
    flex: 1,
    paddingHorizontal: space[4],
    paddingTop: space[5],
  },
  promptCard: {
    minHeight: 188,
    borderRadius: radii["3xl"],
    backgroundColor: colors.white,
    padding: space[6],
  },
  monoLabel: {
    fontSize: 11,
    letterSpacing: 1.54,
    color: colors.muted,
  },
  prompt: {
    flex: 1,
    textAlign: "center",
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1.19,
    paddingVertical: 16,
  },
  promptHint: {
    textAlign: "center",
    fontSize: 12,
    color: colors.muted,
  },
  options: { marginTop: space[4], gap: 10 },
  option: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionIdle: {
    backgroundColor: colors.white,
    borderColor: "transparent",
  },
  optionCorrect: {
    backgroundColor: colors.correctBg,
    borderColor: colors.correct,
  },
  optionWrong: {
    backgroundColor: colors.wrongBg,
    borderColor: colors.wrong,
  },
  optionDim: {
    backgroundColor: colors.white,
    borderColor: "transparent",
    opacity: 0.45,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIdle: { backgroundColor: colors.paper },
  badgeCorrect: { backgroundColor: colors.correct },
  badgeWrong: { backgroundColor: colors.wrong },
  badgeLetter: { fontSize: 13, color: colors.muted },
  optionText: { flex: 1, fontSize: 16, lineHeight: 22 },
  footer: {
    paddingHorizontal: space[4],
    paddingBottom: space[9],
    paddingTop: space[4],
  },
  feedback: { marginBottom: 12, paddingHorizontal: 4, fontSize: 14 },
  dontKnow: {
    height: 52,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  dontKnowText: { fontSize: 15, color: colors.muted },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: space[6],
  },
  emptyTitle: {
    marginTop: 8,
    fontSize: 26,
    letterSpacing: -0.78,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.54,
    color: colors.muted,
  },
  secondaryBtn: {
    marginTop: 24,
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  neHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: space[4],
    paddingVertical: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  neBody: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: space[6],
    paddingBottom: 40,
  },
  slots: { flexDirection: "row", gap: 8 },
  slot: {
    width: 54,
    height: 72,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  slotFilled: {
    backgroundColor: colors.white,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  slotEmpty: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(22,21,29,0.2)",
  },
  slotLetter: { fontSize: 13, color: colors.accent },
  neTitle: {
    marginTop: 8,
    fontSize: 26,
    lineHeight: 28.6,
    letterSpacing: -0.78,
  },
  neBodyText: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22.5,
    color: colors.muted,
  },
  neFooter: {
    paddingHorizontal: space[4],
    paddingBottom: space[9],
    gap: 10,
  },
  addBtn: {
    height: 52,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  flipBtn: {
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
