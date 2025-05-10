import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { verification } from "../services/userService";
import { useAuthStore } from "../stores/userStore";

const CODE_LENGTH = 6; // tek yerde tanımla

const TwoFactorAuth = () => {
  const navigation = useNavigation();
  const userID = useAuthStore((s) => s.user.id);
  const userEmail = useAuthStore((s) => s.user.email);

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false); // tekrar çağrıyı engelle
  const inputs = useRef<Array<TextInput | null>>([]);

  /* ===== kod değişince otomatik kontrol ===== */
  useEffect(() => {
    const filled = code.every((c) => c !== "");
    if (filled && !isSubmitting) {
      Keyboard.dismiss();
      verifyCode(code.join(""));
    }
  }, [code]);

  /* ===== backend çağrısı ===== */
  const verifyCode = async (finalCode: string) => {
    setIsSubmitting(true);
    try {
      const res = await verification(userID ?? "", userEmail!, finalCode);
      if (res?.status === 202) {
        navigation.navigate("BottomScreen" as never);
      } else {
        Alert.alert("Hata", "Kod doğrulanamadı. Tekrar deneyin.");
        resetInputs();
      }
    } catch (e: any) {
      console.log("Hata:", e);
      Alert.alert("Hata", e?.message ?? "Bilinmeyen bir hata oluştu.");
      resetInputs();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetInputs = () => {
    setCode(Array(CODE_LENGTH).fill(""));
    inputs.current[0]?.focus();
  };

  /* ===== input kontrolleri ===== */
  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.replace(/[^0-9]/g, ""); // sadece rakam
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && code[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  /* ======== UI ======== */
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
          {code.map((val, idx) => (
            <TextInput
              key={idx}
              ref={(ref) => (inputs.current[idx] = ref)}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              value={val}
              onChangeText={(t) => handleChange(t, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              autoFocus={idx === 0}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

/* ========= Styles ========= */
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
  halfCircle: { transform: [{ rotate: "90deg" }] },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  textContainer: { width: "100%", marginBottom: 20, alignItems: "flex-start" },
  title: { fontSize: 32, fontWeight: "bold", color: "#333" },
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
