import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { MailCheck } from "lucide-react-native";
import Sheet from "../Sheet";
import Field from "../Field";
import AppText from "../AppText";
import { forgotPassword } from "../../../services/userService";
import { colors, radii } from "../../../theme/theme";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

type Props = {
  visible: boolean;
  initial: string;
  onClose: () => void;
};

/**
 * Password reset sheet.
 * API gap: no `forgotPassword` / `resetPassword` on userService or authService.
 * UI matches prototype; submit marks sent locally only (TODO when API lands).
 */
export default function ForgotPasswordSheet({
  visible,
  initial,
  onClose,
}: Props) {
  const [email, setEmail] = useState(isEmail(initial) ? initial : "");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const send = async () => {
    if (!isEmail(email)) return;
    setSubmitting(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
      // Method exists but backend endpoint does not — still show the sheet
      // confirmation so UX is testable, with an honest API note below.
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet title="Şifreni sıfırla" visible={visible} onClose={onClose}>
      {sent ? (
        <View>
          <View style={styles.icon}>
            <MailCheck size={22} color={colors.accent} />
          </View>
          <AppText style={styles.body}>
            <AppText weight="semibold">{email}</AppText> adresine bir sıfırlama
            bağlantısı gönderdik.
          </AppText>
          <AppText style={styles.hint}>
            Gelen kutunu ve spam klasörünü kontrol et.
          </AppText>
          <AppText style={styles.apiNote}>
            Not: Sıfırlama API’si henüz bağlı değil; bağlantı gönderilmemiş
            olabilir.
          </AppText>
          <Pressable style={styles.primary} onPress={onClose}>
            <AppText weight="semibold" style={styles.primaryText}>
              Tamam
            </AppText>
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: 16 }}>
          <AppText style={styles.hint}>
            Hesabına bağlı e-posta adresini gir, sana bir sıfırlama bağlantısı
            gönderelim.
          </AppText>
          <Field
            label="E-posta"
            autoFocus
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@mail.com"
          />
          <Pressable
            disabled={!isEmail(email) || submitting}
            onPress={send}
            style={[
              styles.primary,
              (!isEmail(email) || submitting) && styles.primaryDisabled,
            ]}
          >
            <AppText
              weight="semibold"
              style={[
                styles.primaryText,
                (!isEmail(email) || submitting) && { color: colors.muted },
              ]}
            >
              Bağlantı gönder
            </AppText>
          </Pressable>
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { marginTop: 16, fontSize: 15, lineHeight: 22.5 },
  hint: { marginTop: 4, fontSize: 13, color: colors.muted, lineHeight: 20 },
  apiNote: {
    marginTop: 12,
    fontSize: 12,
    color: colors.wrong,
    lineHeight: 18,
  },
  primary: {
    marginTop: 24,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryDisabled: { backgroundColor: colors.bar },
  primaryText: { fontSize: 15, color: colors.white },
});
