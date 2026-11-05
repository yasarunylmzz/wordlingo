import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChartComponent from "./components/ChartComponent";
import TodoComponents from "./components/TodoComponents";
import HeaderComponent from "./components/HeaderComponent";
import StudyProgressCard from "./components/StudyProgressCard";
import { colors, space } from "../../theme/theme";

const HomePage = () => {
  // Placeholder weekly counts until a real activity API exists.
  // Shape matches prior Home chart data; values are not prototype mock decks.
  const data = [
    { value: 52 },
    { value: 38 },
    { value: 64 },
    { value: 80 },
    { value: 31 },
    { value: 22 },
    { value: 42 },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]} testID="home-screen">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeaderComponent />
        <View style={styles.sections}>
          <StudyProgressCard />
          <ChartComponent data={data} />
          <TodoComponents />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  sections: {
    paddingHorizontal: space[4],
    paddingTop: 24,
    gap: 40,
  },
});

export default HomePage;
