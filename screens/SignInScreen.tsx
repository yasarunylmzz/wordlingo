import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import MessageIcon from "../svg/MessageIcon";
import IconLocks from "../svg/IconLocks";
import EyeHide from "../svg/EyeHide";
import EyeShow from "../svg/EyeShow";
import Facebook from "../svg/Facebook";
import Google from "../svg/Google";
import Apple from "../svg/Apple";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParams";

const SignInScreen = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();
  const [hidePassword, setHidePassword] = React.useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.loginText}>Sign In</Text>
      <View style={styles.inputSection}>
        <View style={styles.emailSection}>
          <View style={styles.leftside}>
            <MessageIcon />
            <TextInput style={styles.input} placeholder=" Username" />
          </View>
        </View>

        <View style={styles.emailSection}>
          <View style={styles.leftside}>
            <MessageIcon />
            <TextInput style={styles.input} placeholder="Email ID" />
          </View>
        </View>

        <View style={styles.emailSection}>
          <View style={styles.leftside}>
            <IconLocks />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!hidePassword}
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
      </View>

      <TouchableOpacity
        style={styles.login}
        onPress={() => navigation.navigate("TwoFactorAuth")}
      >
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
      <View style={styles.dividerSection}>
        <Divider style={styles.divider} />
        <Text style={{ color: "#C6CEDD" }}>or with</Text>
        <Divider style={styles.divider} />
      </View>
      <View style={styles.alternativeLogin}>
        <View style={styles.logoContent}>
          <Google />
        </View>
        <View style={styles.logoContent}>
          <Facebook />
        </View>
        <View style={styles.logoContent}>
          <Apple />
        </View>
      </View>
      <View style={styles.bottomContent}>
        <Text style={styles.text}>you have an account?</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.signUp}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dividerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,

    paddingHorizontal: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E3E8F1",
    marginHorizontal: 10,
  },

  loginText: {
    marginLeft: 30,
    marginTop: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#5B67CA",
  },
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
  logoContent: {
    height: 50,
    backgroundColor: "#FFFFFF",
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E3E8F1",
    borderWidth: 1,
  },
  alternativeLogin: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 15,
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 5,
  },
  text: {
    color: "#2C406E",
    fontSize: 14,
  },
  signUp: {
    color: "#2C406E",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SignInScreen;
