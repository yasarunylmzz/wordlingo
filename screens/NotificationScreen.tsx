import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
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
      timestamp: "2 min ago",
      type: "learning",
    },
    {
      id: "2",
      text: "Your weekly streak is at risk. Practice today!",
      timestamp: "1 hour ago",
      type: "streak",
    },
    {
      id: "3",
      text: "Congratulations! You've mastered 10 new words this week.",
      timestamp: "Yesterday",
      type: "achievement",
    },
    {
      id: "4",
      text: "Daily challenge unlocked. Complete it now!",
      timestamp: "3 days ago",
      type: "challenge",
    },
    {
      id: "5",
      text: "New personalized word pack available.",
      timestamp: "5 days ago",
      type: "recommendation",
    },
  ]);

  const getIconColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      learning: "#6A5ACD",
      streak: "#FF6B6B",
      achievement: "#4ECDC4",
      challenge: "#FFA726",
      recommendation: "#8A4FFF",
    };
    return colorMap[type] || "#4f42d8";
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const navigation = useNavigation();

  const renderNotification = ({ item }: any) => {
    const renderRightActions = (
      _: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[styles.deleteContainer, { transform: [{ scale }] }]}
        >
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(item.id)}
          >
            <Icon name="delete" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
      );
    };

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.notificationContainer}>
          <View
            style={[styles.icon, { backgroundColor: getIconColor(item.type) }]}
          />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationText}>{item.text}</Text>
            <Text style={styles.timestampText}>{item.timestamp}</Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <LeftArrow />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: -1,
  },
  markAllButton: {
    backgroundColor: "#f0eeff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  markAllText: {
    color: "#6A5ACD",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    width: 8,
    height: 48,
    borderRadius: 4,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    color: "#6b7280",
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff3b30",
    width: 80,
    height: "90%",
    borderRadius: 12,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#6b7280",
  },
});

export default NotificationScreen;
