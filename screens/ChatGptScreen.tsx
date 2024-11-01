import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import SendIcon from "../svg/SendIcon";

const ChatGptScreen = () => {
  const words = `\n\n1- Hello - Merhaba\n\n1- Goodbye - Hoşçakal\n\n1- Book - Kitap\n\n1- Table - Masa`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <Text style={styles.appBar}>AI Assistant</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.row}>
          <View style={[styles.container1, { alignSelf: "flex-end" }]}>
            <Text style={styles.text}>
              Hello Ai, can you produce 20 words in English and Turkish for me?
            </Text>
            <Image
              source={require("../assets/robot.png")}
              style={styles.robotImage2}
            />
          </View>
          <View style={[styles.container2, { alignSelf: "flex-start" }]}>
            <Text style={styles.text}>
              Sure, here are 20 words in English and their Turkish translations:
              {words}
            </Text>
            <Image
              source={require("../assets/robot.png")}
              style={styles.robotImage}
            />
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ marginBottom: 50 }}
      >
        <View style={styles.chatBox}>
          <TextInput
            style={styles.input}
            placeholder="Hello AI Assistant"
            placeholderTextColor="#3369FF"
          />
          <TouchableOpacity>
            <SendIcon />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  appBar: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
    color: "#12175E",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 10,
  },
  container1: {
    width: "90%",
    backgroundColor: "#3369FF",
    padding: 5,
    marginTop: 25,
    marginBottom: 10,
    marginRight: 20,
    alignSelf: "flex-end",
    borderTopStartRadius: 12,
    borderBottomStartRadius: 12,
    borderBottomEndRadius: 12,
    position: "relative", // Mutlaka relative olmalı
  },
  container2: {
    width: "90%",
    borderTopEndRadius: 12,
    borderTopStartRadius: 12,
    borderBottomEndRadius: 12,
    backgroundColor: "#505050",
    padding: 7,
    marginBottom: 10,
    marginLeft: 25,
    alignSelf: "flex-start",
    position: "relative", // Mutlaka relative olmalı
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  robotImage: {
    position: "absolute",
    bottom: -35,
    width: 30,
    height: 30,
    left: -27,
  },
  robotImage2: {
    position: "absolute",
    width: 30,
    height: 30,
    right: -20,
    top: -35,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    color: "#3369FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  chatBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    borderWidth: 0.5,
    padding: 10,
    borderColor: "#3369FF",
    borderRadius: 20,
  },
});

export default ChatGptScreen;
