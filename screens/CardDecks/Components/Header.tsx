import { View, Pressable, StyleSheet } from "react-native";
import React from "react";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../RootStackParams";
import AppText from "../../../Components/ui/AppText";
import { colors, radii, space } from "../../../theme/theme";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

const Header = ({ title, subtitle }: HeaderProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.appBar}>
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
      <View style={styles.textWrap}>
        <AppText weight="semibold" style={styles.appbarText} numberOfLines={1}>
          {title}
        </AppText>
        {!!subtitle && (
          <AppText style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
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
  textWrap: { flex: 1, minWidth: 0 },
  appbarText: {
    fontSize: 17,
    letterSpacing: -0.255,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
  },
});

export default Header;
