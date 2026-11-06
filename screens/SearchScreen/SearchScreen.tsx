import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowRight,
  LoaderCircle,
  Search,
  Volume2,
  X,
} from "lucide-react-native";
import { fetchWordDefinition } from "../../api/dictionaryAPI";
import { DictionaryResponse } from "../../types/dictionary";
import { useAudioPlayer } from "expo-audio";
import { usePrefsStore } from "../../stores/prefsStore";
import AppText from "../../Components/ui/AppText";
import { colors, fonts, radii, space } from "../../theme/theme";

const partLabels: Record<string, string> = {
  noun: "isim",
  verb: "fiil",
  adjective: "sıfat",
  adverb: "zarf",
  pronoun: "zamir",
  preposition: "edat",
  conjunction: "bağlaç",
  interjection: "ünlem",
};

const wordsOfTheDay = [
  "ephemeral",
  "serendipity",
  "resilient",
  "meticulous",
  "eloquent",
  "candid",
  "wander",
];

type SearchScreenProps = {};

const SearchScreen: React.FC<SearchScreenProps> = () => {
  const [query, setQuery] = useState("");
  const [wordData, setWordData] = useState<DictionaryResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorWord, setErrorWord] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);
  const player = useAudioPlayer(null);

  const recent = usePrefsStore((s) => s.recentSearches);
  const addRecentSearch = usePrefsStore((s) => s.addRecentSearch);
  const clearRecentSearches = usePrefsStore((s) => s.clearRecentSearches);

  const wordOfTheDay =
    wordsOfTheDay[new Date().getDate() % wordsOfTheDay.length];

  const playSound = (audioUrl: string) => {
    player.replace({ uri: audioUrl });
    player.play();
  };

  const lookup = async (raw: string) => {
    const word = raw.trim().toLowerCase();
    if (!word) return;
    setQuery(word);
    setLoading(true);
    setErrorWord(null);
    setWordData(null);
    try {
      const result = await fetchWordDefinition(word);
      setWordData(result.slice(0, 10));
      addRecentSearch(word);
    } catch {
      setErrorWord(word);
      setWordData(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setQuery("");
    setWordData(null);
    setErrorWord(null);
    inputRef.current?.focus();
  };

  const idle = !loading && !errorWord && !wordData;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText weight="semibold" style={styles.topText}>
            Sözlük
          </AppText>
          <AppText style={styles.sub}>İngilizce kelimelerin anlamları</AppText>
        </View>

        <View style={styles.searchRow}>
          <Search size={18} color={colors.muted} />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Bir kelime ara"
            placeholderTextColor="rgba(111,109,123,0.7)"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="search"
            onSubmitEditing={() => lookup(query)}
            style={styles.input}
          />
          {!!query && (
            <Pressable
              accessibilityLabel="Temizle"
              onPress={clear}
              style={styles.clearBtn}
            >
              <X size={16} color={colors.muted} />
            </Pressable>
          )}
          <Pressable
            disabled={!query.trim()}
            onPress={() => lookup(query)}
            style={[styles.searchBtn, !query.trim() && styles.searchBtnOff]}
          >
            <AppText
              weight="semibold"
              style={[
                styles.searchBtnText,
                !query.trim() && { color: colors.muted },
              ]}
            >
              Ara
            </AppText>
          </Pressable>
        </View>

        <View style={styles.body}>
          {idle && (
            <View style={styles.idle}>
              <Pressable
                onPress={() => lookup(wordOfTheDay)}
                style={styles.wotd}
              >
                <AppText weight="mono" style={styles.wotdLabel}>
                  Günün kelimesi
                </AppText>
                <AppText weight="semibold" style={styles.wotdWord}>
                  {wordOfTheDay}
                </AppText>
                <View style={styles.wotdCta}>
                  <AppText weight="medium" style={styles.wotdCtaText}>
                    Anlamını gör
                  </AppText>
                  <ArrowRight size={14} color={colors.accent} />
                </View>
              </Pressable>

              {recent.length > 0 && (
                <View style={styles.recent}>
                  <View style={styles.recentHeader}>
                    <AppText style={styles.recentTitle}>Son aramalar</AppText>
                    <Pressable onPress={clearRecentSearches}>
                      <AppText weight="medium" style={styles.recentClear}>
                        Temizle
                      </AppText>
                    </Pressable>
                  </View>
                  <View style={styles.chips}>
                    {recent.map((w) => (
                      <Pressable
                        key={w}
                        onPress={() => lookup(w)}
                        style={styles.chip}
                      >
                        <AppText style={styles.chipText}>{w}</AppText>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.accent} />
              <LoaderCircle size={16} color={colors.accent} />
              <AppText style={styles.loadingText}>
                “{query}” aranıyor
              </AppText>
            </View>
          )}

          {errorWord && (
            <View>
              <AppText weight="semibold" style={styles.errorTitle}>
                “{errorWord}” bulunamadı
              </AppText>
              <AppText style={styles.errorText}>
                Yazımı kontrol et ya da kelimenin yalın halini dene.
              </AppText>
            </View>
          )}

          {wordData &&
            wordData.map((entry, ei) => {
              const phonetic = entry.phonetics.find((p) => p.text)?.text;
              const audio = entry.phonetics.find((p) => p.audio)?.audio;
              const meaningSynonyms = (m: (typeof entry.meanings)[number]) =>
                (m as { synonyms?: string[] }).synonyms ?? [];
              return (
                <View key={ei} style={styles.entry}>
                  <View style={styles.entryHeader}>
                    <View style={{ flex: 1 }}>
                      <AppText weight="semibold" style={styles.wordTitle}>
                        {entry.word}
                      </AppText>
                      {!!phonetic && (
                        <AppText weight="mono" style={styles.phonetic}>
                          {phonetic}
                        </AppText>
                      )}
                    </View>
                    {!!audio && (
                      <Pressable
                        accessibilityLabel="Telaffuzu dinle"
                        onPress={() => playSound(audio)}
                        style={styles.audioBtn}
                      >
                        <Volume2 size={19} color={colors.accent} />
                      </Pressable>
                    )}
                  </View>

                  {entry.meanings.map((m, mi) => (
                    <View key={mi} style={styles.meaning}>
                      <AppText weight="mono" style={styles.pos}>
                        {partLabels[m.partOfSpeech] ?? m.partOfSpeech}
                      </AppText>
                      {m.definitions.slice(0, 4).map((d, di) => (
                        <View key={di} style={styles.defRow}>
                          <AppText style={styles.defNum}>{di + 1}</AppText>
                          <View style={{ flex: 1 }}>
                            <AppText style={styles.defText}>
                              {d.definition}
                            </AppText>
                            {!!d.example && (
                              <AppText style={styles.example}>
                                “{d.example}”
                              </AppText>
                            )}
                          </View>
                        </View>
                      ))}
                      {meaningSynonyms(m).length > 0 && (
                        <View style={styles.synRow}>
                          <AppText style={styles.synLabel}>Eş anlamlı</AppText>
                          {meaningSynonyms(m).slice(0, 5).map((s) => (
                            <Pressable
                              key={s}
                              onPress={() => lookup(s)}
                              style={styles.synChip}
                            >
                              <AppText style={styles.synText}>{s}</AppText>
                            </Pressable>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingBottom: 120 },
  header: { paddingHorizontal: space[5], paddingTop: space[3] },
  topText: {
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: -1.05,
  },
  sub: { marginTop: 8, fontSize: 13, color: colors.muted },
  searchRow: {
    marginTop: space[5],
    marginHorizontal: space[4],
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingLeft: space[4],
    paddingRight: 6,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.ink,
  },
  clearBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtn: {
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnOff: { backgroundColor: colors.paper },
  searchBtnText: { fontSize: 13, color: colors.white },
  body: { marginTop: 28, paddingHorizontal: space[5] },
  idle: { gap: 32 },
  wotd: {
    borderRadius: radii["2xl"],
    backgroundColor: colors.accentSoft,
    padding: space[5],
  },
  wotdLabel: {
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: "uppercase",
    color: "rgba(79,64,216,0.7)",
  },
  wotdWord: {
    marginTop: 12,
    fontSize: 30,
    letterSpacing: -0.9,
    color: colors.accentDeep,
  },
  wotdCta: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  wotdCtaText: { fontSize: 13, color: colors.accent },
  recent: { paddingHorizontal: 4 },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recentTitle: { fontSize: 13, color: colors.muted },
  recentClear: { fontSize: 13, color: colors.accent },
  chips: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: { fontSize: 14 },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: { fontSize: 14, color: colors.muted },
  errorTitle: { fontSize: 16 },
  errorText: { marginTop: 4, fontSize: 14, color: colors.muted },
  entry: { paddingHorizontal: 4 },
  entryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  wordTitle: {
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1.19,
  },
  phonetic: {
    marginTop: 8,
    fontSize: 14,
    color: colors.accent,
  },
  audioBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  meaning: {
    marginTop: 24,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.line,
    paddingTop: space[5],
  },
  pos: {
    fontSize: 11,
    letterSpacing: 1.54,
    textTransform: "uppercase",
    color: colors.muted,
  },
  defRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
  },
  defNum: {
    width: 16,
    paddingTop: 2,
    fontSize: 13,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  defText: { fontSize: 15, lineHeight: 22 },
  example: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  synRow: {
    marginTop: 16,
    paddingLeft: 28,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  synLabel: { marginRight: 4, fontSize: 12, color: colors.muted },
  synChip: {
    borderRadius: radii.full,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  synText: { fontSize: 13, color: colors.accentDeep },
});

export default SearchScreen;
