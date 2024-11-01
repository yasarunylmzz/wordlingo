import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParams";

const widths = Dimensions.get("window").width;
const heights = Dimensions.get("window").height;

const LandingPage = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();

  const LogInButton = () => {
    navigation.navigate("Login");
  };

  const SignInButton = () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageSection}>
        <Image
          source={require("../../assets/images.png")}
          style={{ width: 300, height: 300, resizeMode: "cover" }}
        />
      </View>
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>Word-Lingo</Text>
        <View style={styles.dot}></View>
      </View>
      <View style={styles.textSection}>
        <Text style={styles.text}>
          Plan what you will do to be more organized for today, tomorrow and
          beyond
        </Text>
      </View>
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.button1} onPress={LogInButton}>
          <Text style={styles.button1Text}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={SignInButton}>
          <Text style={styles.button2Text}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: widths,
    height: heights,
    backgroundColor: "#fff",
  },
  imageSection: {
    flex: 2.5,
    justifyContent: "center",
    alignItems: "center",
  },
  logoSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: "#FD7694",
    borderRadius: 5,
    bottom: 0,
    top: 8,
    marginLeft: 5,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5B67CA",
  },
  textSection: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: "#2C406E",
    textAlign: "center",
    marginHorizontal: 20,
  },
  buttonSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button1: {
    width: 305,
    height: 52,
    backgroundColor: "#5B67CA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    marginBottom: 20,
  },
  button2: {
    width: 305,
    height: 52,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  button1Text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button2Text: {
    color: "#5B67CA",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LandingPage;
