import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import MessageIcon from "../../svg/MessageIcon";
import IconLocks from "../../svg/IconLocks";
import EyeHide from "../../svg/EyeHide";
import EyeShow from "../../svg/EyeShow";
import Facebook from "../../svg/Facebook";
import Google from "../../svg/Google";
import Apple from "../../svg/Apple";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParams";
import Input from "./Components/Input";
import ProfileIcon from "../../svg/ProfileIcon";
import { createUser } from "../../services/userService";

const SignInScreen = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();
  const [hidePassword, setHidePassword] = React.useState(true);
  const [formData, setFormData] = React.useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleCreateUser = async () => {
    try {
      const response = await createUser(
        formData.email,
        formData.password,
        formData.name,
        formData.surname,
        formData.username
      );
      // console.log("User created successfully:", response.data);
      if (response && response.data) {
        console.log("user created successfully:");
        navigation.navigate("TwoFactorAuth");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  console.log("Form Data:", formData);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.loginText}>Sign In</Text>
          <Text style={styles.subtitleText}>
            Create your account to get started
          </Text>

          <View style={styles.inputSection}>
            {/* Name Field */}

            {/* Surname Field */}
            <Input
              labelName="Name"
              placeholder="Enter your name"
              Icon={ProfileIcon}
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />

            <Input
              labelName="Surname"
              placeholder="Enter your surname"
              Icon={ProfileIcon}
              value={formData.surname}
              onChangeText={(text) => handleInputChange("surname", text)}
            />

            <Input
              labelName="Username"
              placeholder="Enter your username"
              Icon={MessageIcon}
              value={formData.username}
              onChangeText={(text) => handleInputChange("username", text)}
            />

            <Input
              labelName="Email"
              placeholder="Enter your email"
              Icon={MessageIcon}
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputField}>
                <IconLocks width={20} height={20} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="#9AA3BC"
                  secureTextEntry={hidePassword}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                />
                <TouchableOpacity
                  onPress={() => setHidePassword(!hidePassword)}
                >
                  {hidePassword ? (
                    <EyeHide style={styles.iconRight} />
                  ) : (
                    <EyeShow style={styles.iconRight} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.login}
            onPress={() => handleCreateUser()}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>

          <View style={styles.dividerSection}>
            <Divider style={styles.divider} />
            <Text style={styles.dividerText}>or with</Text>
            <Divider style={styles.divider} />
          </View>

          <View style={styles.alternativeLogin}>
            <TouchableOpacity style={styles.logoContent}>
              <Google />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoContent}>
              <Facebook />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoContent}>
              <Apple />
            </TouchableOpacity>
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 25,
  },
  loginText: {
    marginLeft: 30,
    marginTop: 30,
    fontSize: 28,
    fontWeight: "bold",
    color: "#5B67CA",
  },
  subtitleText: {
    marginLeft: 30,
    marginTop: 8,
    fontSize: 16,
    color: "#7A84A7",
    marginBottom: 20,
  },
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
  iconRight: {
    marginRight: 5,
  },
  login: {
    width: "85%",
    height: 55,
    backgroundColor: "#5B67CA",
    marginHorizontal: 30,
    marginVertical: 15,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "#5B67CA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  dividerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E3E8F1",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#9AA3BC",
    fontSize: 14,
  },
  alternativeLogin: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 20,
  },
  logoContent: {
    height: 52,
    backgroundColor: "#FFFFFF",
    width: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E8ECF3",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    gap: 5,
  },
  text: {
    color: "#7A84A7",
    fontSize: 15,
  },
  signUp: {
    color: "#5B67CA",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default SignInScreen;
