import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import MessageIcon from "../../svg/MessageIcon";
import IconLocks from "../../svg/IconLocks";
import EyeHide from "../../svg/EyeHide";
import EyeShow from "../../svg/EyeShow";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParams";
import axios from "axios";
import AlternativLogin from "./Components/AlternativLogin";
import BottomContent from "./Components/BottomContent";
import InputSection from "./Components/InputSection";

const LoginScreen = () => {
  type NavigationType = NavigationProp<RootStackParamList, "Login">;
  const navigation = useNavigation<NavigationType>();
  const [userData, setUserData] = useState({ email: "", password: "" });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.loginText}>Login</Text>

      <InputSection />

      <View style={styles.dividerSection}>
        <Divider style={styles.divider} />
        <Text style={{ color: "#C6CEDD" }}>or with</Text>
        <Divider style={styles.divider} />
      </View>

      <AlternativLogin />

      <BottomContent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    gap: 5,
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
    fontSize: 30,
    width: "90%",
    fontWeight: "bold",
    color: "#5B67CA",
  },
});

export default LoginScreen;
