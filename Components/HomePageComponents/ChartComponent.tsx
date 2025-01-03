import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const ChartComponent = ({ data, dates }: { data: any; dates: any }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <View style={styles.chartArea}>
      <LineChart
        width={screenWidth - 50}
        height={screenHeight * 0.2}
        data={data}
        areaChart
        backgroundColor={"white"}
        dataPointsColor="#4f41d8"
        stripColor={"#fae1e1"}
        rulesColor={"#fff"}
        xAxisThickness={0}
        showXAxisIndices={false}
        yAxisThickness={0}
        hideYAxisText={true}
        xAxisLabelTexts={dates}
        disableScroll={true}
        xAxisLabelTextStyle={{
          fontSize: 14,
          color: "gray",
          fontWeight: "700",
          textAlign: "center",
        }}
        color1="#4f41d8"
        thickness1={7}
        curved={true}
        dataPointsRadius={6}
        startFillColor="#e5e5f7"
        endFillColor="#f3f3fb"
        startOpacity={1}
        endOpacity={0.5}
        pointerConfig={{
          height: 10,
          width: 10,
          pointerColor: "#4f41d8",
          showPointerStrip: false,
          pointerStripColor: "#133266",
          pointerStripUptoDataPoint: true,
          pointerLabelComponent: ({ data }: any) => {
            const displayValue = data?.value ?? "No data";
            return (
              <View
                style={{
                  backgroundColor: "white",
                  padding: 4,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {displayValue}
                </Text>
              </View>
            );
          },
          pointerLabelWidth: 50,
          pointerLabelHeight: 30,
          shiftPointerLabelY: -40,
          pointerVanishDelay: 300,
          autoAdjustPointerLabelPosition: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartArea: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    padding: 5, // Remove extra padding to fit chart better
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden", // Hide any overflow to keep clean boundaries
  },
});

export default ChartComponent;
