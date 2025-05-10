import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.circle3}>
        <View style={styles.circle2}>
          <View style={styles.circle1}>
            <View style={styles.bottom}>
              <Text style={styles.text}>Word-Lingo</Text>
              <View style={styles.dot}></View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7371FC",
  },
  circle1: {
    display: "flex",
    flexDirection: "row",
    width: 310,
    height: 310,
    borderRadius: 155, // Updated to 155, half of width/height for proper circle shape
    backgroundColor: "#213a",
    justifyContent: "center",
    alignItems: "center",
    // Shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Shadow property for Android
    elevation: 8,
  },
  circle2: {
    width: 488,
    height: 488,
    borderRadius: 244, // Updated to 244, half of width/height for proper circle shape
    backgroundColor: "#1351fc",
    justifyContent: "center",
    alignItems: "center",
    // Shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    // Shadow property for Android
    elevation: 16,
  },
  circle3: {
    width: 666,
    height: 666,
    borderRadius: 333, // Updated to 333, half of width/height for proper circle shape
    backgroundColor: "#7a78fc",
    justifyContent: "center",
    alignItems: "center",
    // Shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12.3,
    // Shadow property for Android
    elevation: 24,
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: "#FD7694",
    borderRadius: 5,
    marginBottom: 5,
    marginLeft: 5,
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});
