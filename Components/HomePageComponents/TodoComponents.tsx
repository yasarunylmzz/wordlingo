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

const TodoComponents = () => {
  const [todos, setTodos] = useState([
    { id: "1", title: "Complete React Native project", completed: false },
    { id: "2", title: "Study for exams", completed: false },
    { id: "3", title: "Read a new book", completed: true },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
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

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const renderRightActions = (progress, dragX, item) => {
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

  const renderItem = ({ item, index }) => (
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
        No tasks yet. Add one to get started!
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
    borderRadius: 16,
    marginTop: 15,
    padding: 18,
    marginBottom: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 10,
  },
  countContainer: {
    backgroundColor: "#EEEDFC",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countText: {
    color: "#4f42d8",
    fontSize: 12,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4f42d8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: "#4f42d8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
  },
  firstTodoItem: {
    borderLeftWidth: 3,
    borderLeftColor: "#4f42d8",
  },
  todoContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#4f42d8",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#4f42d8",
  },
  todoText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
    fontWeight: "500",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFBA0A",
    marginLeft: 8,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  editButton: {
    backgroundColor: "#10B981", // Green color
  },
  deleteButton: {
    backgroundColor: "#EF4444", // Red color
  },
  separator: {
    height: 10,
  },
  listContent: {
    paddingTop: 5,
    paddingBottom: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#4f42d8",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
    shadowColor: "#4f42d8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default TodoComponents;
