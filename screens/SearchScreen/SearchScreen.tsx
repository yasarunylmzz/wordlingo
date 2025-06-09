import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { fetchWordDefinition } from "../../api/dictionaryAPI";
import { DictionaryResponse } from "../../types/dictionary";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";

type SearchScreenProps = {};
type SoundType = Audio.Sound | null;

const SearchScreen: React.FC<SearchScreenProps> = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [wordData, setWordData] = useState<DictionaryResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sound, setSound] = useState<SoundType>(null);

  const capitalizeFirstLetter = (word: string): string => {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const playSound = async (audioUrl: string) => {
    console.log("Audio URL:", audioUrl);
    if (sound) {
      await sound.unloadAsync();
      console.log("Previous sound unloaded");
    }
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioUrl,
    });
    setSound(newSound);
    await newSound.playAsync();
    console.log("Playing sound");
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
          console.log("Sound unloaded on component unmount");
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const handleSearch = async () => {
      console.log("Search query:", searchQuery);
      if (searchQuery.trim() === "") {
        setWordData(null);
        console.log("Search query is empty, word data reset");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching word definition...");
        const result = await fetchWordDefinition(searchQuery.trim());
        console.log("Fetch result:", result);
        setWordData(result.slice(0, 10));
      } catch (err) {
        console.error("Error fetching word details:", err);
        setError("Check word and try again");
        setWordData(null);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.topText}>Dictionary</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search for a word..."
          mode="outlined"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => {
            console.log("Search query updated:", text);
            setSearchQuery(text);
          }}
          theme={{
            colors: {
              primary: "#6A5ACD",
              background: "#fff",
            },
          }}
          outlineColor="transparent"
          activeOutlineColor="#6A5ACD"
          left={<TextInput.Icon icon="magnify" color="#6A5ACD" />}
          clearButtonMode="while-editing"
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5ACD" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={24} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {wordData && (
        <FlatList
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
          data={wordData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const validPhonetics = item.phonetics.filter(
              (phonetic) => phonetic.text || phonetic.audio
            );

            return (
              <View style={styles.wordContainer}>
                <View style={styles.wordHeaderContainer}>
                  <Text style={styles.wordTitle}>
                    {capitalizeFirstLetter(item.word)}
                  </Text>

                  {validPhonetics.length > 0 && validPhonetics[0].audio && (
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={() =>
                        validPhonetics[0].audio &&
                        playSound(validPhonetics[0].audio)
                      }
                    >
                      <MaterialIcons
                        name="volume-up"
                        size={24}
                        color="#6A5ACD"
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Phonetics display */}
                {validPhonetics.length > 0 && (
                  <Text style={styles.phoneticText}>
                    {validPhonetics[0].text || ""}
                  </Text>
                )}

                <View style={styles.divider} />

                {item.meanings.map((meaning, meaningIndex) => (
                  <View key={meaningIndex} style={styles.meaningContainer}>
                    <View style={styles.partOfSpeechContainer}>
                      <Text style={styles.partOfSpeech}>
                        {capitalizeFirstLetter(meaning.partOfSpeech)}
                      </Text>
                    </View>

                    {meaning.definitions.map((definition, defIndex) => (
                      <View key={defIndex} style={styles.definitionContainer}>
                        <View style={styles.bulletPoint} />
                        <View style={styles.definitionContent}>
                          <Text style={styles.definitionText}>
                            {definition.definition}
                          </Text>
                          {definition.example && (
                            <Text style={styles.exampleText}>
                              "{definition.example}"
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}

      {!loading && !error && !wordData && (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="search" size={64} color="#E0E0E0" />
          <Text style={styles.emptyStateText}>
            Type a word to get its definition
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8F8FC",
  },
  topText: {
    width: "90%",
    fontSize: 28,
    fontWeight: "bold",
    color: "#6A5ACD",
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    width: "90%",
    marginBottom: 20,
  },
  searchInput: {
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE8E8",
    padding: 16,
    borderRadius: 8,
    marginVertical: 20,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    marginLeft: 8,
  },
  flatList: {
    width: "90%",
  },
  wordContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#6A5ACD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  wordHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  wordTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  phoneticContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  phoneticText: {
    fontSize: 18,
    color: "#777777",
    fontStyle: "italic",
    marginBottom: 12,
  },
  playButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0EEFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 12,
  },
  meaningContainer: {
    marginTop: 16,
  },
  partOfSpeechContainer: {
    marginBottom: 12,
  },
  partOfSpeech: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6A5ACD",
    textTransform: "capitalize",
  },
  definitionContainer: {
    flexDirection: "row",
    marginBottom: 14,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6A5ACD",
    marginTop: 8,
    marginRight: 12,
  },
  definitionContent: {
    flex: 1,
  },
  definitionText: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 22,
  },
  exampleText: {
    fontSize: 15,
    color: "#777777",
    fontStyle: "italic",
    marginTop: 6,
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    color: "#999999",
    textAlign: "center",
  },
});

export default SearchScreen;
