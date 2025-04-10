import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import MessageIcon from "../../../svg/MessageIcon";
import IconLocks from "../../../svg/IconLocks";
import EyeHide from "../../../svg/EyeHide";
import EyeShow from "../../../svg/EyeShow";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootStackParams";
import { loginUser } from "../../../services/userService";

const InputSection = () => {
  type NavigationType = NavigationProp<RootStackParamList, "Login">;
  const [hidePassword, setHidePassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigation = useNavigation<NavigationType>();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  const postData = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    console.log("Response:", response.data);
    if (response.status === 200) {
      console.log("response-status:", response.status);
      console.log("response-data:", response.headers);
      navigation.navigate("BottomScreen");
    }
  };

  return (
    <View style={styles.inputSection}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputField}>
          <MessageIcon width={20} height={20} style={styles.fieldIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email ID or Username"
            placeholderTextColor="#9AA3BC"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputField}>
          <IconLocks width={20} height={20} style={styles.fieldIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9AA3BC"
            secureTextEntry={!hidePassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            {hidePassword ? (
              <EyeHide style={styles.iconRight} />
            ) : (
              <EyeShow style={styles.iconRight} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.login}
        onPress={() => postData(email, password)}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
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
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3E8F1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  fieldIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  iconRight: {
    marginLeft: 10,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#5B67CA",
    marginVertical: 5,
  },
  login: {
    width: "100%",
    height: 55,
    backgroundColor: "#5B67CA",
    marginVertical: 20,
    padding: 15,
    alignItems: "center",
    borderRadius: 14,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default InputSection;
