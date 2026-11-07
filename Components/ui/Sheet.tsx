import React, { ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import AppText from "./AppText";
import { colors, radii, space } from "../../theme/theme";

type Props = {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Sheet({ title, visible, onClose, children }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Kapat"
        />
        <View style={styles.sheet} accessibilityRole="summary">
          <View style={styles.handle} />
          <View style={styles.header}>
            <AppText weight="semibold" style={styles.title}>
              {title}
            </AppText>
            <Pressable
              onPress={onClose}
              accessibilityLabel="Kapat"
              style={styles.close}
            >
              <X size={16} color={colors.muted} />
            </Pressable>
          </View>
          <View style={styles.body}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.inkOverlay,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii["3xl"],
    borderTopRightRadius: radii["3xl"],
    paddingHorizontal: space[5],
    paddingTop: space[3],
    paddingBottom: space[9],
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.line,
  },
  header: {
    marginTop: space[4],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.4,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    marginTop: space[5],
  },
});
