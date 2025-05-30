import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import ProfileIcon from "../svg/ProfileIcon";
import Avatar from "../svg/Avatar";
import ButtonComponents from "../Components/ProfileScreenComponents/ButtonComponents";
import LockIcon from "../svg/LockIcon";
import LogoutIcon from "../svg/LogoutIcon";
import NotificationIcon from "../svg/NotificationIcon";
import HeartIcon from "../svg/HeartIcon";
import SelectButton from "../Components/ProfileScreenComponents/SelectButton";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../stores/userStore";

const ProfileScreen = () => {
  const username = useAuthStore((state) => state.user.username);
  const name = useAuthStore((state) => state.user.name);
  const surname = useAuthStore((state) => state.user.surname);

  const logOut = useAuthStore().logOut;

  function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <ScrollView
        style={styles.scrollView2}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.topSection}>
          <Text style={styles.profileText}>Profile</Text>
          <View style={styles.scrollView}>
            <View style={styles.container}>
              <View style={styles.profile}>
                <Avatar />
                <View style={styles.textProfileSection}>
                  <Text style={styles.name}>
                    {capitalize(name!)} {capitalize(surname!)}
                  </Text>
                  <Text style={styles.username}>@{username}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomScrollView}>
          <View style={styles.settingsSection}>
            <ButtonComponents
              targetScreen="MyAccount"
              title="My Account"
              description="Make changes to your account"
              icon={<ProfileIcon />}
            />

            <SelectButton
              title="Face Id"
              description="Manage your saved account"
              icon={<LockIcon />}
            />
          </View>

          <Text style={styles.more}>More</Text>

          <View style={styles.settingsSection2}>
            <ButtonComponents
              targetScreen="HelpAndSupport"
              title="Help & Support"
              description="Get help from our support team"
              icon={<NotificationIcon />}
            />
            <ButtonComponents
              targetScreen="AboutApp"
              title="About App"
              description="About Us"
              icon={<HeartIcon />}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            logOut();
            // Clear the auth data from the store
            useAuthStore.getState().clearAuthData();
            // Navigate to the login screen
            navigation.navigate("Login");
          }}
          style={styles.logoutSection}
        >
          <LogoutIcon />

          <Text style={styles.logout}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topSection: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  profile: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scrollView: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  container: {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#4f24d8",
    alignItems: "center",
    borderRadius: 10,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4f24d8",
    padding: 20,
  },
  username: {
    color: "#fff",
    fontSize: 11,
  },
  textProfileSection: {
    display: "flex",
    gap: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 2,
  },
  settingsSection: {
    display: "flex",
    flexDirection: "column",
    width: "95%",
    height: 170,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 10,
    gap: 40,
    marginBottom: 10,
  },
  settings1Top: {
    width: "100%",
    height: 40,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  settings1: {
    width: 50,
    height: 50,
    backgroundColor: "#f3f2fb",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  text1: {
    fontSize: 13,
    fontWeight: "bold",
  },
  text2: {
    fontSize: 11,
    color: "#A4A4A6",
  },
  textSection: {
    display: "flex",
    gap: 4,
  },
  more: {
    width: "100%",
    marginLeft: 40,
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  scrollView2: {
    width: "100%",
  },
  bottomScrollView: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  settingsSection2: {
    display: "flex",
    flexDirection: "column",
    width: "95%",
    height: 170,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 50,
    gap: 40,
  },
  textSection2: {
    display: "flex",
    gap: 4,
  },
  logoutSection: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    height: 150,
  },
  logout: {
    color: "#DC143C",
    fontSize: 20,
    fontWeight: "bold",
  },
});
export default ProfileScreen;
