import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import {
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParams";
import { createUser } from "../../services/userService";
import AppText from "../../Components/ui/AppText";
import TextField from "../../Components/ui/auth/TextField";
import PasswordField from "../../Components/ui/auth/PasswordField";
import SubmitButton from "../../Components/ui/auth/SubmitButton";
import { colors, radii, space } from "../../theme/theme";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function passwordStrength(pw: string) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-zçğıöşü]/.test(pw) && /[A-ZÇĞİÖŞÜ]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9çğıöşüÇĞİÖŞÜ]/.test(pw)) score++;
  return Math.max(score, 1);
}

const strengthLabels = ["", "Zayıf", "Orta", "İyi", "Güçlü"];
const strengthColors = [
  "",
  colors.wrong,
  "#f5a524",
  colors.accent,
  colors.correct,
];

const SignInScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const username = form.username.trim().replace(/^@/, "");
  const errors: Partial<Record<keyof typeof form, string>> = {
    firstName: !form.firstName.trim() ? "Adını gir." : undefined,
    lastName: !form.lastName.trim() ? "Soyadını gir." : undefined,
    username: !username
      ? "Bir kullanıcı adı seç."
      : !/^[a-z0-9._]{3,}$/i.test(username)
        ? "En az 3 karakter; harf, rakam, nokta ya da alt çizgi."
        : undefined,
    email: !isEmail(form.email) ? "Geçerli bir e-posta adresi gir." : undefined,
    password:
      form.password.length < 8 ? "Şifre en az 8 karakter olmalı." : undefined,
  };
  const show = (k: keyof typeof form) => (submitted ? errors[k] : undefined);
  const strength = passwordStrength(form.password);

  const submit = async () => {
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;

    setLoading(true);
    try {
      const response = await createUser(
        form.email.trim(),
        form.password,
        form.firstName.trim(),
        form.lastName.trim(),
        username,
      );
      if (response && response.data) {
        navigation.navigate("TwoFactorAuth");
      } else {
        Alert.alert("Kayıt", "Hesap oluşturulamadı, tekrar dene.");
      }
    } catch (error: any) {
      Alert.alert(
        "Kayıt Başarısız",
        error?.response?.data?.message || "Bir hata oluştu, lütfen tekrar dene.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.top}>
          <Pressable
            accessibilityLabel="Geri"
            onPress={() => navigation.navigate("Welcome")}
            style={styles.back}
          >
            <ChevronLeft size={20} color={colors.ink} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppText weight="semibold" style={styles.title}>
            Hesabını oluştur.
          </AppText>
          <AppText style={styles.subtitle}>
            Birkaç bilgiyle hemen başlayalım.
          </AppText>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextField
                  label="Ad"
                  value={form.firstName}
                  onChangeText={set("firstName")}
                  placeholder="Adın"
                  autoComplete="given-name"
                  error={show("firstName")}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextField
                  label="Soyad"
                  value={form.lastName}
                  onChangeText={set("lastName")}
                  placeholder="Soyadın"
                  autoComplete="family-name"
                  error={show("lastName")}
                />
              </View>
            </View>
            <TextField
              label="Kullanıcı adı"
              prefix="@"
              value={form.username}
              onChangeText={set("username")}
              placeholder="kullaniciadi"
              autoCapitalize="none"
              autoCorrect={false}
              error={show("username")}
            />
            <TextField
              label="E-posta"
              value={form.email}
              onChangeText={set("email")}
              placeholder="ornek@mail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={show("email")}
            />
            <View>
              <PasswordField
                label="Şifre"
                value={form.password}
                onChangeText={set("password")}
                placeholder="En az 8 karakter"
                autoCapitalize="none"
                error={show("password")}
              />
              {form.password ? (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3, 4].map((n) => (
                      <View
                        key={n}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              n <= strength
                                ? strengthColors[strength]
                                : colors.bar,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <AppText weight="medium" style={styles.strengthLabel}>
                    {strengthLabels[strength]}
                  </AppText>
                </View>
              ) : null}
            </View>
            <AppText style={styles.legal}>
              Devam ederek{" "}
              <AppText weight="medium">Kullanım Koşulları</AppText> ve{" "}
              <AppText weight="medium">Gizlilik Politikası</AppText>
              'nı kabul etmiş olursun.
            </AppText>
            <SubmitButton loading={loading} onPress={submit}>
              {loading ? "Hesap oluşturuluyor" : "Hesap oluştur"}
            </SubmitButton>
          </View>

          <View style={styles.footer}>
            <AppText style={styles.footerText}>Zaten hesabın var mı? </AppText>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <AppText weight="semibold" style={styles.footerLink}>
                Giriş yap
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  top: { paddingHorizontal: space[4], paddingTop: 8 },
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: space[6],
    paddingBottom: space[9],
  },
  title: {
    marginTop: 24,
    fontSize: 30,
    lineHeight: 31.5,
    letterSpacing: -1.05,
  },
  subtitle: { marginTop: 8, fontSize: 15, color: colors.muted },
  form: { marginTop: 32, gap: 16 },
  row: { flexDirection: "row", gap: 12 },
  strengthRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  strengthBars: { flex: 1, flexDirection: "row", gap: 4 },
  strengthBar: { flex: 1, height: 4, borderRadius: radii.full },
  strengthLabel: {
    width: 48,
    textAlign: "right",
    fontSize: 12,
    color: colors.muted,
  },
  legal: { fontSize: 12, lineHeight: 18, color: colors.muted },
  footer: {
    marginTop: "auto",
    paddingTop: 32,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  footerText: { fontSize: 14, color: colors.muted },
  footerLink: { fontSize: 14, color: colors.accent },
});
