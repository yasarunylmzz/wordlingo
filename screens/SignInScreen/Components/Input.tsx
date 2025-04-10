import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import MessageIcon from "../../../svg/MessageIcon";

interface InputProps {
  placeholder: string;
  labelName: string;
  Icon?: React.ElementType;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  labelName,
  Icon,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{labelName}</Text>
      <View style={styles.inputField}>
        {Icon && <Icon width={20} height={20} style={styles.fieldIcon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9AA3BC"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputSection: {
    marginHorizontal: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3A4468",
    marginBottom: 8,
    marginLeft: 5,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E3E8F1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  fieldIcon: {
    marginRight: 5,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#3A4468",
    marginLeft: 5,
    height: 45,
  },
});
export default Input;
