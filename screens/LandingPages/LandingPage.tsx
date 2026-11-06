import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParams";
import AppText from "../../Components/ui/AppText";
import PrimaryButton from "../../Components/ui/PrimaryButton";
import { colors, radii, space } from "../../theme/theme";

const wordRows: { words: string[]; duration: number }[] = [
  { words: ["Güneş", "Sun", "Sol", "Soleil", "Sonne", "Sole", "Słońce"], duration: 46 },
  { words: ["Kitap", "Book", "Libro", "Livre", "Buch", "Boek", "Kniha"], duration: 38 },
  { words: ["Teşekkürler", "Thanks", "Gracias", "Merci", "Danke", "Grazie"], duration: 54 },
  {
    words: ["Merhaba", "Hello", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "Hej", "Ahoj"],
    duration: 40,
  },
  { words: ["Arkadaş", "Friend", "Amigo", "Ami", "Freund", "Amico", "Vän"], duration: 44 },
  { words: ["Sevgi", "Love", "Amor", "Amour", "Liebe", "Amore", "Kärlek"], duration: 36 },
  { words: ["Su", "Water", "Agua", "Eau", "Wasser", "Acqua", "Vesi"], duration: 50 },
];

const HIGHLIGHT_ROW = 3;

function MarqueeRow({
  words,
  duration,
  reverse,
  color,
  absolute,
}: {
  words: string[];
  duration: number;
  reverse?: boolean;
  color: string;
  absolute?: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, duration]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? [-200, 0] : [0, -200],
  });

  const content = [...words, ...words].map((w, i) => (
    <AppText
      key={`${w}-${i}`}
      weight="semibold"
      style={[styles.marqueeWord, { color }]}
    >
      {w}
    </AppText>
  ));

  return (
    <View
      style={[styles.marqueeClip, absolute && StyleSheet.absoluteFillObject]}
      pointerEvents="none"
    >
      <Animated.View
        style={[styles.marqueeTrack, { transform: [{ translateX }] }]}
      >
        {content}
      </Animated.View>
    </View>
  );
}

function WordHero() {
  return (
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <AppText weight="mono" style={styles.heroEyebrow}>
          {"Bir kelime, birçok dil".toLocaleUpperCase("tr-TR")}
        </AppText>
      </View>

      <View style={styles.heroMarquee}>
        {wordRows.map((row, i) =>
          i === HIGHLIGHT_ROW ? (
            <View key={i} style={styles.lensRow}>
              <View style={styles.lens} />
              <MarqueeRow
                {...row}
                reverse={i % 2 === 1}
                color="rgba(255,255,255,0.4)"
              />
              <View style={styles.lensClip} pointerEvents="none">
                <MarqueeRow
                  {...row}
                  reverse={i % 2 === 1}
                  color={colors.accent}
                  absolute
                />
              </View>
            </View>
          ) : (
            <MarqueeRow
              key={i}
              {...row}
              reverse={i % 2 === 1}
              color={
                Math.abs(i - HIGHLIGHT_ROW) === 1
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.15)"
              }
            />
          ),
        )}
      </View>

      <View style={styles.heroBottom}>
        <AppText weight="medium" style={styles.heroCaption}>
          Merhaba → Hello
        </AppText>
        <AppText weight="mono" style={styles.heroEyebrow}>
          TR · EN
        </AppText>
      </View>
    </View>
  );
}

/** Welcome screen (prototype): brand hero + Hesap oluştur / Giriş yap. */
const LandingPage = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <WordHero />

      <View style={styles.bottom}>
        <AppText weight="semibold" style={styles.brand}>
          Word-Lingo
          <AppText weight="semibold" style={{ color: colors.accent }}>
            .
          </AppText>
        </AppText>
        <AppText style={styles.tagline}>
          Her gün birkaç yeni kelime öğren, onları hiç unutma.
        </AppText>

        <PrimaryButton
          label="Hesap oluştur"
          onPress={() => navigation.navigate("SignIn")}
          style={{ marginTop: 28 }}
        />
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={styles.loginLink}
        >
          <AppText weight="semibold" style={styles.loginLinkText}>
            Zaten hesabım var, giriş yap
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  hero: {
    marginHorizontal: space[4],
    marginTop: 8,
    flex: 1,
    maxHeight: 560,
    borderRadius: 32,
    backgroundColor: colors.accent,
    overflow: "hidden",
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: space[5],
    paddingTop: space[5],
  },
  heroEyebrow: {
    fontSize: 11,
    letterSpacing: 1.54,
    color: "rgba(255,255,255,0.6)",
  },
  heroMarquee: {
    flex: 1,
    justifyContent: "center",
  },
  marqueeClip: {
    overflow: "hidden",
  },
  marqueeTrack: {
    flexDirection: "row",
    width: 2000,
  },
  marqueeWord: {
    paddingRight: 28,
    fontSize: 38,
    lineHeight: 50,
    letterSpacing: -1.33,
  },
  lensRow: {
    position: "relative",
    marginVertical: 6,
  },
  lens: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "17%",
    right: "17%",
    borderRadius: 18,
    backgroundColor: colors.white,
    shadowColor: "#140c5a",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },
  lensClip: {
    ...StyleSheet.absoluteFillObject,
    left: "17%",
    right: "17%",
    borderRadius: 18,
    overflow: "hidden",
  },
  heroBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: space[5],
    paddingBottom: space[5],
  },
  heroCaption: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  bottom: {
    marginTop: "auto",
    paddingHorizontal: space[6],
    paddingBottom: space[9],
    paddingTop: 32,
  },
  brand: {
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1.36,
  },
  tagline: {
    marginTop: 12,
    maxWidth: 290,
    fontSize: 15,
    lineHeight: 22.5,
    color: colors.muted,
  },
  loginLink: {
    marginTop: 8,
    height: 48,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  loginLinkText: { fontSize: 15, color: colors.ink },
});
