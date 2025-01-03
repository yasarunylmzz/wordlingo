import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import LeftArrow from "../svg/LeftArrow";
import { useNavigation } from "@react-navigation/native";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      text: "New words are waiting for you! Ready to make progress today?",
    },
    {
      id: "2",
      text: "New words are waiting for you! Ready to make progress today?",
    },
    {
      id: "3",
      text: "New words are waiting for you! Ready to make progress today?",
    },
    {
      id: "4",
      text: "New words are waiting for you! Ready to make progress today?",
    },
    {
      id: "5",
      text: "New words are waiting for you! Ready to make progress today?",
    },
  ]);

  const deleteNotification = (id: any) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const navigation = useNavigation();

  const renderNotification = ({ item }: any) => {
    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Icon name="delete" size={24} color="white" />
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.notificationContainer}>
          <View style={styles.icon} />
          <Text style={styles.notificationText}>{item.text}</Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <LeftArrow />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  appbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: "100%",
    backgroundColor: "#4f42d8",
    borderRadius: 5,
    marginRight: 15,
  },
  notificationText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff3b30",
    width: 100,
    height: "85%",
    borderRadius: 10,
  },
});

export default NotificationScreen;
