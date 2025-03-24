import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const LearnScreen = () => {
  const navigation = useNavigation();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userDefinition, setUserDefinition] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const questions = [
    {
      term: "Computer",
      turkishTerm: "Bilgisayar",
      options: ["Bilgisayar", "Telefon", "Televizyon", "Klavye"],
      correctAnswer: 0,
      requiresDefinition: false,
    },
    {
      term: "Window",
      turkishTerm: "Pencere",
      requiresDefinition: true,
    },
    {
      term: "Book",
      turkishTerm: "Kitap",
      options: ["Kalem", "Kağıt", "Kitap", "Defter"],
      correctAnswer: 2,
      requiresDefinition: false,
    },
    {
      term: "House",
      turkishTerm: "Ev",
      requiresDefinition: true,
    },
    {
      term: "Water",
      turkishTerm: "Su",
      options: ["Ateş", "Su", "Hava", "Toprak"],
      correctAnswer: 1,
      requiresDefinition: false,
    },
  ];

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      resetStates();
    } else {
      setQuizCompleted(true);
    }
  };

  const checkAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setAnswerChecked(true);
  };

  const resetStates = () => {
    setSelectedAnswer(null);
    setUserDefinition("");
    setShowAnswer(false);
    setAnswerChecked(false);
  };

  const getOptionStyle = (index) => {
    if (!answerChecked) {
      return {
        ...styles.optionButton,
        borderColor: selectedAnswer === index ? "#3498db" : "#e0e0e0",
        backgroundColor: selectedAnswer === index ? "#edf7fd" : "#f8f9fa",
      };
    }

    const isCorrect = index === questions[currentQuestion].correctAnswer;
    const isSelected = index === selectedAnswer;

    return {
      ...styles.optionButton,
      borderColor: isCorrect ? "#2ecc71" : isSelected ? "#e74c3c" : "#e0e0e0",
      backgroundColor: isCorrect
        ? "#e8f6f3"
        : isSelected && !isCorrect
        ? "#fdedec"
        : "#f8f9fa",
    };
  };

  const exitQuiz = () => {
    navigation.goBack();
  };

  if (quizCompleted) {
    const accuracy = (correctAnswers / questions.length) * 100;

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={exitQuiz}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>English-Turkish</Text>
            <Text style={styles.headerSubtitle}>Learn Mode</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.completionCard}>
            <Text style={styles.completionTitle}>Çalışma Tamamlandı!</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{questions.length}</Text>
                <Text style={styles.statLabel}>Toplam Soru</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{correctAnswers}</Text>
                <Text style={styles.statLabel}>Doğru Cevap</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{accuracy.toFixed(0)}%</Text>
                <Text style={styles.statLabel}>Doğruluk</Text>
              </View>
            </View>

            <Text style={styles.feedbackText}>
              {accuracy >= 80
                ? "Harika iş çıkardın! İngilizce kelime bilgin çok iyi."
                : accuracy >= 60
                ? "İyi iş çıkardın. Biraz daha pratik yaparak daha da gelişebilirsin."
                : "Bu kelimeleri biraz daha çalışman gerekiyor. Tekrar dene!"}
            </Text>

            <TouchableOpacity style={styles.exitButton} onPress={exitQuiz}>
              <Text style={styles.buttonText}>Çıkış</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={exitQuiz}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>English-Turkish</Text>
          <Text style={styles.headerSubtitle}>Learn Mode</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentQuestion + 1} / {questions.length}
          </Text>
          <Text style={styles.accuracyText}>
            {currentQuestion > 0
              ? `${Math.round(
                  (correctAnswers / currentQuestion) * 100
                )}% doğruluk`
              : "0% doğruluk"}
          </Text>
        </View>

        {/* Question Card */}
        {!questions[currentQuestion].requiresDefinition && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Bu İngilizce kelimenin Türkçe karşılığı nedir?
            </Text>
            <Text style={styles.term}>{questions[currentQuestion].term}</Text>

            {/* Multiple Choice Options */}
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={getOptionStyle(index)}
                onPress={() => !answerChecked && setSelectedAnswer(index)}
                disabled={answerChecked}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

            {/* Check Answer Button or Next Question Button */}
            <TouchableOpacity
              style={[
                styles.checkButton,
                { opacity: selectedAnswer !== null || answerChecked ? 1 : 0.7 },
              ]}
              onPress={() => {
                if (!answerChecked) {
                  checkAnswer();
                } else {
                  handleNextQuestion();
                }
              }}
              disabled={selectedAnswer === null && !answerChecked}
            >
              <Text style={styles.buttonText}>
                {answerChecked ? "Sonraki Soru" : "Cevabı Kontrol Et"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Definition Card */}
        {questions[currentQuestion].requiresDefinition && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Bu İngilizce kelimenin Türkçe karşılığını yazın:
            </Text>
            <Text style={styles.term}>{questions[currentQuestion].term}</Text>

            <TextInput
              style={styles.definitionInput}
              placeholder="Türkçe karşılığını yazın"
              value={userDefinition}
              onChangeText={setUserDefinition}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#3498db" }]}
                onPress={() => setShowAnswer(!showAnswer)}
              >
                <Text style={styles.buttonText}>
                  {showAnswer ? "Cevabı Gizle" : "Cevabı Göster"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: "#2ecc71",
                    opacity: userDefinition.trim() ? 1 : 0.7,
                  },
                ]}
                onPress={() => {
                  // Consider it correct if they wrote the correct answer
                  if (
                    userDefinition.trim().toLowerCase() ===
                    questions[currentQuestion].turkishTerm.toLowerCase()
                  ) {
                    setCorrectAnswers((prev) => prev + 1);
                  }
                  handleNextQuestion();
                }}
                disabled={!userDefinition.trim()}
              >
                <Text style={styles.buttonText}>Sonrakine Geç</Text>
              </TouchableOpacity>
            </View>

            {showAnswer && (
              <View style={styles.answerBox}>
                <Text style={styles.correctAnswer}>
                  Doğru Cevap: {questions[currentQuestion].turkishTerm}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "right",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
    alignItems: "center", // Tüm içeriği ortala
  },

  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "90%", // Sabit genişlik
  },
  progressText: {
    color: "#3498db",
    fontWeight: "bold",
  },
  accuracyText: {
    color: "#95a5a6",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: "90%", // Sabit genişlik
    alignSelf: "center", // Ortalama
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  term: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 24,
    textAlign: "center",
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 8,
    width: "100%", // Tam genişlik
  },
  optionText: {
    color: "#2c3e50",
    fontSize: 16,
    textAlign: "center", // Metni ortala
  },
  checkButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    width: "100%", // Tam genişlik
  },

  // Tanım input stil güncellemesi
  definitionInput: {
    height: 56,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center", // Metni ortala
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  answerBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  correctAnswer: {
    color: "#2ecc71",
    fontWeight: "500",
    fontSize: 16,
  },
  // Completion screen styles
  completionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  feedbackText: {
    fontSize: 16,
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  exitButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default LearnScreen;
