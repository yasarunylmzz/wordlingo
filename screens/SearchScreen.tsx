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
import { fetchWordDefinition } from "../api/dictionaryAPI";
import { DictionaryResponse } from "../types/dictionary";
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
        setError("check word and try again");
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
      <Text style={styles.topText}>Search Screen</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          mode="outlined"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => {
            console.log("Search query updated:", text);
            setSearchQuery(text);
          }}
          theme={{
            colors: {
              primary: "#133266",
              background: "#fff",
            },
          }}
          outlineColor="transparent"
          activeOutlineColor="transparent"
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#133266" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

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
                <Text style={styles.wordTitle}>
                  {capitalizeFirstLetter(item.word)}
                </Text>

                {/* Sadece dolu phonetics öğelerini gösterin */}
                {validPhonetics.length > 0 &&
                  validPhonetics.map((phonetic, phoneticIndex) => (
                    <View key={phoneticIndex} style={styles.phoneticContainer}>
                      <Text style={styles.phoneticText}>
                        {phonetic.text || ""}
                      </Text>
                      {phonetic.audio && (
                        <TouchableOpacity
                          style={styles.playButton}
                          onPress={() =>
                            phonetic.audio && playSound(phonetic.audio)
                          }
                        >
                          <MaterialIcons
                            name="play-arrow"
                            size={24}
                            color="#133266"
                          />
                          <Text style={styles.playButtonText}>Play</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                {item.meanings.map((meaning, meaningIndex) => (
                  <View key={meaningIndex} style={styles.meaningContainer}>
                    <Text style={styles.partOfSpeech}>
                      {capitalizeFirstLetter(meaning.partOfSpeech)}
                    </Text>
                    {meaning.definitions.map((definition, defIndex) => (
                      <View key={defIndex} style={styles.definitionContainer}>
                        <Text style={styles.text2}>
                          {definition.definition}
                        </Text>
                        {definition.example && (
                          <Text style={styles.exampleText}>
                            Example: {definition.example}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9fb",
  },
  topText: {
    width: "90%",
    fontSize: 24,
    fontWeight: "bold",
    color: "#4f24d8",
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    backgroundColor: "transparent",
  },
  flatList: {
    width: "90%",
  },
  wordContainer: {
    backgroundColor: "#fff",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#4f24d8",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  wordTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  phoneticContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  phoneticText: {
    fontSize: 18,
    color: "#575757",
    fontStyle: "italic",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  playButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: "black",
  },
  meaningContainer: {
    marginTop: 10,
  },
  partOfSpeech: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  definitionContainer: {
    marginVertical: 6,
  },
  text2: {
    fontSize: 16,
    color: "#333",
  },
  exampleText: {
    fontSize: 15,
    color: "#4f24d8",
    fontStyle: "italic",
    marginTop: 2,
  },
  errorText: {
    color: "red",
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchScreen;
