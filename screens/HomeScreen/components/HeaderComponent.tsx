import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Bell } from "lucide-react-native";
import { RootStackParamList } from "../../RootStackParams";
import { useAuthStore } from "../../../stores/userStore";
import { usePrefsStore } from "../../../stores/prefsStore";
import AppText from "../../../Components/ui/AppText";
import { colors, greetingForHour, radii, space } from "../../../theme/theme";

const HeaderComponent = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();
  const notifications = usePrefsStore((s) => s.notifications);

  const firstName = useAuthStore((state) => {
    const userName = state.user.name;
    return userName
      ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
      : "User";
  });

  const now = new Date();
  const date = new Intl.DateTimeFormat("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <View style={styles.userContainer}>
      <View style={styles.topTextcontainer}>
        <AppText style={styles.date}>{date}</AppText>
        <AppText weight="semibold" style={styles.hiText}>
          {greetingForHour(now.getHours())},{"\n"}
          <AppText weight="semibold" style={styles.name}>
            {firstName}.
          </AppText>
        </AppText>
      </View>
      <View style={styles.rightSection}>
        <Pressable
          accessibilityLabel="Bildirimler"
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        >
          <Bell size={18} color={colors.ink} strokeWidth={1.8} />
          {notifications && <View style={styles.dot} />}
        </Pressable>
        <Pressable
          accessibilityLabel="Profil"
          onPress={() => navigation.navigate("ProfileScreen")}
          style={({ pressed }) => [
            styles.avatar,
            pressed && styles.pressed,
          ]}
        >
          <AppText weight="semibold" style={styles.avatarText}>
            {firstName[0]}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: space[5],
    paddingTop: space[3],
  },
  topTextcontainer: {
    flex: 1,
    paddingRight: space[3],
  },
  date: {
    fontSize: 13,
    color: colors.muted,
    textTransform: "capitalize",
  },
  hiText: {
    marginTop: 4,
    fontSize: 30,
    lineHeight: 31.5,
    letterSpacing: -1.05,
    color: colors.ink,
  },
  name: {
    fontSize: 30,
    lineHeight: 31.5,
    letterSpacing: -1.05,
    color: colors.accent,
  },
  rightSection: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingTop: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    color: colors.accent,
  },
  dot: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});

export default HeaderComponent;
