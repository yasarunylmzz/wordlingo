import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../RootStackParams";
import AppText from "../../Components/ui/AppText";
import { colors, radii, space } from "../../theme/theme";

const StudyResultScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "StudyResult">>();
  const {
    deskId,
    deckTitle,
    correct,
    wrong,
    total,
  } = route.params;

  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const message =
    pct === 100
      ? "Hepsini bildin, harika."
      : pct >= 60
        ? "İyi gidiyorsun, yanlışları bir tur daha dene."
        : "Yanlışları tekrar etmek akılda kalıcılığı artırır.";

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.center}>
          <AppText weight="mono" style={styles.eyebrow}>
            Tur tamamlandı
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
              <AppText weight="medium" style={styles.statCorrect}>
                Bildim
              </AppText>
              <AppText weight="semibold" style={styles.statVal}>
                {correct}
              </AppText>
            </View>
            <View style={styles.statCard}>
              <AppText weight="medium" style={styles.statWrong}>
                Bilemedim
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
            onPress={() =>
              navigation.replace("StudySetup", {
                deckId: deskId,
                deckTitle,
              })
            }
          >
            <AppText weight="semibold" style={styles.primaryText}>
              {wrong > 0
                ? `Yanlışları tekrar et (${wrong})`
                : "Tekrar çalış"}
            </AppText>
          </Pressable>
          <Pressable
            onPress={() =>
              navigation.navigate("CardDecks", {
                deckId: deskId,
                deckTitle,
              })
            }
            style={styles.secondary}
          >
            <AppText weight="semibold" style={styles.secondaryText}>
              Desteye dön
            </AppText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StudyResultScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: {
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
    textTransform: "uppercase",
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
  statCorrect: { fontSize: 12, color: colors.correct },
  statWrong: { fontSize: 12, color: colors.wrong },
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
