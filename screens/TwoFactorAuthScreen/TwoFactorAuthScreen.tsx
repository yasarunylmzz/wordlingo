import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Keyboard, Alert } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { verification } from "../../services/userService";
import { useAuthStore } from "../../stores/userStore";
import CodeInput from "./components/CodeInput";

const CODE_LENGTH = 6;

const TwoFactorAuthScreen = () => {
  const navigation = useNavigation();
  const userID = useAuthStore((s) => s.user.id);
  const userEmail = useAuthStore((s) => s.user.email);

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const filled = code.every((c) => c !== "");
    if (filled && !isSubmitting) {
      Keyboard.dismiss();
      verifyCode(code.join(""));
    }
  }, [code]);

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
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your email
          </Text>
        </View>

        <CodeInput
          code={code}
          setCode={setCode}
          codeLength={CODE_LENGTH}
          isSubmitting={isSubmitting}
        />
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
    padding: 20,
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
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});

export default TwoFactorAuthScreen;
