import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import React, { useState, useEffect } from "react";
import PlayIcon from "../../../svg/PlayIcon";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../RootStackParams";

interface BottomButtonProps {
  deckId: string;
  deckTitle: string;
}

const BottomButton: React.FC<BottomButtonProps> = ({ deckId, deckTitle }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const [itemAnims] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    if (isDropDownVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      itemAnims.forEach((anim, index) => {
        const delay = (itemAnims.length - 1 - index) * 100;
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: delay,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      itemAnims.forEach((anim) => anim.setValue(0));
    }
  }, [isDropDownVisible]);

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        onPress={() => setIsDropDownVisible(!isDropDownVisible)}
        style={[
          styles.buttonStyles,
          {
            backgroundColor: "#4f42d8",
            shadowColor: "#4f42d8",
            flexDirection: "row",
            alignItems: "center",
            width: 180,
          },
        ]}
      >
        <PlayIcon />
        <Text style={styles.buttonText}>Play</Text>
        <Text style={{ color: "white", fontSize: 12 }}>
          {isDropDownVisible ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>

      <View style={[styles.dropDown, { width: isDropDownVisible ? 240 : 0 }]}>
        {/* Dropdown içeriği */}
        {isDropDownVisible && (
          <>
            <Text style={styles.dropdownTitle}>Çalışma Modu Seç</Text>
            <View style={styles.dropdownDivider} />

            <Animated.View
              style={{
                opacity: itemAnims[0],
                transform: [
                  {
                    translateY: itemAnims[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("LearnScreen", { deckId, deckTitle })
                }
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownText}>📚 Öğrenme Modu</Text>
                <Text style={styles.dropdownSubtext}>Deck quiz</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={{
                opacity: itemAnims[1],
                transform: [
                  {
                    translateY: itemAnims[1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() =>
                  navigation.navigate("FlipCardScreen", {
                    deckId,
                    deckTitle,
                  })
                }
              >
                <Text style={styles.dropdownText}>🃏 Kartları Çevir</Text>
                <Text style={styles.dropdownSubtext}>
                  Sağ doğru · Sol yanlış
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={{
                opacity: itemAnims[2],
                transform: [
                  {
                    translateY: itemAnims[2].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>🔀 Karıştırılmış</Text>
                <Text style={styles.dropdownSubtext}>Rastgele sıra</Text>
              </TouchableOpacity>
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonStyles: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    borderRadius: 15,
    paddingVertical: 8,
    width: "45%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },

  dropDown: {
    position: "absolute",
    backgroundColor: "white",
    top: -260,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#4f42d8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 999,
  },
  dropdownTitle: {
    padding: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#4f42d8",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 12,
  },
  dropdownItem: {
    padding: 14,
    paddingHorizontal: 16,
    flexDirection: "column",
    gap: 4,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2d2d2d",
  },
  dropdownSubtext: {
    fontSize: 12,
    color: "#888",
  },
});

export default BottomButton;
