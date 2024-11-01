import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface FlashCardProps {
  flashCards: string[];
}

const FlashCard: React.FC<FlashCardProps> = ({ flashCards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learnedCards, setLearnedCards] = useState<string[]>([]);
  const [forgottenCards, setForgottenCards] = useState<string[]>([]);

  const handleLearn = () => {
    setLearnedCards([...learnedCards, flashCards[currentIndex]]);
    nextCard();
  };

  const handleForget = () => {
    setForgottenCards([...forgottenCards, flashCards[currentIndex]]);
    nextCard();
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashCards.length);
  };

  return (
    <View style={styles.container}>
      <Text>{flashCards[currentIndex]}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Learn" onPress={handleLearn} />
        <Button title="Forget" onPress={handleForget} />
      </View>
      <View>
        <Text style={styles.learned}>Learned: {learnedCards.length}</Text>
        <Text style={styles.forgotten}>Forgotten: {forgottenCards.length}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  buttonContainer: { flexDirection: "row", marginTop: 20 },
  learned: { color: "green" },
  forgotten: { color: "red" },
});

export default FlashCard;
