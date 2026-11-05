import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { BookA, House, Layers, UserRound } from "lucide-react-native";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import HomePage from "../screens/HomeScreen/HomeScreen";
import AllDecks from "../screens/AllDesks/AllDesks";
import AppText from "../Components/ui/AppText";
import { colors, fonts } from "../theme/theme";

const Tab = createBottomTabNavigator();

const tabs = [
  { name: "HomePage", label: "Ana sayfa", Icon: House, component: HomePage },
  { name: "AllDecks", label: "Desteler", Icon: Layers, component: AllDecks },
  {
    name: "StatisticScreen",
    label: "Sözlük",
    Icon: BookA,
    component: SearchScreen,
  },
  {
    name: "ProfileScreen",
    label: "Profil",
    Icon: UserRound,
    component: ProfileScreen,
  },
] as const;

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.androidBg]} />
          ),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      {tabs.map(({ name, label, Icon, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: ({ focused, color }) => (
              <AppText
                weight={focused ? "semibold" : "medium"}
                style={[styles.label, { color }]}
              >
                {label}
              </AppText>
            ),
            tabBarIcon: ({ focused, color }) => (
              <Icon size={22} color={color} strokeWidth={focused ? 2.2 : 1.7} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopColor: colors.line,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    backgroundColor: "rgba(245,245,248,0.85)",
    height: 84,
    paddingTop: 8,
    paddingBottom: 28,
    paddingHorizontal: 12,
    elevation: 0,
  },
  androidBg: {
    backgroundColor: "rgba(245,245,248,0.95)",
  },
  label: {
    fontSize: 10.5,
    fontFamily: fonts.medium,
    marginTop: 2,
  },
});

export default MyTabs;
