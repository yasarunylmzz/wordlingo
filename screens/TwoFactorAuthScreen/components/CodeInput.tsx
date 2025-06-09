import React, { useRef, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface CodeInputProps {
  code: string[];
  setCode: (code: string[]) => void;
  codeLength: number;
  isSubmitting: boolean;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  setCode,
  codeLength,
  isSubmitting,
}) => {
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    // İlk input'a odaklan
    if (inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, []);

  const handleInputChange = (text: string, index: number) => {
    if (isSubmitting) return; // eğer submit ediyorsak girişi engelle

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Otomatik ilerleme (bir karakter girildiyse sonraki kutuya geç)
    if (text && index < codeLength - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      // Eğer mevcut kutu boşsa ve backspace basıldıysa önceki kutuya geç
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.codeContainer}>
      {Array.from({ length: codeLength }, (_, i) => (
        <TextInput
          key={i}
          ref={(ref) => (inputs.current[i] = ref)}
          style={[styles.codeInput, code[i] ? styles.codeInputFilled : null]}
          value={code[i]}
          onChangeText={(text) => handleInputChange(text, i)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
          keyboardType="numeric"
          maxLength={1}
          textAlign="center"
          editable={!isSubmitting}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  codeInputFilled: {
    borderColor: "#7C3AED",
    backgroundColor: "#F3F4F6",
  },
});

export default CodeInput;
