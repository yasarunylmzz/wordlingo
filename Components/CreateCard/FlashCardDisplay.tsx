import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const FlashCardDisplay: React.FC<{
  flashCard: string;
  onClose: () => void;
}> = ({ flashCard, onClose }) => {
  return (
    <View style={styles.containerTop}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={onClose}>
          <Icon name="arrow-left" size={30} />
        </TouchableOpacity>
        <Text style={styles.appText}>Decks</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Text style={styles.partOfSpeech}>noun</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.editCard}>Edit Card</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.word}>{flashCard}</Text>
        <Text style={styles.example}>
          Orange juice is my favorite drink in the morning.
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Forgot</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.knowButton]}>
            <Text style={[styles.buttonText, styles.knowButtonText]}>Know</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Previous Card</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>1/10</Text>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Next Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerTop: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  appBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    position: "absolute",
    top: 0,
  },
  appText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#133266",
    width: "90%",
    height: "75%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  partOfSpeech: {
    fontSize: 14,
    color: "#888",
    borderWidth: 2,
    borderColor: "#133266",
    borderRadius: 12,
    letterSpacing: 1.4,
    textAlign: "center",
    padding: 2,
  },
  editCard: {
    fontSize: 16,
    color: "#133266",
    fontWeight: "bold",
  },
  word: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#133266",
  },
  example: {
    fontSize: 16,
    color: "#133266",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    borderWidth: 2,
    borderColor: "#133266",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#133266",
    fontWeight: "bold",
  },
  knowButton: {
    backgroundColor: "#ffcccc",
  },
  knowButtonText: {
    color: "#ff6666",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    position: "absolute",
    bottom: 20,
  },
  progress: {
    fontSize: 16,
    color: "#888",
  },
  bottomButton: {
    padding: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#133266",
    width: 130,
    borderRadius: 10,
  },
  bottomButtonText: {
    fontSize: 14,
    color: "#133266",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default FlashCardDisplay;
