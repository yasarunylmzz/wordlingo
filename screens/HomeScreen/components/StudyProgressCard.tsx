import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../RootStackParams";
import { useLearningStore } from "../../../stores/learningStore";
import {
  formatMinutes,
  streakFromDates,
  todayKey,
} from "../../../domain/learning/stats";

/**
 * Real learning streak + study minutes (alongside restored Chart/Todo on Home).
 */
const StudyProgressCard = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const studyDates = useLearningStore((state) => state.studyDates);
  const studyMinutes = useLearningStore((state) => state.studyMinutes);
  const sessions = useLearningStore((state) => state.sessionLedger.length);

  const streak = streakFromDates(studyDates);
  const studiedToday = studyDates.includes(todayKey());

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Öğrenme / Learning</Text>
      <Text style={styles.title}>
        {studiedToday ? "Bugün çalıştın" : "Bugün çalış"}
      </Text>
      <Text style={styles.subtitle}>
        Seviye merdiveni + yanlış / unutulan kuyrukları
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>Streak (gün)</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatMinutes(studyMinutes)}</Text>
          <Text style={styles.statLabel}>Çalışma süresi</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{sessions}</Text>
          <Text style={styles.statLabel}>Oturum</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.navigate("AllDecks")}
      >
        <Text style={styles.ctaText}>
          {studiedToday ? "Deck'lere git" : "Bugün çalış → Deck seç"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudyProgressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4f42d8",
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
  },
  cta: {
    backgroundColor: "#4f42d8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
