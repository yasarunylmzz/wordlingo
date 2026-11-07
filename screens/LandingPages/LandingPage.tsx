import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  LayoutChangeEvent,
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
/** Matches prototype `LENS_INSET = "17%"`. */
const LENS_INSET = 0.17;

function useReduceMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) setReduce(!!v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduce,
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);
  return reduce;
}

function MarqueeWords({
  words,
  color,
}: {
  words: string[];
  color: string;
}) {
  return (
    <>
      {[...words, ...words].map((w, i) => (
        <AppText
          key={`${w}-${i}`}
          weight="semibold"
          style={[styles.marqueeWord, { color }]}
        >
          {w}
        </AppText>
      ))}
    </>
  );
}

/**
 * Single-track marquee (non-lens rows).
 * Animates translateX 0 → -50% of measured content (duplicated words), like CSS.
 */
function MarqueeRow({
  words,
  duration,
  reverse,
  color,
  reduceMotion,
}: {
  words: string[];
  duration: number;
  reverse?: boolean;
  color: string;
  reduceMotion: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [halfWidth, setHalfWidth] = useState(0);

  useEffect(() => {
    anim.stopAnimation();
    anim.setValue(0);
    if (reduceMotion || halfWidth <= 0) return;

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
  }, [anim, duration, halfWidth, reduceMotion]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? [-halfWidth, 0] : [0, -halfWidth],
  });

  return (
    <View style={styles.marqueeClip} pointerEvents="none">
      <Animated.View
        style={[styles.marqueeTrack, { transform: [{ translateX }] }]}
        onLayout={(e: LayoutChangeEvent) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0) setHalfWidth(w / 2);
        }}
      >
        <MarqueeWords words={words} color={color} />
      </Animated.View>
    </View>
  );
}

/**
 * Highlight row: white lens + faded outer marquee + accent duplicate clipped to lens.
 * Prototype uses one CSS animation + `clip-path: inset(0 17% round 18px)` on a
 * full-width overlay. RN equivalent: shared Animated.Value; clip view inset 17%;
 * accent track shifted left by `lensLeft` so glyphs stay pixel-synced with the outer row.
 */
function LensMarqueeRow({
  words,
  duration,
  reverse,
  reduceMotion,
}: {
  words: string[];
  duration: number;
  reverse?: boolean;
  reduceMotion: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const [rowWidth, setRowWidth] = useState(0);
  const [halfWidth, setHalfWidth] = useState(0);

  const lensLeft = rowWidth * LENS_INSET;

  useEffect(() => {
    anim.stopAnimation();
    anim.setValue(0);
    if (reduceMotion || halfWidth <= 0) return;

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
  }, [anim, duration, halfWidth, reduceMotion]);

  const translateX = useMemo(
    () =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: reverse ? [-halfWidth, 0] : [0, -halfWidth],
      }),
    [anim, halfWidth, reverse],
  );

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setHalfWidth(w / 2);
  };

  return (
    <View
      style={styles.lensRow}
      onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
      pointerEvents="none"
    >
      {/* White lens plate */}
      <View style={styles.lens} />

      {/* Outer faded row — full width */}
      <View style={styles.marqueeClip}>
        <Animated.View
          style={[styles.marqueeTrack, { transform: [{ translateX }] }]}
          onLayout={onTrackLayout}
        >
          <MarqueeWords words={words} color="rgba(255,255,255,0.4)" />
        </Animated.View>
      </View>

      {/* Accent duplicate: clipped to lens; track offset by -lensLeft so it
          shares the same coordinate space as the outer row (prototype clip-path). */}
      {rowWidth > 0 && (
        <View style={[styles.lensClip, { left: lensLeft, right: lensLeft }]}>
          <Animated.View
            style={[
              styles.marqueeTrack,
              {
                // Pull content back so x=0 matches the parent row, not the clip.
                marginLeft: -lensLeft,
                transform: [{ translateX }],
              },
            ]}
          >
            <MarqueeWords words={words} color={colors.accent} />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

function WordHero() {
  const reduceMotion = useReduceMotion();

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
            <LensMarqueeRow
              key={i}
              {...row}
              reverse={i % 2 === 1}
              reduceMotion={reduceMotion}
            />
          ) : (
            <MarqueeRow
              key={i}
              {...row}
              reverse={i % 2 === 1}
              reduceMotion={reduceMotion}
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
    alignSelf: "flex-start",
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
    left: `${LENS_INSET * 100}%`,
    right: `${LENS_INSET * 100}%`,
    borderRadius: 18,
    backgroundColor: colors.white,
    shadowColor: "#140c5a",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },
  lensClip: {
    position: "absolute",
    top: 0,
    bottom: 0,
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
