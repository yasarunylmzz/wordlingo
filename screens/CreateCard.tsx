import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert, // Alert ekledik
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Navigation hook
import LeftArrow from "../svg/LeftArrow"; // Geri ok simgesi

const CreateCard = () => {
  const [deckName, setDeckName] = useState("");
  const navigation = useNavigation(); // Navigation hook'u

  const handleGoBack = () => {
    navigation.goBack(); // Geri gitme işlevi
  };

  const handleSave = () => {
    if (deckName.trim() === "") {
      Alert.alert("Error", "Deck name cannot be empty");
    } else {
      // Burada save işlemi yapabilirsin, örneğin deck adıyla bir şeyler yap
      Alert.alert("Success", `Deck "${deckName}" has been saved`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <LeftArrow />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Create Deck</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Deck</Text>

          {/* Input kısmını tam ortalayalım */}
          <TextInput
            style={styles.input}
            placeholder="Enter Deck Name"
            value={deckName}
            onChangeText={setDeckName}
          />

          {/* Eğer deckName varsa, bir Save butonu göster */}
          {deckName ? (
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Deck</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  appBar: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    elevation: 3, // Hafif gölgeleme
  },
  backButton: {
    padding: 10,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center", // Kartı dikeyde ortalar
    alignItems: "center", // Kartı yatayda ortalar
    paddingHorizontal: 20, // Ekran kenarlarında boşluk bırakır
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  deckName: {
    fontSize: 18,
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#6200EE", // Buton rengi
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateCard;
