import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Animated,
  Image,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const TodoComponents = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", title: "Complete React Native project", completed: false },
    { id: "2", title: "Study for exams", completed: false },
    { id: "3", title: "Read a new book", completed: true },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        { id: (todos.length + 1).toString(), title: newTodo, completed: false },
      ]);
      setNewTodo("");
      setModalVisible(false);
    }
  };

  const handleEditTodo = () => {
    if (currentTodo && newTodo.trim() !== "") {
      setTodos(
        todos.map((todo) =>
          todo.id === currentTodo.id ? { ...todo, title: newTodo } : todo
        )
      );
      setNewTodo("");
      setCurrentTodo(null);
      setModalVisible(false);
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const renderRightActions = (progress: any, dragX: any, item: Todo) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setCurrentTodo(item);
            setNewTodo(item.title);
            setModalVisible(true);
          }}
        >
          <MaterialIcons name="edit" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteTodo(item.id)}
        >
          <MaterialIcons name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Todo; index: number }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
    >
      <View style={[styles.todoItem, index === 0 && styles.firstTodoItem]}>
        <View style={styles.todoContent}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              setTodos(
                todos.map((todo) =>
                  todo.id === item.id
                    ? { ...todo, completed: !todo.completed }
                    : todo
                )
              )
            }
          >
            <View style={[styles.checkbox, item.completed && styles.checked]}>
              {item.completed && (
                <MaterialIcons name="check" size={16} color="white" />
              )}
            </View>
          </TouchableOpacity>
          <Text
            style={[styles.todoText, item.completed && styles.completedText]}
          >
            {item.title}
          </Text>
        </View>
        <View style={styles.priorityIndicator} />
      </View>
    </Swipeable>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        ✨ No tasks yet{"\n"}Add your first task to get started!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.header}>Today's Tasks</Text>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{todos.length}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setNewTodo("");
            setCurrentTodo(null);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentTodo ? "Edit Task" : "Add New Task"}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="What do you need to do?"
              value={newTodo}
              onChangeText={setNewTodo}
              placeholderTextColor="#9ca3af"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setNewTodo("");
                  setCurrentTodo(null);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={currentTodo ? handleEditTodo : handleAddTodo}
              >
                <Text style={styles.saveButtonText}>
                  {currentTodo ? "Save" : "Add Task"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#4f42d8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginRight: 12,
  },
  countContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e0f2fe",
  },
  countText: {
    color: "#0369a1",
    fontSize: 13,
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#4f42d8",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: "#4f42d8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 18,
    borderRadius: 16,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  firstTodoItem: {
    backgroundColor: "#fef7ff",
    borderLeftWidth: 4,
    borderLeftColor: "#4f42d8",
    borderColor: "#e9d5ff",
  },
  todoContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: 15,
    transform: [{ scale: 1.1 }],
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: "#4f42d8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checked: {
    backgroundColor: "#4f42d8",
    borderColor: "#4f42d8",
  },
  todoText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
    fontWeight: "600",
    lineHeight: 22,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
    fontWeight: "400",
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#f59e0b",
    marginLeft: 12,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    width: 130,
    justifyContent: "space-between",
    paddingRight: 12,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 55,
    height: 55,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editButton: {
    backgroundColor: "#10b981",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  separator: {
    height: 12,
  },
  listContent: {
    paddingTop: 5,
    paddingBottom: 15,
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  modalContent: {
    width: "88%",
    backgroundColor: "#fff",
    padding: 28,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2937",
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    borderColor: "#d1d5db",
    borderWidth: 2,
    borderRadius: 14,
    padding: 18,
    marginBottom: 28,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    color: "#111827",
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cancelButtonText: {
    color: "#4b5563",
    fontWeight: "700",
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#4f42d8",
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    shadowColor: "#4f42d8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default TodoComponents;
