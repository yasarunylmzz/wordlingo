import { createStackNavigator } from "@react-navigation/stack";
import LandingPages from "../screens/LandingPages/LandingPage";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import SignInScreen from "../screens/SignInScreen/SignInScreen";
import HomePage from "../screens/HomePage";
import BottomScreen from "./BottomScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import SelectionScreen1 from "../screens/LanguageSelectionPage/SelectionScreen1";
import SelectionScreen2 from "../screens/LanguageSelectionPage/SelectionScreen2";
import TwoFactorAuth from "../screens/TwoFactorAuth";
import AllDecks from "../screens/AllDecks";
import CreateDeck from "../screens/CreateDeck";
import CardDecks from "../screens/CardDecks/CardDecks";
import MyAccount from "../screens/MyAccount";
import FaceId from "../screens/FaceId";
import HelpAndSupport from "../screens/HelpAndSupport";
import AboutApp from "../screens/AboutApp";
import FlipCardScreen from "../screens/FlipCardScreen/FlipCardScreen";
import NotificationScreen from "../screens/NotificationScreen";
import LearnScreen from "../screens/LearnMode/LearnScreen";
import CreateCard from "../screens/CreateCard";
import SplashScreen from "../screens/SplashScreen";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/userStore";
import { jwtDecode, JwtPayload } from "jwt-decode";

const Stack = createStackNavigator();

function StackScreens() {
  const refreshToken = useAuthStore((state) => state.auth.refreshToken);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (refreshToken) {
      try {
        const decodedRefreshToken = jwtDecode<JwtPayload>(refreshToken);
        if (
          decodedRefreshToken.exp &&
          decodedRefreshToken.exp > Date.now() / 1000
        ) {
          console.log("Token geçerli, BottomScreen'e yönlendiriliyor");
          setIsAuthenticated(true);
        } else {
          console.log("Token süresi dolmuş, Home'a yönlendiriliyor");
          setIsAuthenticated(false);
        }
        console.log(
          "Token süresi:",
          decodedRefreshToken.exp,
          "Şu anki zaman:",
          Date.now() / 1000
        );
      } catch (error) {
        console.error("Token çözümleme hatası:", error);
        setIsAuthenticated(false);
      }
    } else {
      console.log("Token yok, Home'a yönlendiriliyor");
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [refreshToken]);

  if (isLoading) {
    // Opsiyon 1: Splash screen göster
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { elevation: 0 },
          cardStyle: { backgroundColor: "#fff" },
          headerShown: false,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  return isAuthenticated ? (
    // Oturum açmış kullanıcı için
    <Stack.Navigator
      initialRouteName="BottomScreen"
      screenOptions={{
        headerStyle: { elevation: 0 },
        cardStyle: { backgroundColor: "#fff" },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="BottomScreen"
        options={{ gestureEnabled: false }}
        component={BottomScreen}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="AllDecks" component={AllDecks} />
      <Stack.Screen name="CreateDeck" component={CreateDeck} />
      <Stack.Screen name="CardDecks" component={CardDecks} />
      <Stack.Screen name="MyAccount" component={MyAccount} />
      <Stack.Screen name="FaceId" component={FaceId} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="AboutApp" component={AboutApp} />
      <Stack.Screen name="FlipCardScreen" component={FlipCardScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="LearnScreen" component={LearnScreen} />
      <Stack.Screen name="CreateCard" component={CreateCard} />
    </Stack.Navigator>
  ) : (
    // Oturum açmamış kullanıcı için
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { elevation: 0 },
        cardStyle: { backgroundColor: "#fff" },
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={LandingPages} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="FirstScreen" component={HomePage} />
      <Stack.Screen name="SelectionScreen1" component={SelectionScreen1} />
      <Stack.Screen name="SelectionScreen2" component={SelectionScreen2} />
      <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} />
    </Stack.Navigator>
  );
}

export default StackScreens;
