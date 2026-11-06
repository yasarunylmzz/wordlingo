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
import { loginUser } from "../../services/userService";
import { useAuthStore } from "../../stores/userStore";
import AppText from "../../Components/ui/AppText";
import TextField from "../../Components/ui/auth/TextField";
import PasswordField from "../../Components/ui/auth/PasswordField";
import SubmitButton from "../../Components/ui/auth/SubmitButton";
import ForgotPasswordSheet from "../../Components/ui/auth/ForgotPasswordSheet";
import { colors, radii, space } from "../../theme/theme";

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  const errors = {
    identity: !identity.trim()
      ? "E-posta ya da kullanıcı adını gir."
      : undefined,
    password: !password ? "Şifreni gir." : undefined,
  };
  const show = (k: keyof typeof errors) => (submitted ? errors[k] : undefined);

  const submit = async () => {
    setSubmitted(true);
    if (errors.identity || errors.password) return;

    setLoading(true);
    try {
      const response = await loginUser(identity.trim(), password);
      useAuthStore.getState().setAuthData({
        user: {
          id: response.data.user.id,
          name: response.data.user.name,
          surname: response.data.user.surname,
          username: response.data.user.username,
          email: response.data.user.email,
        },
        auth: {
          accessToken: response.headers.access_token,
          refreshToken: response.headers.refresh_token,
        },
      });

      if (response.status === 203) {
        navigation.navigate("TwoFactorAuth");
      }
      // status 200: auth store remounts authenticated stack
    } catch (error: any) {
      if (error.code === "ECONNABORTED") {
        Alert.alert(
          "Bağlantı Hatası",
          "Sunucuya bağlanırken zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.",
        );
      } else if (error.response) {
        Alert.alert(
          "Giriş Başarısız",
          error.response.data?.message || "Giriş bilgilerini kontrol et.",
        );
      } else if (error.request) {
        Alert.alert(
          "Sunucu Hatası",
          "Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar dene.",
        );
      } else {
        Alert.alert("Giriş Başarısız", "Bir hata oluştu, lütfen tekrar dene.");
      }
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
            Tekrar hoş geldin.
          </AppText>
          <AppText style={styles.subtitle}>
            Kaldığın yerden devam etmek için giriş yap.
          </AppText>

          <View style={styles.form}>
            <TextField
              label="E-posta ya da kullanıcı adı"
              value={identity}
              onChangeText={setIdentity}
              placeholder="ornek@mail.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              error={show("identity")}
            />
            <View>
              <PasswordField
                label="Şifre"
                value={password}
                onChangeText={setPassword}
                placeholder="Şifren"
                autoCapitalize="none"
                error={show("password")}
              />
              <Pressable
                onPress={() => setForgotOpen(true)}
                style={styles.forgot}
              >
                <AppText weight="medium" style={styles.forgotText}>
                  Şifremi unuttum
                </AppText>
              </Pressable>
            </View>
            <View style={{ paddingTop: 8 }}>
              <SubmitButton loading={loading} onPress={submit}>
                {loading ? "Giriş yapılıyor" : "Giriş yap"}
              </SubmitButton>
            </View>
          </View>

          {/* Social providers: no OAuth wiring in app — omitted per brief. */}

          <View style={styles.footer}>
            <AppText style={styles.footerText}>Hesabın yok mu? </AppText>
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              <AppText weight="semibold" style={styles.footerLink}>
                Hesap oluştur
              </AppText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ForgotPasswordSheet
        visible={forgotOpen}
        initial={identity}
        onClose={() => setForgotOpen(false)}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;

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
  forgot: { marginTop: 8, alignSelf: "flex-end" },
  forgotText: { fontSize: 13, color: colors.accent },
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
