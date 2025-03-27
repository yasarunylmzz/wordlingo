import { View, Text, StyleSheet } from "react-native";

const OverviewComponent = () => {
  return (
    <View style={styles.upperSection}>
      <Text style={styles.title}>Overview</Text>
      <View style={styles.upperUpSection}>
        <View style={styles.UpText}>
          <Text style={styles.countText}>340</Text>
          <Text style={styles.labelText}>Learning</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.UpText}>
          <Text style={styles.countText}>88</Text>
          <Text style={styles.labelText}>Reviewing</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.UpText}>
          <Text style={[styles.countText, styles.masteredText]}>141</Text>
          <Text style={styles.labelText}>Mastered</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  upperSection: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    elevation: 2, // Android için gölge efekti
    shadowColor: "#000", // iOS için gölge efekti
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 20,
  },
  upperUpSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  UpText: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  countText: {
    color: "black",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  labelText: {
    color: "#6b6b6b",
    fontSize: 14,
    fontWeight: "500",
  },
  masteredText: {
    color: "#47c690",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#e0e0e0",
  },
});

export default OverviewComponent;
