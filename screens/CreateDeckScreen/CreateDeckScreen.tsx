import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ChevronLeft } from "lucide-react-native";
import { useAuthStore } from "../../stores/userStore";
import { usePrefsStore } from "../../stores/prefsStore";
import { createDesk } from "../../services/deckService";
import { RootStackParamList } from "../RootStackParams";
import Field from "../../Components/ui/Field";
import AppText from "../../Components/ui/AppText";
import { colors, deckTones, radii, space } from "../../theme/theme";

const CreateDeck: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState(0);
  const [saving, setSaving] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const userId = useAuthStore((state) => state.user.id);
  const setDeckTone = usePrefsStore((s) => s.setDeckTone);

  const handleCreateDeck = async () => {
    if (!title.trim()) return;
    if (!userId) return;
    setSaving(true);
    try {
      const res = await createDesk(
        title.trim(),
        description.trim() || title.trim(),
        null,
      );
      const newId =
        res?.data?.data?.ID ??
        res?.data?.ID ??
        res?.data?.data?.id ??
        res?.data?.id;
      if (newId) setDeckTone(String(newId), tone);
      navigation.navigate("CreateCard");
    } catch (error: any) {
      const msg =
        error.response?.data?.message || error.message || "Bilinmeyen hata";
      alert(`Hata: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const valid = !!title.trim();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Geri"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.back,
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <ChevronLeft size={20} color={colors.ink} strokeWidth={2} />
        </Pressable>
        <AppText weight="semibold" style={styles.headerTitle}>
          Yeni deste
        </AppText>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
        >
          <Field
            label="Ad"
            autoFocus
            value={title}
            onChangeText={setTitle}
            placeholder="Örn. Phrasal Verbs"
          />
          <View style={{ height: 16 }} />
          <Field
            label="Açıklama"
            value={description}
            onChangeText={setDescription}
            placeholder="İsteğe bağlı"
          />
          <View style={{ height: 16 }} />
          <AppText weight="medium" style={styles.colorLabel}>
            Renk
          </AppText>
          <View style={styles.tones}>
            {deckTones.map((t, i) => (
              <Pressable
                key={i}
                accessibilityLabel={`Renk ${i + 1}`}
                onPress={() => setTone(i)}
                style={[
                  styles.toneBtn,
                  { backgroundColor: t.bg },
                  tone === i && styles.toneSelected,
                ]}
              >
                <View style={[styles.toneDot, { backgroundColor: t.dot }]} />
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={!valid || saving}
            onPress={handleCreateDeck}
            style={[
              styles.submit,
              (!valid || saving) && styles.submitDisabled,
            ]}
          >
            <AppText
              weight="semibold"
              style={[
                styles.submitText,
                (!valid || saving) && styles.submitTextDisabled,
              ]}
            >
              Oluştur
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: space[4],
    paddingVertical: 8,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    letterSpacing: -0.255,
  },
  form: {
    paddingHorizontal: space[5],
    paddingTop: space[4],
    paddingBottom: 40,
  },
  colorLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
  },
  tones: {
    flexDirection: "row",
    gap: 10,
  },
  toneBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  toneSelected: {
    borderWidth: 2,
    borderColor: "rgba(22,21,29,0.8)",
  },
  toneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footer: {
    paddingHorizontal: space[5],
    paddingBottom: space[5],
  },
  submit: {
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: {
    backgroundColor: colors.bar,
  },
  submitText: {
    fontSize: 15,
    color: colors.white,
  },
  submitTextDisabled: {
    color: colors.muted,
  },
});

export default CreateDeck;
