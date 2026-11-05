import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../RootStackParams";
import {
  buildQuizQuestions,
  type QuizQuestion,
} from "../../domain/learning/quiz";
import type {
  QuizDirection,
  StudyMode,
  StudySessionConfig,
} from "../../domain/learning/types";
import {
  finishSession,
  loadSession,
} from "../../services/studySessionService";
import { useLearningStore } from "../../stores/learningStore";
import { useCardStore } from "../../stores/cardStore";

const MODES: { id: StudyMode; label: string; sub: string }[] = [
  { id: "normal", label: "Normal", sub: "Deck" },
  { id: "wrong", label: "Wrong", sub: "Yanlışlar" },
  { id: "forgotten", label: "Forgotten", sub: "Unutulan" },
  { id: "hard", label: "Hard", sub: "Zor" },
];

type ScreenPhase = "setup" | "quiz" | "empty";

const MIN_POOL_FOR_QUIZ = 4;

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

  const [phase, setPhase] = useState<ScreenPhase>("setup");
  const [mode, setMode] = useState<StudyMode>(routeMode);
  const [direction, setDirection] = useState<QuizDirection>(routeDirection);
  const [shuffle] = useState(routeShuffle);
  const [hideMastered] = useState(routeHideMastered);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [emptyReason, setEmptyReason] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  const startedAtRef = useRef(Date.now());
  const correctRef = useRef(0);
  const wrongRef = useRef(0);
  const finishedRef = useRef(false);
  const didAutoStart = useRef(false);

  const deskCardCount = useCardStore(
    (state) => state.getCards(deckId).length
  );

  const promptLabel = useMemo(
    () =>
      direction === "w1-w2"
        ? "Bu kelimenin karşılığı nedir? (word1 → word2)"
        : "Bu kelimenin karşılığı nedir? (word2 → word1)",
    [direction]
  );

  const buildConfig = useCallback((): StudySessionConfig => {
    return {
      deskId: deckId,
      mode,
      exercise: "quiz",
      quizDirection: direction,
      limit: 20,
      shuffle,
      hideMastered,
    };
  }, [deckId, mode, direction, shuffle, hideMastered]);

  const startQuiz = useCallback(() => {
    finishedRef.current = false;
    correctRef.current = 0;
    wrongRef.current = 0;
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    startedAtRef.current = Date.now();

    const rawCount = useCardStore.getState().getCards(deckId).length;
    if (rawCount < MIN_POOL_FOR_QUIZ) {
      setEmptyReason(
        `Quiz için en az ${MIN_POOL_FOR_QUIZ} kart gerekir (3 çeldirici + 1 soru). Bu deck'te ${rawCount} kart var.`
      );
      setQuestions([]);
      setPhase("empty");
      return;
    }

    const config = buildConfig();
    const { pool, cards } = loadSession(config);

    if (pool.length < MIN_POOL_FOR_QUIZ) {
      setEmptyReason(
        `Yeterli çeldirici yok. Deck'te en az ${MIN_POOL_FOR_QUIZ} kart olmalı.`
      );
      setQuestions([]);
      setPhase("empty");
      return;
    }

    if (cards.length === 0) {
      setEmptyReason(
        `Bu mod (${mode}) için çalışılacak kart yok. Başka bir mod deneyin.`
      );
      setQuestions([]);
      setPhase("empty");
      return;
    }

    const built = buildQuizQuestions(cards, pool, direction);
    if (built.length === 0) {
      setEmptyReason(
        "Yeterli benzersiz çeldirici üretilemedi. Deck'e daha fazla kart ekleyin."
      );
      setQuestions([]);
      setPhase("empty");
      return;
    }

    setQuestions(built);
    setPhase("quiz");
  }, [buildConfig, deckId, direction, mode]);

  useEffect(() => {
    if (!autoStart || didAutoStart.current) return;
    didAutoStart.current = true;
    startQuiz();
  }, [autoStart, startQuiz]);

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

    navigation.replace("StudyResult", {
      deskId: deckId,
      deckTitle,
      correct,
      wrong,
      total,
      durationMs,
      points,
      mode,
      exercise: "quiz",
      source: "quiz",
    });
  }, [deckId, deckTitle, mode, navigation, questions.length]);
  const checkAnswer = () => {
    if (selectedAnswer === null || answerChecked) return;
    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctIndex;
    const learning = useLearningStore.getState();

    if (isCorrect) {
      learning.applyCorrect(question.cardId);
      const next = correctRef.current + 1;
      correctRef.current = next;
      setCorrectAnswers(next);
    } else {
      learning.applyWrong(question.cardId);
      const next = wrongRef.current + 1;
      wrongRef.current = next;
      setWrongAnswers(next);
    }

    setAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswerChecked(false);
    } else {
      completeQuiz();
    }
  };

  const getOptionStyle = (index: number) => {
    if (!answerChecked) {
      return {
        ...styles.optionButton,
        borderColor: selectedAnswer === index ? "#3498db" : "#e0e0e0",
        backgroundColor: selectedAnswer === index ? "#edf7fd" : "#f8f9fa",
      };
    }

    const isCorrect = index === questions[currentQuestion].correctIndex;
    const isSelected = index === selectedAnswer;

    return {
      ...styles.optionButton,
      borderColor: isCorrect ? "#2ecc71" : isSelected ? "#e74c3c" : "#e0e0e0",
      backgroundColor: isCorrect
        ? "#e8f6f3"
        : isSelected && !isCorrect
          ? "#fdedec"
          : "#f8f9fa",
    };
  };

  const exitQuiz = () => {
    navigation.goBack();
  };

  const header = (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={exitQuiz}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{deckTitle}</Text>
        <Text style={styles.headerSubtitle}>Learn Mode · Quiz</Text>
      </View>
    </View>
  );

  if (phase === "setup") {
    if (autoStart) {
      return (
        <SafeAreaView style={styles.container}>
          {header}
          <View style={styles.scrollContainer}>
            <Text style={styles.setupHint}>Quiz hazırlanıyor…</Text>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        {header}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Çalışma modu</Text>
            <Text style={styles.setupHint}>
              {deskCardCount} kart · en az {MIN_POOL_FOR_QUIZ} kart gerekir
            </Text>

            <View style={styles.chipRow}>
              {MODES.map((item) => {
                const active = mode === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setMode(item.id)}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {item.label}
                    </Text>
                    <Text
                      style={[styles.chipSub, active && styles.chipTextActive]}
                    >
                      {item.sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.cardTitle, { marginTop: 20 }]}>Yön</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  direction === "w1-w2" && styles.chipActive,
                ]}
                onPress={() => setDirection("w1-w2")}
              >
                <Text
                  style={[
                    styles.chipText,
                    direction === "w1-w2" && styles.chipTextActive,
                  ]}
                >
                  word1 → word2
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.chip,
                  direction === "w2-w1" && styles.chipActive,
                ]}
                onPress={() => setDirection("w2-w1")}
              >
                <Text
                  style={[
                    styles.chipText,
                    direction === "w2-w1" && styles.chipTextActive,
                  ]}
                >
                  word2 → word1
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.checkButton} onPress={startQuiz}>
              <Text style={styles.buttonText}>Başla / Start</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (phase === "empty") {
    return (
      <SafeAreaView style={styles.container}>
        {header}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quiz başlatılamadı</Text>
            <Text style={styles.emptyText}>{emptyReason}</Text>
            <TouchableOpacity
              style={styles.checkButton}
              onPress={() => setPhase("setup")}
            >
              <Text style={styles.buttonText}>Mod seçimine dön</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const question = questions[currentQuestion];

  return (
    <SafeAreaView style={styles.container}>
      {header}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentQuestion + 1} / {questions.length}
          </Text>
          <Text style={styles.accuracyText}>
            {correctAnswers} doğru · {wrongAnswers} yanlış
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{promptLabel}</Text>
          <Text style={styles.term}>{question.prompt}</Text>

          {question.options.map((option, index) => (
            <TouchableOpacity
              key={`${question.cardId}-${index}`}
              style={getOptionStyle(index)}
              onPress={() => !answerChecked && setSelectedAnswer(index)}
              disabled={answerChecked}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                opacity: selectedAnswer !== null || answerChecked ? 1 : 0.7,
              },
            ]}
            onPress={() => {
              if (!answerChecked) {
                checkAnswer();
              } else {
                handleNextQuestion();
              }
            }}
            disabled={selectedAnswer === null && !answerChecked}
          >
            <Text style={styles.buttonText}>
              {answerChecked
                ? currentQuestion === questions.length - 1
                  ? "Bitir / Finish"
                  : "Sonraki Soru"
                : "Cevabı Kontrol Et"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "90%",
  },
  progressText: {
    color: "#3498db",
    fontWeight: "bold",
  },
  accuracyText: {
    color: "#95a5a6",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: "90%",
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2c3e50",
  },
  setupHint: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    marginBottom: 20,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
    minWidth: "45%",
    flexGrow: 1,
  },
  chipActive: {
    borderColor: "#4f42d8",
    backgroundColor: "#eeecfb",
  },
  chipText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2c3e50",
  },
  chipSub: {
    fontSize: 11,
    color: "#7f8c8d",
    marginTop: 2,
  },
  chipTextActive: {
    color: "#4f42d8",
  },
  term: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 24,
    textAlign: "center",
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
    width: "100%",
  },
  optionText: {
    color: "#2c3e50",
    fontSize: 16,
    textAlign: "center",
  },
  checkButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default LearnScreen;
