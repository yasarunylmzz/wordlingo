import React from "react";
import { View, StyleSheet, FlatList, Pressable, ListRenderItem } from "react-native";
import { X } from "lucide-react-native";
import AppText from "../../../Components/ui/AppText";
import { useLearningStore } from "../../../stores/learningStore";
import { colors, levelMeta, radii, space } from "../../../theme/theme";
import type { LearningLevel } from "../../../domain/learning/types";

interface Card {
  id: string;
  word1: string;
  word2: string;
  importanceLevel: "low" | "medium" | "high";
}

interface CardListProps {
  cards: Card[];
  onDeleteCard: (id: string) => void;
  onEditCard: (id: string) => void;
}

function LevelMeter({ level }: { level: LearningLevel }) {
  return (
    <View style={styles.meter} accessibilityLabel={`Seviye ${level}`}>
      {[1, 2, 3].map((n) => (
        <View
          key={n}
          style={[
            styles.meterBar,
            {
              height: 6 + n * 4,
              backgroundColor: n <= level ? colors.accent : colors.bar,
            },
          ]}
        />
      ))}
    </View>
  );
}

const CardList: React.FC<CardListProps> = ({ cards, onDeleteCard, onEditCard }) => {
  const byCardId = useLearningStore((s) => s.byCardId);

  const dist = [0, 1, 2, 3].map(
    (lvl) =>
      cards.filter((c) => (byCardId[c.id]?.learningLevel ?? 0) === lvl).length,
  );
  const count = cards.length;

  const renderItem: ListRenderItem<Card> = ({ item }) => {
    const level = (byCardId[item.id]?.learningLevel ?? 0) as LearningLevel;
    return (
      <Pressable
        onLongPress={() => onEditCard(item.id)}
        style={styles.row}
      >
        <View style={styles.rowText}>
          <AppText weight="semibold" style={styles.front} numberOfLines={1}>
            {item.word1}
          </AppText>
          <AppText style={styles.back} numberOfLines={1}>
            {item.word2}
          </AppText>
        </View>
        <LevelMeter level={level} />
        <Pressable
          accessibilityLabel="Kartı sil"
          onPress={() => onDeleteCard(item.id)}
          style={styles.delete}
          hitSlop={8}
        >
          <X size={15} color={colors.muted} />
        </Pressable>
      </Pressable>
    );
  };

  if (count === 0) {
    return (
      <View style={styles.empty}>
        <AppText weight="semibold" style={styles.emptyTitle}>
          Bu deste boş
        </AppText>
        <AppText style={styles.emptyText}>
          Çalışmaya başlamak için kart ekle.
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <AppText style={styles.statusLabel}>Öğrenme durumu</AppText>
          <AppText style={styles.statusCount}>
            <AppText weight="semibold">{dist[3]}</AppText>
            <AppText style={{ color: colors.muted }}>/{count} öğrenildi</AppText>
          </AppText>
        </View>
        <View style={styles.barTrack}>
          {dist.map((n, i) =>
            n > 0 ? (
              <View
                key={i}
                style={{
                  flex: n,
                  height: "100%",
                  backgroundColor: levelMeta[i].color,
                }}
              />
            ) : null,
          )}
        </View>
        <View style={styles.legend}>
          {levelMeta.map((l, i) => (
            <View key={l.label} style={styles.legendItem}>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <AppText style={styles.legendLabel}>{l.label}</AppText>
              </View>
              <AppText weight="medium" style={styles.legendCount}>
                {dist[i]}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <AppText style={styles.cardsHeading}>Kartlar</AppText>
      <View style={styles.listCard}>
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { width: "100%", paddingHorizontal: space[4], paddingTop: space[4] },
  statusCard: {
    borderRadius: radii["2xl"],
    backgroundColor: colors.white,
    padding: space[4],
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  statusLabel: { fontSize: 13, color: colors.muted },
  statusCount: { fontSize: 13, fontVariant: ["tabular-nums"] },
  barTrack: {
    marginTop: 12,
    height: 8,
    borderRadius: radii.full,
    overflow: "hidden",
    flexDirection: "row",
    gap: 3,
    backgroundColor: colors.paper,
  },
  legend: {
    marginTop: 12,
    flexDirection: "row",
  },
  legendItem: { flex: 1 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendLabel: { fontSize: 11, color: colors.muted },
  legendCount: {
    marginTop: 2,
    paddingLeft: 12,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
  cardsHeading: {
    marginTop: 28,
    paddingHorizontal: 4,
    fontSize: 13,
    color: colors.muted,
  },
  listCard: {
    marginTop: 10,
    borderRadius: radii["2xl"],
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: space[4],
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.line,
  },
  rowText: { flex: 1, minWidth: 0 },
  front: { fontSize: 16, letterSpacing: -0.16 },
  back: { fontSize: 13, color: colors.muted },
  meter: { flexDirection: "row", alignItems: "flex-end", gap: 3 },
  meterBar: { width: 5, borderRadius: radii.full },
  delete: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -4,
  },
  empty: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: space[4],
  },
  emptyTitle: { fontSize: 16 },
  emptyText: { marginTop: 4, fontSize: 14, color: colors.muted },
});

export default CardList;
