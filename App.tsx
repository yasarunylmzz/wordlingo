import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Geist_400Regular } from "@expo-google-fonts/geist/400Regular";
import { Geist_500Medium } from "@expo-google-fonts/geist/500Medium";
import { Geist_600SemiBold } from "@expo-google-fonts/geist/600SemiBold";
import { Geist_700Bold } from "@expo-google-fonts/geist/700Bold";
import { GeistMono_400Regular } from "@expo-google-fonts/geist-mono/400Regular";
import { GeistMono_500Medium } from "@expo-google-fonts/geist-mono/500Medium";
import SplashScreen from "./screens/SplashScreen";
import StackScreens from "./routes/StackScreens";
import { colors } from "./theme/theme";

const App: React.FC = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    GeistMono_400Regular,
    GeistMono_500Medium,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isShowSplash ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <StackScreens />
        </NavigationContainer>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
