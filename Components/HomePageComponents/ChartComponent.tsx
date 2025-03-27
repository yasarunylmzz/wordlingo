import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const ChartComponent = ({ data, dates }: { data: any; dates: any }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Calculate some statistics
  const values = data.map((item) => item.value);
  const maxValue = Math.max(...values);
  const avgValue = Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Weekly Activity</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{avgValue}</Text>
          <Text style={styles.statLabel}>Daily Average</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{maxValue}</Text>
          <Text style={styles.statLabel}>Highest</Text>
        </View>
      </View>

      <View style={styles.chartArea}>
        <LineChart
          width={screenWidth - 70}
          height={screenHeight * 0.22}
          data={data}
          areaChart
          backgroundColor={"transparent"}
          dataPointsColor="#6A5ACD"
          rulesColor={"#f0f0f5"}
          rulesType="solid"
          xAxisThickness={1}
          xAxisColor="#e5e7eb"
          showXAxisIndices={true}
          xAxisIndicesHeight={3}
          xAxisIndicesColor="#e5e7eb"
          yAxisThickness={0}
          hideYAxisText={true}
          xAxisLabelTexts={dates}
          disableScroll={true}
          xAxisLabelTextStyle={{
            fontSize: 11,
            color: "#6b7280",
            fontWeight: "500",
            textAlign: "center",
            marginTop: 5,
          }}
          color1="#6A5ACD"
          thickness1={3}
          curved={true}
          dataPointsRadius={5}
          startFillColor="#f0eeff"
          endFillColor="#f9f9fc"
          startOpacity={0.6}
          endOpacity={0.1}
          noOfSections={4}
          pointerConfig={{
            height: 12,
            width: 12,
            pointerColor: "#6A5ACD",
            pointerStripHeight: 130,
            pointerStripWidth: 1,
            pointerStripColor: "rgba(106, 90, 205, 0.3)",
            showPointerStrip: true,
            pointerStripUptoDataPoint: true,
            pointerLabelComponent: (props: any) => {
              // Check if data exists and has a valid value
              const displayValue =
                props.data?.value !== undefined ? props.data.value : "—";
              return (
                <View style={styles.tooltipContainer}>
                  <Text style={styles.tooltipValue}>{displayValue}</Text>
                </View>
              );
            },
            pointerLabelWidth: 55,
            pointerLabelHeight: 30,
            shiftPointerLabelY: -45,
            pointerVanishDelay: 500,
            autoAdjustPointerLabelPosition: true,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginVertical: 8,
  },
  headerContainer: {
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A5ACD",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#e5e7eb",
  },
  chartArea: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    paddingTop: 10,
    paddingBottom: 5,
  },
  tooltipContainer: {
    backgroundColor: "#6A5ACD",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  tooltipValue: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default ChartComponent;
