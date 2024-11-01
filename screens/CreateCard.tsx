import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";

const CreateCard = () => {
  const [selectedValue, setSelectedValue] = useState("noun");
  const [selectedLanguage, setSelectedLanguage] = useState("Select Language");
  const [selectedDesk, setSelectedDesk] = useState("Select Desk");
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [isWordTypePickerVisible, setIsWordTypePickerVisible] = useState(false);
  const [isDeskPickerVisible, setIsDeskPickerVisible] = useState(false);

  const PickerList = [
    { id: 1, name: "noun" },
    { id: 2, name: "verb" },
    { id: 3, name: "adjective" },
    { id: 4, name: "adverb" },
  ];

  const LanguageList = [
    { id: 1, name: "Spanish" },
    { id: 2, name: "English" },
    { id: 3, name: "French" },
    { id: 4, name: "German" },
  ];

  const DeskList = [
    { id: 1, name: "Desk 1" },
    { id: 2, name: "Desk 2" },
    { id: 3, name: "Desk 3" },
  ];

  const showLanguagePicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: LanguageList.map((item) => item.name).concat(["Cancel"]),
          cancelButtonIndex: LanguageList.length,
        },
        (buttonIndex) => {
          if (buttonIndex < LanguageList.length) {
            setSelectedLanguage(LanguageList[buttonIndex].name);
          }
        }
      );
    } else {
      setIsPickerVisible(true);
    }
  };

  const showWordTypePicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: PickerList.map((item) => item.name).concat(["Cancel"]),
          cancelButtonIndex: PickerList.length,
        },
        (buttonIndex) => {
          if (buttonIndex < PickerList.length) {
            setSelectedValue(PickerList[buttonIndex].name);
          }
        }
      );
    } else {
      setIsWordTypePickerVisible(true);
    }
  };

  const showDeskPicker = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: DeskList.map((item) => item.name).concat(["Cancel"]),
          cancelButtonIndex: DeskList.length,
        },
        (buttonIndex) => {
          if (buttonIndex < DeskList.length) {
            setSelectedDesk(DeskList[buttonIndex].name);
          }
        }
      );
    } else {
      setIsDeskPickerVisible(true);
    }
  };

  const handleDone = () => {
    setIsPickerVisible(false);
    setIsWordTypePickerVisible(false);
    setIsDeskPickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Container</Text>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={showLanguagePicker}
        >
          <Text style={styles.languageButtonText}>{selectedLanguage}</Text>
        </TouchableOpacity>

        <TextInput
          mode="outlined"
          placeholder={`Enter a word in ${selectedLanguage}`}
          theme={{
            colors: {
              primary: "#133266",
              background: "#fff",
            },
          }}
        />
        <TextInput
          mode="outlined"
          style={{ marginTop: 10 }}
          placeholder="Enter the English translation"
          theme={{
            colors: {
              primary: "#133266",
              background: "#fff",
            },
          }}
        />

        <Text style={styles.wordTypeTitle}>Word Type</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={showWordTypePicker}
        >
          <Text style={styles.languageButtonText}>{selectedValue}</Text>
        </TouchableOpacity>

        <Text style={styles.deskTitle}>Select Desk</Text>
        <TouchableOpacity
          style={styles.pickerContainer}
          onPress={showDeskPicker}
        >
          <Text style={styles.languageButtonText}>{selectedDesk}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            /* Save işlemi */
          }}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {Platform.OS !== "ios" && (
        <>
          <Modal
            transparent={true}
            animationType="slide"
            visible={isPickerVisible}
            onRequestClose={() => setIsPickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  {LanguageList.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.pickerItem}
                      onPress={() => {
                        setSelectedLanguage(item.name);
                        setIsPickerVisible(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDone}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            transparent={true}
            animationType="slide"
            visible={isWordTypePickerVisible}
            onRequestClose={() => setIsWordTypePickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  {PickerList.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.pickerItem}
                      onPress={() => {
                        setSelectedValue(item.name);
                        setIsWordTypePickerVisible(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDone}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            transparent={true}
            animationType="slide"
            visible={isDeskPickerVisible}
            onRequestClose={() => setIsDeskPickerVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  {DeskList.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.pickerItem}
                      onPress={() => {
                        setSelectedDesk(item.name);
                        setIsDeskPickerVisible(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDone}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f4f7",
  },
  container: {
    width: "90%",
    height: "100%",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    top: 0,
    left: 0,
  },
  languageButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
    borderColor: "#133266",
    borderWidth: 3,
    shadowColor: "#133266",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  languageButtonText: {
    fontSize: 18,
    color: "#133266",
  },
  wordTypeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  deskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 20,
    padding: 15,
    alignItems: "center",
    borderColor: "#133266",
    borderWidth: 2,
    shadowColor: "#133266",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  saveButtonContainer: {
    bottom: 100,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  saveButton: {
    width: "80%",
    height: 55,
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#133266",
    borderWidth: 3,
    borderRadius: 5,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  saveButtonText: {
    color: "#133266",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    maxHeight: "50%",
  },
  pickerItem: {
    padding: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  pickerItemText: {
    fontSize: 18,
  },
  doneButton: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CreateCard;
