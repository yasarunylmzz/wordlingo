import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";

const { width } = Dimensions.get("window");

interface CardModalProps {
  visible: boolean;
  isEditMode: boolean;
  word1: string;
  word2: string;
  importanceLevel: "low" | "medium" | "high";
  onWord1Change: (text: string) => void;
  onWord2Change: (text: string) => void;
  onImportanceChange: (level: "low" | "medium" | "high") => void;
  onSave: () => void;
  onCancel: () => void;
}

const CardModal: React.FC<CardModalProps> = ({
  visible,
  isEditMode,
  word1,
  word2,
  importanceLevel,
  onWord1Change,
  onWord2Change,
  onImportanceChange,
  onSave,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {isEditMode ? "Edit Card" : "Create New Card"}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Word</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter word"
              value={word1}
              onChangeText={onWord1Change}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Translation</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter translation"
              value={word2}
              onChangeText={onWord2Change}
            />
          </View>

          {!isEditMode && (
            <View style={styles.importanceContainer}>
              <Text style={styles.inputLabel}>Importance Level</Text>
              <View style={styles.importanceOptions}>
                {(["low", "medium", "high"] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.importanceButton,
                      importanceLevel === level && styles.selectedImportance,
                    ]}
                    onPress={() => onImportanceChange(level)}
                  >
                    <Text
                      style={[
                        styles.importanceText,
                        importanceLevel === level && { color: "white" },
                      ]}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                (!word1 || !word2) && styles.disabledButton,
              ]}
              disabled={!word1 || !word2}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>
                {isEditMode ? "Update Card" : "Add Card"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#4f42d8",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  importanceContainer: {
    marginBottom: 25,
  },
  importanceOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  importanceButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  selectedImportance: {
    backgroundColor: "#4f42d8",
    borderColor: "#4f42d8",
  },
  importanceText: {
    fontWeight: "500",
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    borderRadius: 15,
    padding: 12,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f2f2f2",
  },
  saveButton: {
    backgroundColor: "#48c590",
  },
  disabledButton: {
    backgroundColor: "#a8dbc7",
    opacity: 0.7,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CardModal;
