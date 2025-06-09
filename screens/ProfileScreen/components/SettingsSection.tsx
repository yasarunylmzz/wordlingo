import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ButtonComponents from "../../../Components/ProfileScreenComponents/ButtonComponents";
import SelectButton from "../../../Components/ProfileScreenComponents/SelectButton";
import ProfileIcon from "../../../svg/ProfileIcon";
import LockIcon from "../../../svg/LockIcon";
import NotificationIcon from "../../../svg/NotificationIcon";
import HeartIcon from "../../../svg/HeartIcon";

const SettingsSection: React.FC = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
  bottomScrollView: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
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
  more: {
    width: "100%",
    marginLeft: 40,
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
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
});

export default SettingsSection;
