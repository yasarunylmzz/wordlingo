import React, { useState } from "react";
import { Pressable, TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import TextField from "./TextField";
import { colors } from "../../../theme/theme";

type Props = Omit<TextInputProps, "secureTextEntry"> & {
  label: string;
  error?: string;
};

export default function PasswordField(props: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      secureTextEntry={!visible}
      trailing={
        <Pressable
          accessibilityLabel={visible ? "Şifreyi gizle" : "Şifreyi göster"}
          onPress={() => setVisible((v) => !v)}
          hitSlop={8}
          style={{
            marginRight: -4,
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {visible ? (
            <EyeOff size={18} color={colors.muted} />
          ) : (
            <Eye size={18} color={colors.muted} />
          )}
        </Pressable>
      }
    />
  );
}
