import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Sheet from "../../../Components/ui/Sheet";
import Field from "../../../Components/ui/Field";
import AppText from "../../../Components/ui/AppText";
import { colors, radii } from "../../../theme/theme";

interface CardModalProps {
  visible: boolean;
  isEditMode: boolean;
  word1: string;
  word2: string;
  importanceLevel: "low" | "medium" | "high";
  onWord1Change: (text: string) => void;
  onWord2Change: (text: string) => void;
  onImportanceChange: (level: "low" | "medium" | "high") => void;
  onSave: () => void;
  onCancel: () => void;
}

const CardModal: React.FC<CardModalProps> = ({
  visible,
  isEditMode,
  word1,
  word2,
  onWord1Change,
  onWord2Change,
  onSave,
  onCancel,
}) => {
  const [added, setAdded] = useState<string | null>(null);
  const valid = !!word1.trim() && !!word2.trim();

  return (
    <Sheet
      title={isEditMode ? "Kartı düzenle" : "Kart ekle"}
      visible={visible}
      onClose={onCancel}
    >
      <View style={styles.form}>
        <Field
          label="Kelime"
          autoFocus
          value={word1}
          onChangeText={onWord1Change}
          placeholder="Örn. ephemeral"
        />
        <Field
          label="Anlamı"
          value={word2}
          onChangeText={onWord2Change}
          placeholder="Örn. geçici, kısa ömürlü"
        />
        <AppText style={styles.added}>
          {added ? `“${added}” eklendi` : " "}
        </AppText>
        <Pressable
          disabled={!valid}
          onPress={() => {
            const w = word1.trim();
            onSave();
            if (!isEditMode && w) setAdded(w);
          }}
          style={[styles.submit, !valid && styles.submitDisabled]}
        >
          <AppText
            weight="semibold"
            style={[styles.submitText, !valid && { color: colors.muted }]}
          >
            {isEditMode ? "Kaydet" : "Ekle"}
          </AppText>
        </Pressable>
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  form: { gap: 16 },
  added: {
    height: 16,
    fontSize: 12,
    color: colors.accent,
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
});

export default CardModal;
