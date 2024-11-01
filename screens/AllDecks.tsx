import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import EditIcon from "../svg/EditIcon";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParams";

const AllDecks = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.AppBar}>
        <Text style={styles.appText}>Decks</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CreateDeck");
          }}
        >
          <View style={styles.icon}>
            <EditIcon />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.cardContainer}>
          <View style={styles.cardContainerText}>
            <Text style={styles.text1}>Common Verbs</Text>
            <Text style={styles.text2}>10 cards</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  AppBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    borderWidth: 2,
    borderColor: "#133266",
  },
  appText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#133266",
  },
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderColor: "#133266",
    borderWidth: 4,
    borderRadius: 10,
    width: "90%",
    height: 100,
    marginBottom: 20,
    justifyContent: "center",
    shadowColor: "#133266",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.9, // Gölge opaklığını ayarlayın
    shadowRadius: 5, // Gölge yarıçapını ayarlayın
    elevation: 5, // Android için elevation ayarı
  },
  cardContainerText: {
    marginLeft: 20,
  },
  text1: {
    fontSize: 22,
    fontWeight: "bold",
  },
  text2: {
    fontSize: 16,
    color: "#575757",
  },
});

export default AllDecks;
