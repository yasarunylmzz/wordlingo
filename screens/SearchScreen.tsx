import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { fetchWordDefinition } from "../api/dictionaryAPI";
import { DictionaryResponse } from "../types/dictionary";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [wordData, setWordData] = useState<DictionaryResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capitalizeFirstLetter = (word: string): string => {
    if (!word) return ""; // Boş string kontrolü
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  // Search query değiştikçe API isteği at
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim() === "") {
        setWordData(null); // Boş arama sorgusunda sonuçları sıfırla
        return;
      }
      setLoading(true);
      setError(null); // Hata durumunu sıfırla
      try {
        const result = await fetchWordDefinition(searchQuery.trim()); // Arama sorgusu
        setWordData(result.slice(0, 10)); // Sadece 5 sonuç göster
      } catch (err) {
        setError("Error fetching word details.");
        setWordData(null);
      } finally {
        setLoading(false);
      }
    };

    // Kullanıcının yazmayı durdurmasından sonra kısa bir bekleme süresi ekleyelim
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms bekleyerek gereksiz API isteklerini önle

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
          onChangeText={setSearchQuery}
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
      {/* Yüklenme spinnerı */}

      {error && <Text style={styles.errorText}>{error}</Text>}
      {/* Hata mesajı */}

      {wordData && (
        <FlatList
          style={styles.flatList}
          showsVerticalScrollIndicator={false}
          data={wordData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.wordContainer}>
              <View style={styles.wordContainerText}>
                <View style={styles.bigText}>
                  <Text style={styles.text1}>
                    {capitalizeFirstLetter(item.word)}
                  </Text>
                  <Text style={styles.type}>
                    {item.meanings[0]?.partOfSpeech || "N/A"}
                  </Text>
                </View>
                <Text style={styles.text2}>
                  {item.meanings[0]?.definitions[0]?.definition ||
                    "No definition available"}
                </Text>
                <Text style={styles.paragraph}>
                  {item.meanings[0]?.definitions[0]?.example ||
                    "No example available"}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topText: {
    width: "90%",
    fontSize: 28,
    fontWeight: "bold",
    color: "#133266",
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
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
    borderColor: "#133266",
    borderWidth: 4,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    justifyContent: "center",
    shadowColor: "#133266",
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 5,
  },
  wordContainerText: {
    gap: 4,
  },
  text1: {
    fontSize: 22,
    fontWeight: "bold",
  },
  text2: {
    fontSize: 16,
    color: "#575757",
  },
  bigText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  type: {
    fontSize: 12,
    color: "#000",
    borderWidth: 2,
    borderColor: "#133266",
    borderRadius: 12,
    letterSpacing: 1.5,
    textAlign: "center",
    fontWeight: "bold",
    padding: 2,
  },
  paragraph: {
    width: "85%",
    fontSize: 14,
    color: "#133266",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
});

export default SearchScreen;
