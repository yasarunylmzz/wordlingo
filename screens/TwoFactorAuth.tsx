import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const TwoFactorAuth = () => {
  const [code, setCode] = useState<string[]>(new Array(6).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);
  const Navigator = useNavigation();

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every((num) => num !== "")) {
      Keyboard.dismiss();
      Navigator.navigate("BottomScreen"); // Navigate to the Home screen when all inputs are filled
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    if (code.join("").length === 4) {
      // Doğrulama işlemi
    } else {
      // Hata durumu
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.halfCircleContainer}>
        <Svg
          height="50"
          width="100"
          viewBox="0 0 100 50"
          style={styles.halfCircle}
        >
          <Path d="M 0 50 A 50 50 0 0 1 100 50" fill="#5B67CA" />
        </Svg>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Hey,</Text>
          <Text style={styles.title}>Login Now.</Text>
        </View>
        <View style={styles.codeContainer}>
          {code.map((value, index) => (
            <TextInput
              key={index}
              style={[
                styles.input,
                focusedIndex === index && { backgroundColor: "#D1C4E9" },
              ]}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              ref={(ref) => (inputs.current[index] = ref)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  halfCircleContainer: {
    position: "absolute",
    top: 75,
    left: 0,
    width: "100%",
    height: 50,
  },
  halfCircle: {
    transform: [{ rotate: "90deg" }],
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  textContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 40,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: 50,
    textAlign: "center",
    fontSize: 24,
    color: "#333",
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
});

export default TwoFactorAuth;
