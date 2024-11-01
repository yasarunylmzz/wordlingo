import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import SplashScreen from "./screens/SplashScreen";
import StackScreens from "./routes/StackScreens";

const App: React.FC = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return isShowSplash ? (
    <SplashScreen />
  ) : (
    <NavigationContainer>
      <StackScreens />
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
