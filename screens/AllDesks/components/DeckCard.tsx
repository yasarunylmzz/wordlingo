import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SwipeableDeleteAction from "./SwipableDeleteAction";
import { RootStackParamList } from "../../RootStackParams";
import AppText from "../../../Components/ui/AppText";
import { usePrefsStore } from "../../../stores/prefsStore";
import {
  colors,
  deckInitials,
  deckTones,
  radii,
  space,
} from "../../../theme/theme";

interface DeckCardProps {
  deck: any;
  index: number;
  onDelete: (deckId: string, deckTitle: string) => void;
  isDeleting?: boolean;
  setSwipeableRef: (id: string, ref: any) => void;
  closeOtherSwipeables: (id: string) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  index,
  onDelete,
  isDeleting = false,
  setSwipeableRef,
  closeOtherSwipeables,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const getDeckTone = usePrefsStore((s) => s.getDeckTone);
  const tone = deckTones[getDeckTone(deck.ID, index) % deckTones.length];
  const title = deck.Title ?? deck.title ?? "";
  const description = deck.Description ?? deck.description ?? "";
  const count = deck.cardCount ?? deck.CardCount ?? 0;

  return (
    <Swipeable
      ref={(ref) => setSwipeableRef(deck.ID, ref)}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
      overshootRight={false}
      onSwipeableOpen={() => closeOtherSwipeables(deck.ID)}
      renderRightActions={(progress, dragX) => (
        <SwipeableDeleteAction
          progress={progress}
          dragX={dragX}
          onDelete={() => onDelete(deck.ID, title)}
          isDeleting={isDeleting}
        />
      )}
    >
      <Pressable
        style={({ pressed }) => [
          styles.row,
          pressed && { backgroundColor: "rgba(245,245,248,0.85)" },
        ]}
        onPress={() => {
          navigation.navigate("CardDecks", {
            deckId: deck.ID,
            deckTitle: title,
          });
        }}
      >
        <View style={[styles.avatar, { backgroundColor: tone.bg }]}>
          <AppText weight="semibold" style={[styles.avatarText, { color: tone.fg }]}>
            {deckInitials(title || "?")}
          </AppText>
        </View>
        <View style={styles.content}>
          <AppText weight="semibold" style={styles.title} numberOfLines={1}>
            {title}
          </AppText>
          {!!description && (
            <AppText style={styles.desc} numberOfLines={1}>
              {description}
            </AppText>
          )}
        </View>
        {count > 0 ? (
          <AppText weight="medium" style={styles.count}>
            {count} <AppText style={styles.countMuted}>kart</AppText>
          </AppText>
        ) : (
          <View style={styles.emptyBadge}>
            <AppText style={styles.emptyBadgeText}>Boş</AppText>
          </View>
        )}
        <ChevronRight size={16} color="rgba(111,109,123,0.6)" />
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: space[4],
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.line,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    letterSpacing: -0.14,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    letterSpacing: -0.16,
  },
  desc: {
    fontSize: 13,
    color: colors.muted,
  },
  count: {
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  countMuted: {
    fontSize: 13,
    color: colors.muted,
  },
  emptyBadge: {
    borderRadius: radii.full,
    backgroundColor: colors.paper,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  emptyBadgeText: {
    fontSize: 12,
    color: colors.muted,
  },
});

export default DeckCard;
