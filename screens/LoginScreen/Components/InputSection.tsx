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
import axios from "axios";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootStackParams";

const InputSection = () => {
  type NavigationType = NavigationProp<RootStackParamList, "Login">;
  const [hidePassword, setHidePassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigation = useNavigation<NavigationType>();

  const postData = async (email: string, password: string) => {
    console.log(typeof email, typeof password);
    try {
      const response = await axios.post("http://localhost:1323/login", {
        email: email,
        password: password,
      });
      console.log(response.data);
      console.log(response.headers);

      if (response.data["user"].is_verified) {
        console.log(response.data["user"].is_verified);
        navigation.navigate("BottomScreen");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.inputSection}>
      <View style={styles.emailSection}>
        <View style={styles.leftside}>
          <MessageIcon />
          <TextInput
            style={styles.input}
            placeholder="Email ID or Username"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>

      <View style={styles.emailSection}>
        <View style={styles.leftside}>
          <IconLocks />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!hidePassword}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          {hidePassword ? (
            <EyeHide style={styles.iconRight} />
          ) : (
            <EyeShow style={styles.iconRight} />
          )}
        </TouchableOpacity>
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
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    fontSize: 16,
    marginLeft: 5,
  },
  emailSection: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    height: 60,
    borderBottomColor: "#E3E8F1",
  },
  leftside: {
    flexDirection: "row",
    flex: 1,
    marginLeft: 15,
    alignItems: "center",
  },
  iconRight: {
    marginRight: 15,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#5B67CA",
    marginHorizontal: 15,
    marginVertical: 5,
  },
  login: {
    width: "90%",
    height: 55,
    backgroundColor: "#5B67CA",
    marginHorizontal: 20,
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
