import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../screens/RootStackParams";
import { NavigationProp } from "@react-navigation/native";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

type NavigationType = NavigationProp<RootStackParamList>;

const CardComponents = () => {
  const navigation = useNavigation<NavigationType>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("CardDecks");
      }}
    >
      <View style={styles.container1}>
        {/* Up Section*/}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 20, color: "white", fontWeight: "800" }}>
              Biology
            </Text>
            <Text style={{ fontSize: 12, color: "white", fontWeight: "500" }}>
              12 Cards
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 4,
            }}
          ></View>
        </View>

        {/* Middle Section*/}
        <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 20, color: "white" }}>{">>"}</Text>
        </View>
        {/* Down Section*/}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={{ uri: "http://picsum.photos/42/42" }}
            style={{ width: 42, height: 42, borderRadius: 24 }}
          />
          <Text
            style={{
              paddingTop: 12,
              fontSize: 12,
              color: "white",
              fontWeight: "700",
            }}
          >
            Yaşar Ünyılmaz
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  upperSection: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  container1: {
    width: width * 0.9,
    height: height * 0.2,
    backgroundColor: "#133266",
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
    borderColor: "#E3E8F1",
    borderWidth: 1,
  },
});

export default CardComponents;
