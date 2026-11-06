import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { Check, Plus, X } from "lucide-react-native";
import AppText from "../../../Components/ui/AppText";
import { usePrefsStore, Priority } from "../../../stores/prefsStore";
import { colors, fonts, radii, space } from "../../../theme/theme";

const priorityColor: Record<Priority, string> = {
  yüksek: colors.priorityHigh,
  orta: colors.priorityMid,
  düşük: colors.bar,
};

const TodoComponents = () => {
  const todos = usePrefsStore((s) => s.todos);
  const addTodo = usePrefsStore((s) => s.addTodo);
  const toggleTodo = usePrefsStore((s) => s.toggleTodo);
  const removeTodo = usePrefsStore((s) => s.removeTodo);

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<TextInput>(null);

  const done = todos.filter((t) => t.done).length;
  const sorted = [...todos].sort((a, b) => Number(a.done) - Number(b.done));

  const submit = () => {
    const title = draft.trim();
    if (!title) {
      setAdding(false);
      return;
    }
    addTodo(title);
    setDraft("");
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <AppText weight="semibold" style={styles.header}>
            Bugün
          </AppText>
          <AppText weight="mono" style={styles.countText}>
            {done}/{todos.length}
          </AppText>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          onPress={() => {
            setAdding(true);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        >
          <Plus size={15} color={colors.accent} strokeWidth={2.25} />
          <AppText weight="semibold" style={styles.addButtonText}>
            Ekle
          </AppText>
        </Pressable>
      </View>

      <View style={styles.list}>
        {sorted.map((t) => (
          <View key={t.id} style={styles.todoItem}>
            <Pressable
              accessibilityLabel={
                t.done
                  ? "Tamamlanmadı olarak işaretle"
                  : "Tamamlandı olarak işaretle"
              }
              onPress={() => toggleTodo(t.id)}
              style={[styles.checkbox, t.done && styles.checked]}
            >
              {t.done && <Check size={13} color={colors.white} strokeWidth={3} />}
            </Pressable>
            <AppText
              style={[styles.todoText, t.done && styles.completedText]}
            >
              {t.title}
            </AppText>
            {!t.done && (
              <View style={styles.priority}>
                <View
                  style={[
                    styles.priorityDot,
                    { backgroundColor: priorityColor[t.priority] },
                  ]}
                />
                <AppText style={styles.priorityText}>{t.priority}</AppText>
              </View>
            )}
            <Pressable
              accessibilityLabel="Görevi sil"
              onPress={() => removeTodo(t.id)}
              hitSlop={8}
              style={styles.deleteBtn}
            >
              <X size={15} color={colors.muted} />
            </Pressable>
          </View>
        ))}

        {adding && (
          <View style={styles.addRow}>
            <View style={styles.dashedBox} />
            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={setDraft}
              onBlur={() => {
                if (!draft.trim()) setAdding(false);
              }}
              onSubmitEditing={submit}
              placeholder="Yeni görev"
              placeholderTextColor="rgba(111,109,123,0.7)"
              style={styles.input}
              autoFocus
              returnKeyType="done"
            />
          </View>
        )}
      </View>

      {todos.length === 0 && !adding && (
        <AppText style={styles.emptyText}>Bugün için görev yok.</AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  header: {
    fontSize: 20,
    letterSpacing: -0.4,
  },
  countText: {
    fontSize: 12,
    color: colors.muted,
    fontVariant: ["tabular-nums"],
  },
  addButton: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: radii.full,
    backgroundColor: colors.accentSoft,
    paddingLeft: 10,
    paddingRight: 12,
  },
  addButtonText: {
    fontSize: 13,
    color: colors.accent,
  },
  pressed: { transform: [{ scale: 0.95 }] },
  list: {
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: colors.line,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.line,
    paddingVertical: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: "rgba(22,21,29,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  todoText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: colors.ink,
  },
  completedText: {
    color: colors.muted,
    textDecorationLine: "line-through",
    textDecorationColor: "rgba(22,21,29,0.3)",
  },
  priority: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 11,
    color: colors.muted,
  },
  deleteBtn: {
    padding: 2,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.line,
    paddingVertical: 8,
  },
  dashedBox: {
    width: 22,
    height: 22,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(22,21,29,0.3)",
  },
  input: {
    flex: 1,
    height: 36,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.ink,
  },
  emptyText: {
    paddingVertical: 32,
    textAlign: "center",
    fontSize: 14,
    color: colors.muted,
  },
});

export default TodoComponents;
