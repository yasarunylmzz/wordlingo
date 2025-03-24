import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import LeftArrow from "../svg/LeftArrow";

const InputField = ({
  label,
  value,
  editable,
  onChangeText,
  keyboardType = "default",
  isRequired = false,
}) => (
  <View style={styles.inputContainer}>
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
      {isRequired && <Text style={styles.requiredStar}>*</Text>}
    </View>
    <TextInput
      style={[
        styles.input,
        editable ? styles.editableInput : styles.readOnlyInput,
      ]}
      value={value}
      editable={editable}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholderTextColor="#A0A0A0"
    />
  </View>
);

const MyAccount = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "yasarunyilmz",
    firstName: "Yaşar",
    lastName: "Ünyılmaz",
    email: "yasar@example.com",
    phone: "123-456-7890",
    address: "İstanbul, Türkiye",
  });

  const handleInputChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Saving logic would go here
      Alert.alert("Success", "Profile information updated successfully!");
    }
    setIsEditing(!isEditing);
  };

  const handleBack = () => {
    if (isEditing) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Stay", style: "cancel" },
          {
            text: "Discard Changes",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Simplified Header */}
        <View style={styles.header}>
          <View style={styles.appBar}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <LeftArrow />
            </TouchableOpacity>
            <Text style={styles.appBarTitle}>My Account</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Image Section */}
          <View style={styles.profileSection}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/150" }}
                style={styles.profileImage}
              />
              {isEditing && (
                <TouchableOpacity style={styles.editImageButton}>
                  <Text style={styles.editImageText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.username}>@{userData.username}</Text>
          </View>

          {/* User Information Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <InputField
              label="First Name"
              value={userData.firstName}
              editable={isEditing}
              onChangeText={(text) => handleInputChange("firstName", text)}
              isRequired={true}
            />

            <InputField
              label="Last Name"
              value={userData.lastName}
              editable={isEditing}
              onChangeText={(text) => handleInputChange("lastName", text)}
              isRequired={true}
            />

            <InputField
              label="Email Address"
              value={userData.email}
              editable={isEditing}
              onChangeText={(text) => handleInputChange("email", text)}
              keyboardType="email-address"
              isRequired={true}
            />

            <InputField
              label="Phone Number"
              value={userData.phone}
              editable={isEditing}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="phone-pad"
            />

            <InputField
              label="Address"
              value={userData.address}
              editable={isEditing}
              onChangeText={(text) => handleInputChange("address", text)}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isEditing ? styles.saveButton : styles.editButton,
            ]}
            onPress={toggleEdit}
          >
            <Text style={styles.buttonText}>
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Text>
          </TouchableOpacity>

          {!isEditing && (
            <TouchableOpacity style={styles.deleteAccountButton}>
              <Text style={styles.deleteAccountText}>Delete Account</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e6",
    paddingBottom: 0,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    display: "flex",
    width: "100%",
  },
  appBarTitle: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#4f24d8",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4f24d8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  editImageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  requiredStar: {
    color: "#ff3b30",
    marginLeft: 4,
  },
  input: {
    fontSize: 16,
    padding: 15,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  editableInput: {
    borderColor: "#4f24d8",
    backgroundColor: "#fafafa",
  },
  readOnlyInput: {
    backgroundColor: "#f5f5f7",
    borderColor: "#e1e1e6",
    color: "#333",
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    backgroundColor: "#4f24d8",
  },
  saveButton: {
    backgroundColor: "#22c55e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteAccountButton: {
    alignItems: "center",
    padding: 15,
    marginBottom: 30,
  },
  deleteAccountText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default MyAccount;
