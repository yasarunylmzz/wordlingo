import { createStackNavigator } from "@react-navigation/stack";
import LandingPages from "../screens/LandingPages/LandingPage";
import LoginScreen from "../screens/LoginScreen/LoginScreen";
import SignInScreen from "../screens/SignInScreen/SignInScreen";
import HomePage from "../screens/HomeScreen/HomeScreen";
import BottomScreen from "./BottomScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import TwoFactorAuth from "../screens/TwoFactorAuthScreen/TwoFactorAuthScreen";
import AllDecks from "../screens/AllDesks/AllDesks";
import CreateDeck from "../screens/CreateDeckScreen/CreateDeckScreen";
import CardDecks from "../screens/CardDecks/CardDecks";
import MyAccount from "../screens/MyAccountScreen/MyAccountScreen";
import FaceId from "../screens/FaceIdScreen/FaceIdScreen";
import HelpAndSupport from "../screens/HelpSupportScreen/HelpSupportScreen";
import AboutApp from "../screens/AboutScreen/AboutScreen";
import FlipCardScreen from "../screens/FlipCardScreen/FlipCardScreen";
import LearnScreen from "../screens/LearnMode/LearnScreen";
import CreateCard from "../screens/CreateCardScreen/CreateCardScreen";
import SplashScreen from "../screens/SplashScreen/SplashScreen";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/userStore";
import { jwtDecode, JwtPayload } from "jwt-decode";

const Stack = createStackNavigator();

function StackScreens() {
  const refreshToken = useAuthStore((state) => state.auth.refreshToken);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const userID = useAuthStore((state) => state.user.id);
  useEffect(() => {
    if (refreshToken) {
      console.log(userID);
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
      <Stack.Screen name="LearnScreen" component={LearnScreen} />
      <Stack.Screen name="CreateCard" component={CreateCard} />
    </Stack.Navigator>
  ) : (
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
      <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} />
    </Stack.Navigator>
  );
}

export default StackScreens;
