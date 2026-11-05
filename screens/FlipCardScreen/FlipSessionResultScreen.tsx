import React from "react";
import {
  SafeAreaView,
  StyleSheet,
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
import { RootStackParamList } from "../RootStackParams";

/**
 * Minimal Phase 2 session summary. Full StudyResultScreen is Phase 4.
 */
const FlipSessionResultScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, "FlipSessionResult">>();
  const {
    deskId,
    deckTitle,
    correct,
    wrong,
    total,
    durationMs,
    source = "flip",
  } = route.params;

  const accuracy =
    total > 0 ? Math.round((correct / total) * 100) : 0;
  const seconds = Math.round(durationMs / 1000);
  const eyebrow = source === "quiz" ? "Quiz oturumu" : "Flip oturumu";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{deckTitle}</Text>
        <Text style={styles.subtitle}>Session complete</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, styles.correct]}>{correct}</Text>
            <Text style={styles.statLabel}>Doğru / Correct</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, styles.wrong]}>{wrong}</Text>
            <Text style={styles.statLabel}>Yanlış / Wrong</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>İsabet / Accuracy</Text>
          </View>
        </View>

        <Text style={styles.meta}>
          {total} kart · {seconds}s
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (source === "quiz") {
              navigation.replace("LearnScreen", {
                deckId: deskId,
                deckTitle,
              });
            } else {
              navigation.replace("FlipCardScreen", {
                deckId: deskId,
                deckTitle,
              });
            }
          }}
        >
          <Text style={styles.primaryButtonText}>Tekrar / Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("CardDecks", {
              deckId: deskId,
              deckTitle,
            })
          }
        >
          <Text style={styles.secondaryButtonText}>Deck'e dön / Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FlipSessionResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4f42d8",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#94A3B8",
  },
  stats: {
    flexDirection: "row",
    gap: 16,
    marginTop: 40,
    marginBottom: 16,
  },
  stat: {
    alignItems: "center",
    minWidth: 88,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
  },
  correct: {
    color: "#16A34A",
  },
  wrong: {
    color: "#DC2626",
  },
  statLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  meta: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 40,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#4f42d8",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryButtonText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "600",
  },
});
