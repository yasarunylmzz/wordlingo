import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChartComponent from "./components/ChartComponent";
import TodoComponents from "./components/TodoComponents";
import HeaderComponent from "./components/HeaderComponent";
import StudyProgressCard from "./components/StudyProgressCard";

const HomePage = () => {
  // Sample weekly activity series for the gifted-charts LineChart
  // (restored from pre–Phase 4 home: commit 6d9890e^ / ChartComponent).
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
    <SafeAreaView testID="home-screen">
      <HeaderComponent />
      <ScrollView
        style={{ height: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wordContainers}>
          <ChartComponent data={data} dates={dates} />
          <StudyProgressCard />
          <TodoComponents />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wordContainers: {
    display: "flex",
    flexDirection: "column",
    padding: 16,
    paddingTop: 8,
    gap: 16,
  },
});

export default HomePage;
