import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuthStore } from "../stores/userStore";
import { createDesk } from "../services/deskService";

const CreateDeck: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigation = useNavigation();
  const userId = useAuthStore((state) => state.user.id);

  const handleGoBack = (): void => {
    navigation.goBack();
  };
  const handleCreateDeck = async (): Promise<void> => {
    if (title.trim() === "") {
      alert("Başlık boş olamaz");
      return;
    }

    try {
      const response = await createDesk(title, description, userId!, null);
      console.log(response);
      navigation.navigate("CreateCard");
    } catch (error: any) {
      console.error("Deck oluşturulamadı:", error.message);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Kart Destesi Oluştur</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          {/* Title & Description */}
          <View style={styles.titleSection}>
            <Text style={styles.sectionLabel}>BAŞLIK</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Kart destesi başlığı"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>AÇIKLAMA</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Kart destesi için açıklama ekleyin..."
              placeholderTextColor="#888"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Icon name="info-outline" size={24} color="#5f8aff" />
            <Text style={styles.infoText}>
              Kart destesi oluşturduktan sonra, içine kartlar eklemeye
              başlayabilirsiniz.
            </Text>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Create Deck Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateDeck}
        >
          <Text style={styles.createButtonText}>Kart Destesi Oluştur</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginTop: 20,
  },
  sectionLabel: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  descriptionSection: {
    marginBottom: 25,
  },
  descriptionInput: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: 8,
    padding: 15,
    height: 100,
    textAlignVertical: "top",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  infoSection: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  infoText: {
    color: "#333",
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  createButton: {
    backgroundColor: "#5f8aff",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomPadding: {
    height: 80,
  },
});

export default CreateDeck;
