import { createStackNavigator } from "@react-navigation/stack";
import LandingPages from "../screens/LandingPages/LandingPage";
import LoginScreen from "../screens/LoginScreen";
import SignInScreen from "../screens/SignInScreen";
import HomePage from "../screens/HomePage";
import BottomScreen from "./BottomScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import StatisticScreen from "../screens/StatisticsPage";
import SelectionScreen1 from "../screens/LanguageSelectionPage/SelectionScreen1";
import SelectionScreen2 from "../screens/LanguageSelectionPage/SelectionScreen2";
import TwoFactorAuth from "../screens/TwoFactorAuth";
import AllDecks from "../screens/AllDecks";
import CreateCard from "../screens/CreateCard";
import CardDecks from "../screens/CardDecks";
import MyAccount from "../screens/MyAccount";
import SavedBeneficary from "../screens/SavedBeneficary";
import FaceId from "../screens/FaceId";
import HelpAndSupport from "../screens/HelpAndSupport";
import AboutApp from "../screens/AboutApp";
import FlipCardScreen from "../screens/FlipCardScreen";
import NotificationScreen from "../screens/NotificationScreen";

const Stack = createStackNavigator();

function StackScreens() {
  return (
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
      <Stack.Screen name="AllDecks" component={AllDecks} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="FirstScreen" component={HomePage} />
      <Stack.Screen name="StatisticsScreen" component={StatisticScreen} />
      <Stack.Screen name="BottomScreen" component={BottomScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SelectionScreen1" component={SelectionScreen1} />
      <Stack.Screen name="SelectionScreen2" component={SelectionScreen2} />
      <Stack.Screen name="TwoFactorAuth" component={TwoFactorAuth} />
      <Stack.Screen name="CreateCard" component={CreateCard} />
      <Stack.Screen name="CardDecks" component={CardDecks} />
      <Stack.Screen name="MyAccount" component={MyAccount} />
      <Stack.Screen name="SavedBeneficary" component={SavedBeneficary} />
      <Stack.Screen name="FaceId" component={FaceId} />
      <Stack.Screen name="HelpAndSupport" component={HelpAndSupport} />
      <Stack.Screen name="AboutApp" component={AboutApp} />
      <Stack.Screen name="FlipCardScreen" component={FlipCardScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
}

export default StackScreens;
