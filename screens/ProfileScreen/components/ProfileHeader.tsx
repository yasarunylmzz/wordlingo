import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Settings } from "lucide-react-native";
import AppText from "../../../Components/ui/AppText";
import { colors, radii, space } from "../../../theme/theme";

interface ProfileHeaderProps {
  name: string;
  surname: string;
  username: string;
  onSettingsPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  surname,
  username,
  onSettingsPress,
}) => {
  function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const initials =
    `${(name?.[0] ?? "").toUpperCase()}${(surname?.[0] ?? "").toUpperCase()}` ||
    "?";
  const fullName = `${capitalize(name)} ${capitalize(surname)}`.trim();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText weight="semibold" style={styles.profileText}>
          Profil
        </AppText>
        <Pressable
          accessibilityLabel="Ayarlar"
          onPress={onSettingsPress}
          style={({ pressed }) => [
            styles.settingsButton,
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Settings size={18} color={colors.ink} strokeWidth={1.8} />
        </Pressable>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <AppText weight="semibold" style={styles.avatarText}>
            {initials}
          </AppText>
        </View>
        <View style={styles.nameBlock}>
          <AppText weight="semibold" style={styles.name} numberOfLines={1}>
            {fullName}
          </AppText>
          <AppText style={styles.username} numberOfLines={1}>
            @{username}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: space[5],
    paddingTop: space[3],
  },
  profileText: {
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: -1.05,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  profileSection: {
    marginTop: 28,
    paddingHorizontal: space[5],
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    letterSpacing: -0.48,
    color: colors.white,
  },
  nameBlock: { flex: 1, minWidth: 0 },
  name: {
    fontSize: 22,
    letterSpacing: -0.55,
  },
  username: {
    fontSize: 14,
    color: colors.muted,
  },
});

export default ProfileHeader;
