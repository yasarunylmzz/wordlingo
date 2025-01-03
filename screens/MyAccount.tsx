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
} from "react-native";
import LeftArrow from "../svg/LeftArrow";

const MyAccount = ({ navigation }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "johndoe123",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
  });

  const handleInputChange = ({ key, value }: any) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>
              <LeftArrow />
            </Text>
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>My Account</Text>
        </View>

        <View style={styles.profileHeader}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{userData.username}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[
              styles.input,
              isEditing ? styles.editableInput : styles.readOnlyInput,
            ]}
            value={userData.firstName}
            editable={isEditing}
            onChangeText={(text) => handleInputChange("firstName", text)}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={[
              styles.input,
              isEditing ? styles.editableInput : styles.readOnlyInput,
            ]}
            value={userData.lastName}
            editable={isEditing}
            onChangeText={(text) => handleInputChange("lastName", text)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input,
              isEditing ? styles.editableInput : styles.readOnlyInput,
            ]}
            value={userData.email}
            editable={isEditing}
            onChangeText={(text) => handleInputChange("email", text)}
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[
              styles.input,
              isEditing ? styles.editableInput : styles.readOnlyInput,
            ]}
            value={userData.phone}
            editable={isEditing}
            onChangeText={(text) => handleInputChange("phone", text)}
          />
        </View>

        <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
          <Text style={styles.buttonText}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 18,
    color: "#000",
  },
  appBarTitle: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  profileHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  editableInput: {
    backgroundColor: "#fff",
    borderColor: "#007bff",
  },
  readOnlyInput: {
    backgroundColor: "#f1f1f1",
    borderColor: "#ddd",
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MyAccount;
