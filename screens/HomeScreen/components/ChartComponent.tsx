import React, { useMemo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import AppText from "../../../Components/ui/AppText";
import { colors, radii, space } from "../../../theme/theme";

const CHART_H = 132;

function lastSevenDays() {
  const fmt = new Intl.DateTimeFormat("tr-TR", { weekday: "short" });
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return fmt.format(d).replace(".", "");
  });
}

const ChartComponent = ({
  data,
}: {
  data: { value: number }[];
  dates?: string[];
}) => {
  const values = data.map((item) => item.value);
  const days = useMemo(lastSevenDays, []);
  const [selected, setSelected] = useState(6);

  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / values.length);
  const scale = (v: number) => (v / max) * CHART_H;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <AppText style={styles.headerTitle}>Son 7 gün</AppText>
          <AppText weight="semibold" style={styles.bigStat}>
            {values[selected]}
            <AppText weight="medium" style={styles.bigStatUnit}>
              {" "}
              kart · {selected === 6 ? "bugün" : days[selected]}
            </AppText>
          </AppText>
        </View>
        <View style={styles.rightStats}>
          <AppText style={styles.sideStat}>
            Ortalama{" "}
            <AppText weight="medium" style={styles.sideStatInk}>
              {avg}
            </AppText>
          </AppText>
          <AppText style={styles.sideStat}>
            En yüksek{" "}
            <AppText weight="medium" style={styles.sideStatInk}>
              {max}
            </AppText>
          </AppText>
        </View>
      </View>

      <View style={[styles.chartArea, { height: CHART_H }]}>
        <View
          pointerEvents="none"
          style={[styles.avgLine, { bottom: scale(avg) }]}
        >
          <AppText weight="mono" style={styles.avgLabel}>
            ort
          </AppText>
        </View>
        <View style={styles.barsRow}>
          {values.map((v, i) => {
            const active = i === selected;
            return (
              <Pressable
                key={i}
                accessibilityLabel={`${days[i]}: ${v} kart`}
                onPress={() => setSelected(i)}
                style={styles.barHit}
              >
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(scale(v), 4),
                      backgroundColor: active ? colors.accent : colors.bar,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.daysRow}>
        {days.map((d, i) => (
          <AppText
            key={i}
            weight={i === selected ? "semibold" : "regular"}
            style={[
              styles.dayLabel,
              { color: i === selected ? colors.accent : colors.muted },
            ]}
          >
            {d}
          </AppText>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 13,
    color: colors.muted,
  },
  bigStat: {
    marginTop: 4,
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1.19,
    fontVariant: ["tabular-nums"],
  },
  bigStatUnit: {
    fontSize: 15,
    letterSpacing: 0,
    color: colors.muted,
  },
  rightStats: {
    alignItems: "flex-end",
  },
  sideStat: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  sideStatInk: {
    fontSize: 12,
    color: colors.ink,
  },
  chartArea: {
    marginTop: 24,
    position: "relative",
  },
  avgLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderStyle: "dashed",
    borderColor: "rgba(22,21,29,0.25)",
  },
  avgLabel: {
    position: "absolute",
    right: 0,
    top: -10,
    backgroundColor: colors.paper,
    paddingLeft: 6,
    fontSize: 10,
    color: colors.muted,
  },
  barsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  barHit: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: radii.sm,
  },
  daysRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    textTransform: "capitalize",
  },
});

export default ChartComponent;
