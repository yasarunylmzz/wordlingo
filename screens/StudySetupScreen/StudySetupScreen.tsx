import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../RootStackParams";
import type {
  QuizDirection,
  StudyExercise,
  StudyMode,
} from "../../domain/learning/types";
import { useCardStore } from "../../stores/cardStore";

const MODES: { id: StudyMode; label: string; sub: string }[] = [
  { id: "normal", label: "Normal", sub: "Bu deck" },
  { id: "wrong", label: "Wrong", sub: "Yanlışlar" },
  { id: "forgotten", label: "Forgotten", sub: "Unutulan" },
  { id: "hard", label: "Hard", sub: "Zor işaretli" },
  { id: "review", label: "Review", sub: "Karışık" },
];

const StudySetupScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "StudySetup">>();
  const { deckId, deckTitle } = route.params;

  const cardCount = useCardStore((state) => state.getCards(deckId).length);

  const [exercise, setExercise] = useState<StudyExercise>("quiz");
  const [mode, setMode] = useState<StudyMode>("normal");
  const [shuffle, setShuffle] = useState(true);
  const [hideMastered, setHideMastered] = useState(false);
  const [quizDirection, setQuizDirection] =
    useState<QuizDirection>("w1-w2");

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>{deckTitle}</Text>
          <Text style={styles.subtitle}>
            Study setup · {cardCount} kart
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Egzersiz / Exercise</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.choice, exercise === "quiz" && styles.choiceOn]}
            onPress={() => setExercise("quiz")}
          >
            <Text
              style={[
                styles.choiceTitle,
                exercise === "quiz" && styles.choiceTitleOn,
              ]}
            >
              Quiz
            </Text>
            <Text style={styles.choiceSub}>Çoktan seçmeli</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choice, exercise === "flip" && styles.choiceOn]}
            onPress={() => setExercise("flip")}
          >
            <Text
              style={[
                styles.choiceTitle,
                exercise === "flip" && styles.choiceTitleOn,
              ]}
            >
              Flip
            </Text>
            <Text style={styles.choiceSub}>Sağ doğru · Sol yanlış</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Mod</Text>
        <View style={styles.chipWrap}>
          {MODES.map((item) => {
            const on = mode === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => setMode(item.id)}
              >
                <Text style={[styles.chipTitle, on && styles.chipTitleOn]}>
                  {item.label}
                </Text>
                <Text style={[styles.chipSub, on && styles.chipTitleOn]}>
                  {item.sub}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {exercise === "quiz" && (
          <>
            <Text style={styles.sectionTitle}>Quiz yönü</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.choice,
                  quizDirection === "w1-w2" && styles.choiceOn,
                ]}
                onPress={() => setQuizDirection("w1-w2")}
              >
                <Text
                  style={[
                    styles.choiceTitle,
                    quizDirection === "w1-w2" && styles.choiceTitleOn,
                  ]}
                >
                  word1 → word2
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.choice,
                  quizDirection === "w2-w1" && styles.choiceOn,
                ]}
                onPress={() => setQuizDirection("w2-w1")}
              >
                <Text
                  style={[
                    styles.choiceTitle,
                    quizDirection === "w2-w1" && styles.choiceTitleOn,
                  ]}
                >
                  word2 → word1
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Shuffle</Text>
              <Text style={styles.toggleSub}>Kartları karıştır</Text>
            </View>
            <Switch
              value={shuffle}
              onValueChange={setShuffle}
              trackColor={{ false: "#d3d3d3", true: "#a5a0e8" }}
              thumbColor={shuffle ? "#4f42d8" : "#f4f4f4"}
            />
          </View>
          <View style={styles.toggleDivider} />
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleTitle}>Hide mastered</Text>
              <Text style={styles.toggleSub}>
                Seviye 3 (öğrendim) kartları gizle
              </Text>
            </View>
            <Switch
              value={hideMastered}
              onValueChange={setHideMastered}
              trackColor={{ false: "#d3d3d3", true: "#a5a0e8" }}
              thumbColor={hideMastered ? "#4f42d8" : "#f4f4f4"}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={start}>
          <Text style={styles.startButtonText}>Başla / Start</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudySetupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FD" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backButton: { padding: 8 },
  headerText: { flex: 1, marginLeft: 4 },
  title: { fontSize: 18, fontWeight: "700", color: "#1E293B" },
  subtitle: { fontSize: 13, color: "#64748B", marginTop: 2 },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
    marginTop: 8,
  },
  row: { flexDirection: "row", gap: 10, marginBottom: 8 },
  choice: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },
  choiceOn: {
    borderColor: "#4f42d8",
    backgroundColor: "#eeecfb",
  },
  choiceTitle: { fontSize: 15, fontWeight: "700", color: "#334155" },
  choiceTitleOn: { color: "#4f42d8" },
  choiceSub: { fontSize: 12, color: "#64748B", marginTop: 4 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },
  chipOn: { borderColor: "#4f42d8", backgroundColor: "#eeecfb" },
  chipTitle: { fontSize: 14, fontWeight: "700", color: "#334155" },
  chipTitleOn: { color: "#4f42d8" },
  chipSub: { fontSize: 11, color: "#64748B", marginTop: 2 },
  toggleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  toggleDivider: { height: 1, backgroundColor: "#F1F5F9" },
  toggleTitle: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  toggleSub: { fontSize: 12, color: "#64748B", marginTop: 2, maxWidth: 220 },
  startButton: {
    marginTop: 24,
    backgroundColor: "#4f42d8",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  startButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
