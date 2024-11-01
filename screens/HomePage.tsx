import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Avatar from "../svg/Avatar";
import CardComponents from "../Components/HomePageComponents/CardComponents";
import EditIcon from "../svg/EditIcon";
import { RootStackParamList } from "./RootStackParams";

const HomePage = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();

  return (
    <SafeAreaView>
      <View style={styles.userContainer}>
        <View style={styles.topTextcontainer}>
          <Text style={styles.hiText}>Hi, Steven</Text>
          <Text style={styles.hiText2}>Let's make this day learn</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CreateCard");
            }}
          >
            <View style={styles.iconStyles}>
              <EditIcon />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <View style={styles.users}>
              <Avatar />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ height: "100%" }}>
        <View style={styles.wordContainers}>
          <Text style={styles.hiText3}>Words Container</Text>
          <View style={styles.upperSection}>
            <CardComponents />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  upperSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
  },
  container1: {
    width: 275,
    height: 175,
    backgroundColor: "#19998b",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 15,
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  topTextcontainer: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  hiText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#12175E",
  },
  hiText2: {
    fontSize: 14,
    color: "#575757",
  },
  wordContainers: {
    padding: 15,
  },
  hiText3: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#12175E",
    marginBottom: 10,
  },
  users: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderColor: "#133266",
    borderWidth: 2,
  },
  rightSection: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  iconStyles: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderColor: "#133266",
    borderWidth: 2,
  },
});

export default HomePage;
