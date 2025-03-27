import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParams";
import { Dimensions } from "react-native";
import ProfileIcon from "../svg/ProfileIcon";
import NotificationIcon from "../svg/NotificationIcon";
import ChartComponent from "../Components/HomePageComponents/ChartComponent";
import OverviewComponent from "../Components/HomePageComponents/OverviewComponent";
import TodoComponents from "../Components/HomePageComponents/TodoComponents";

const HomePage = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const data = [
    { value: 50 },
    { value: 40 },
    { value: 70 },
    { value: 80 },
    { value: 30 },
    { value: 20 },
    { value: 40 },
  ];
  const dates = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <SafeAreaView>
      <View style={styles.userContainer}>
        <View style={styles.topTextcontainer}>
          <Text style={styles.hiText}>Hi, Steven</Text>
          <Text style={styles.hiText2}>Let's make this day learn</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
          >
            <View style={styles.iconStyles}>
              <View style={styles.dotIcon}></View>
              <NotificationIcon />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
          >
            <View style={styles.users}>
              <ProfileIcon color={"#4f42d8"} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ height: "100%" }}>
        <View style={styles.wordContainers}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></View>
          <OverviewComponent />
          <ChartComponent data={data} dates={dates} />
          <TodoComponents />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    color: "#4f24d8",
  },
  hiText2: {
    fontSize: 14,
    color: "#575757",
  },
  wordContainers: {
    display: "flex",
    flexDirection: "column",
    padding: 15,
  },

  users: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#fff",
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
    borderRadius: 14,
    backgroundColor: "#fff",
  },

  dotIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff763f",
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default HomePage;
