import React, { useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Plus } from "lucide-react-native";
import { useDecks } from "./hooks/useDecks";
import DeckCard from "./components/DeckCard";
import AppText from "../../Components/ui/AppText";
import { colors, radii, space } from "../../theme/theme";

const AllDesks = () => {
  const { deskList, refreshing, isDeleting, onRefresh, deleteDeck } =
    useDecks();
  const navigation = useNavigation<any>();
  const swipeableRowRefs = useRef<Record<string, any>>({});

  const setSwipeableRef = (id: string, ref: any) => {
    swipeableRowRefs.current[id] = ref;
  };

  const closeOtherSwipeables = (key: string) => {
    Object.keys(swipeableRowRefs.current).forEach((k) => {
      if (k !== key && swipeableRowRefs.current[k]) {
        swipeableRowRefs.current[k].close();
      }
    });
  };

  const totalCards = (deskList || []).reduce(
    (a: number, d: any) => a + (d.cardCount ?? d.CardCount ?? 0),
    0,
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <AppText weight="semibold" style={styles.headerTitle}>
            Desteler
          </AppText>
          <AppText style={styles.subtitle}>
            {(deskList || []).length} deste · {totalCards} kart
          </AppText>
        </View>
        <Pressable
          accessibilityLabel="Yeni deste"
          onPress={() => navigation.navigate("CreateDeck")}
          style={({ pressed }) => [
            styles.addButton,
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Plus size={20} color={colors.white} strokeWidth={2.25} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScrollBeginDrag={() => {
          Object.keys(swipeableRowRefs.current).forEach((k) => {
            swipeableRowRefs.current[k]?.close();
          });
        }}
      >
        {!deskList || deskList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppText weight="semibold" style={styles.emptyTitle}>
              Henüz desten yok
            </AppText>
            <AppText style={styles.emptyText}>
              İlk desteni oluşturarak başla.
            </AppText>
          </View>
        ) : (
          <View style={styles.list}>
            {deskList.map((deck: any, index: number) => (
              <DeckCard
                key={deck.ID}
                deck={deck}
                index={index}
                onDelete={deleteDeck}
                isDeleting={isDeleting}
                setSwipeableRef={setSwipeableRef}
                closeOtherSwipeables={closeOtherSwipeables}
              />
            ))}
          </View>
        )}
      </ScrollView>
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
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: space[5],
    paddingTop: space[3],
  },
  headerTitle: {
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: -1.05,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: space[4],
    paddingTop: 24,
    paddingBottom: 120,
  },
  list: {
    borderRadius: radii["2xl"],
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  emptyContainer: {
    marginTop: 64,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
  },
  emptyText: {
    marginTop: 4,
    fontSize: 14,
    color: colors.muted,
  },
});

export default AllDesks;
