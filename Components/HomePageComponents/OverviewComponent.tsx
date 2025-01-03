import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const OverviewComponent = () => {
  return (
    <View style={styles.upperSection}>
      <View style={styles.upperUpSection}>
        <View style={styles.UpText}>
          <Text style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
            340
          </Text>
          <Text style={{ color: "gray", fontSize: 14 }}>Learning</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.UpText}>
          <Text style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
            88
          </Text>
          <Text style={{ color: "gray", fontSize: 14 }}>Reviewing</Text>
        </View>
        <View style={styles.divider}></View>

        <View style={styles.UpText}>
          <Text style={{ color: "#47c690", fontSize: 24, fontWeight: "bold" }}>
            141
          </Text>
          <Text style={{ color: "gray", fontSize: 14 }}>Mastered</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  upperSection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    height: 150,
  },
  upperUpSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  UpText: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  viewButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 35,
    borderRadius: 10,
  },
  viewButtonText: {
    color: "#4f42d8",
    fontWeight: "700",
    fontSize: 18,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: "#575757",
    opacity: 0.2,
  },
});

export default OverviewComponent;
