import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderComponent from "./components/HeaderComponent";
import StudyProgressCard from "./components/StudyProgressCard";

const HomePage = () => {
  return (
    <SafeAreaView testID="home-screen">
      <HeaderComponent />
      <ScrollView
        style={{ height: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wordContainers}>
          <StudyProgressCard />
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
  },
});

export default HomePage;
