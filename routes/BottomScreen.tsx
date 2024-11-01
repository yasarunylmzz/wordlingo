import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Dimensions } from "react-native";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomePage from "../screens/HomePage";
import ProfileIcon from "../svg/ProfileIcon";
import GridIcon from "../svg/GridIcon";
import CardIcon from "../svg/CardIcon";
import HomeIcon from "../svg/HomeIcon";
import AllDecks from "../screens/AllDecks";

const height = Dimensions.get("window").height;
const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, IconComponent }) => (
  <View
    style={[
      styles.iconContainer,
      {
        backgroundColor: focused ? "#fff" : "transparent",
        width: focused ? 80 : "100%",
        height: focused ? 40 : "100%",
        borderRadius: focused ? 10 : 0,
      },
    ]}
  >
    <IconComponent color={focused ? "#4A90E2" : "#6E6E6E"} />
  </View>
);

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="BottomBar"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 50,
          position: "absolute",
          paddingBottom: 0,
          bottom: height * 0.03,
          left: 25,
          right: 25,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={HomeIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="AllDecks"
        component={AllDecks}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={GridIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="StatisticScreen"
        component={SearchScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={CardIcon} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} IconComponent={ProfileIcon} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
});

export default MyTabs;
