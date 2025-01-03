import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const TodoComponents = () => {
  const [todos, setTodos] = useState([
    { id: "1", title: "Complete React Native project", completed: false },
    { id: "2", title: "Study for exams", completed: false },
    { id: "3", title: "Read a new book", completed: true },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<{
    id: string;
    title: string;
  } | null>(null);
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

  const renderRightActions = (item: any) => (
    <View style={styles.rightActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.editButton]}
        onPress={() => {
          setCurrentTodo(item);
          setNewTodo(item.title);
          setModalVisible(true);
        }}
      >
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDeleteTodo(item.id)}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.todoItem}>
        <View style={styles.todoContent}>
          <TouchableOpacity
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
            <View style={[styles.checkbox, item.completed && styles.checked]} />
          </TouchableOpacity>
          <Text
            style={[styles.todoText, item.completed && styles.completedText]}
          >
            {item.title}
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Todo's</Text>
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
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentTodo ? "Edit Todo" : "Add Todo"}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter todo..."
              value={newTodo}
              onChangeText={setNewTodo}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setNewTodo("");
                  setCurrentTodo(null);
                  setModalVisible(false);
                }}
                color="gray"
              />
              <Button
                title={currentTodo ? "Save" : "Add"}
                onPress={currentTodo ? handleEditTodo : handleAddTodo}
                color="#4f42d8"
              />
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
    borderRadius: 10,
    marginTop: 10,
    padding: 15,
    marginBottom: 60,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#4f42d8",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    elevation: 1,
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#4f42d8",
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#4f42d8",
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  rightActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: "75%",
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#FF5252",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default TodoComponents;
