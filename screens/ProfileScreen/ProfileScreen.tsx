import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../stores/userStore";
import { usePrefsStore } from "../../stores/prefsStore";
import ProfileHeader from "./components/ProfileHeader";
import LogoutButton from "./components/LogoutButton";
import Sheet from "../../Components/ui/Sheet";
import Field from "../../Components/ui/Field";
import AppText from "../../Components/ui/AppText";
import { colors, radii, space } from "../../theme/theme";

const goalOptions = [10, 20, 30, 45];

const ProfileScreen = ({ navigation }: any) => {
  const username = useAuthStore((state) => state.user.username) ?? "";
  const name = useAuthStore((state) => state.user.name) ?? "";
  const surname = useAuthStore((state) => state.user.surname) ?? "";
  const email = useAuthStore((state) => state.user.email) ?? "";
  const setAuthData = useAuthStore((state) => state.setAuthData);

  const goalMinutes = usePrefsStore((s) => s.goalMinutes);
  const notifications = usePrefsStore((s) => s.notifications);
  const setGoalMinutes = usePrefsStore((s) => s.setGoalMinutes);
  const setNotifications = usePrefsStore((s) => s.setNotifications);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    firstName: name,
    lastName: surname,
    username,
    email,
  });

  const rows: {
    key: "firstName" | "lastName" | "username" | "email";
    label: string;
    value: string;
  }[] = [
    { key: "firstName", label: "Ad", value: name },
    { key: "lastName", label: "Soyad", value: surname },
    { key: "username", label: "Kullanıcı adı", value: username },
    { key: "email", label: "E-posta", value: email },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={name}
          surname={surname}
          username={username}
          onSettingsPress={() => setShowSettingsModal(true)}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Kişisel bilgiler</AppText>
            {!editing && (
              <Pressable
                onPress={() => {
                  setDraft({
                    firstName: name,
                    lastName: surname,
                    username,
                    email,
                  });
                  setEditing(true);
                }}
              >
                <AppText weight="semibold" style={styles.edit}>
                  Düzenle
                </AppText>
              </Pressable>
            )}
          </View>

          {editing ? (
            <View style={styles.editCard}>
              <View style={styles.editRow}>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Ad"
                    value={draft.firstName}
                    onChangeText={(t) =>
                      setDraft((d) => ({ ...d, firstName: t }))
                    }
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Soyad"
                    value={draft.lastName}
                    onChangeText={(t) =>
                      setDraft((d) => ({ ...d, lastName: t }))
                    }
                  />
                </View>
              </View>
              <Field
                label="Kullanıcı adı"
                value={draft.username}
                onChangeText={(t) => setDraft((d) => ({ ...d, username: t }))}
              />
              <Field
                label="E-posta"
                value={draft.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(t) => setDraft((d) => ({ ...d, email: t }))}
              />
              <View style={styles.editActions}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => setEditing(false)}
                >
                  <AppText weight="semibold" style={styles.cancelText}>
                    Vazgeç
                  </AppText>
                </Pressable>
                <Pressable
                  style={styles.saveBtn}
                  onPress={() => {
                    setAuthData({
                      user: {
                        name: draft.firstName.trim(),
                        surname: draft.lastName.trim(),
                        username: draft.username.trim().replace(/^@/, ""),
                        email: draft.email.trim(),
                      },
                    });
                    setEditing(false);
                  }}
                >
                  <AppText weight="semibold" style={styles.saveText}>
                    Kaydet
                  </AppText>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.infoCard}>
              {rows.map((r) => (
                <View key={r.key} style={styles.infoRow}>
                  <AppText style={styles.infoLabel}>{r.label}</AppText>
                  <AppText weight="medium" style={styles.infoValue} numberOfLines={1}>
                    {r.key === "username" ? `@${r.value}` : r.value}
                  </AppText>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.logoutWrap}>
          <LogoutButton />
        </View>
      </ScrollView>

      <Sheet
        title="Ayarlar"
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.settingsBody}>
          <AppText weight="medium" style={styles.goalLabel}>
            Günlük hedef
          </AppText>
          <View style={styles.goalTrack}>
            {goalOptions.map((g) => (
              <Pressable
                key={g}
                onPress={() => setGoalMinutes(g)}
                style={[
                  styles.goalBtn,
                  goalMinutes === g && styles.goalBtnOn,
                ]}
              >
                <AppText
                  weight="medium"
                  style={[
                    styles.goalText,
                    goalMinutes === g && { color: colors.accent },
                  ]}
                >
                  {g} dk
                </AppText>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.notifRow}
            onPress={() => setNotifications(!notifications)}
          >
            <View style={{ flex: 1 }}>
              <AppText weight="medium" style={styles.notifTitle}>
                Bildirimler
              </AppText>
              <AppText style={styles.notifHint}>
                Günlük çalışma hatırlatması
              </AppText>
            </View>
            <View
              style={[
                styles.switchTrack,
                notifications && styles.switchTrackOn,
              ]}
            >
              <View
                style={[
                  styles.switchKnob,
                  notifications && styles.switchKnobOn,
                ]}
              />
            </View>
          </Pressable>

          <Pressable
            style={styles.editProfileLink}
            onPress={() => {
              setShowSettingsModal(false);
              navigation.navigate("MyAccount");
            }}
          >
            <AppText weight="medium" style={{ color: colors.accent }}>
              Hesap sayfası
            </AppText>
          </Pressable>
        </View>
      </Sheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  scrollView: { width: "100%" },
  section: {
    marginTop: 32,
    paddingHorizontal: space[4],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 13, color: colors.muted },
  edit: { fontSize: 13, color: colors.accent },
  infoCard: {
    marginTop: 12,
    borderRadius: radii["2xl"],
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: space[4],
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.line,
  },
  infoLabel: { fontSize: 14, color: colors.muted },
  infoValue: { flexShrink: 1, fontSize: 15 },
  editCard: {
    marginTop: 12,
    borderRadius: radii["2xl"],
    backgroundColor: colors.white,
    padding: space[4],
    gap: 16,
  },
  editRow: { flexDirection: "row", gap: 12 },
  editActions: { flexDirection: "row", gap: 10, paddingTop: 4 },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 14 },
  saveBtn: {
    flex: 1,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 14, color: colors.white },
  logoutWrap: {
    marginTop: 32,
    paddingHorizontal: space[4],
  },
  settingsBody: { gap: 24 },
  goalLabel: { fontSize: 12, color: colors.muted },
  goalTrack: {
    marginTop: 8,
    flexDirection: "row",
    gap: 4,
    borderRadius: radii.md,
    backgroundColor: colors.paper,
    padding: 4,
  },
  goalBtn: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  goalBtnOn: {
    backgroundColor: colors.white,
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  goalText: {
    fontSize: 14,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notifTitle: { fontSize: 15 },
  notifHint: { fontSize: 13, color: colors.muted },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bar,
    padding: 2,
    justifyContent: "center",
  },
  switchTrackOn: { backgroundColor: colors.accent },
  switchKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  switchKnobOn: { alignSelf: "flex-end" },
  editProfileLink: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;
