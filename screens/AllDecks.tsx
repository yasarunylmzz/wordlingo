import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  StatusBar,
} from "react-native";
import EditIcon from "../svg/EditIcon";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParams";
import ViewListIcon from "../svg/ViewListIcon";
import { LinearGradient } from "expo-linear-gradient";

const AllDecks = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();

  // Sample data structure
  const mostUsedDecks = [
    {
      id: "1",
      title: "Business English Terms",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      views: "1.2K",
      progress: 75,
    },
    {
      id: "2",
      title: "Medical Terminology",
      image:
        "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      views: "892",
      progress: 60,
    },
    {
      id: "3",
      title: "Travel Vocabulary",
      image:
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      views: "2.1K",
      progress: 90,
    },
  ];

  const allDecks = [
    {
      id: "4",
      title: "Basic Grammar Structures",
      image:
        "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      views: "456",
      lastStudied: "2 hours ago",
    },
    {
      id: "5",
      title: "Advanced Vocabulary",
      image:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      views: "678",
      lastStudied: "yesterday",
    },
    {
      id: "6",
      title: "TOEFL Preparation",
      image:
        "https://images.unsplash.com/photo-1565024386645-7b321f06e83a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      views: "1.5K",
      lastStudied: "3 days ago",
    },
    {
      id: "7",
      title: "Language Exam Set",
      image:
        "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      views: "934",
      lastStudied: "1 week ago",
    },
  ];

  const renderHorizontalItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.horizontalCard}
      onPress={() => navigation.navigate("CardDecks")}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.horizontalImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={styles.imageOverlay}
      />
      <View style={styles.horizontalContent}>
        <Text style={styles.horizontalTitle}>{item.title}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <ViewListIcon />
            <Text style={styles.statText}>{item.views}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderVerticalItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={() => navigation.navigate("CardDecks")}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.verticalImage} />
      <View style={styles.verticalContent}>
        <Text style={styles.verticalTitle}>{item.title}</Text>
        <View style={styles.verticalStats}>
          <View style={styles.statItem}>
            <ViewListIcon fill="#6A5ACD" />
            <Text style={styles.verticalStatText}>{item.views}</Text>
          </View>
          <Text style={styles.lastStudied}>{item.lastStudied}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Decks</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("CreateDeck")}
        >
          <EditIcon fill="#6A5ACD" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Horizontal Scroll - Most Used */}
        <Text style={styles.sectionTitle}>Most Used</Text>
        <FlatList
          data={mostUsedDecks}
          renderItem={renderHorizontalItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          keyExtractor={(item) => item.id}
          snapToInterval={300}
          decelerationRate="fast"
        />

        {/* Vertical List - All Decks */}
        <View style={styles.verticalSection}>
          <Text style={styles.sectionTitle}>All Decks</Text>
          <FlatList
            data={allDecks}
            renderItem={renderVerticalItem}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.verticalList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#6A5ACD",
    fontFamily: "Inter_700Bold",
  },
  createButton: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    paddingHorizontal: 20,
    marginVertical: 15,
    fontFamily: "Inter_700Bold",
  },
  horizontalList: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  horizontalCard: {
    width: 280,
    height: 200,
    borderRadius: 15,
    marginRight: 15,
    overflow: "hidden",
    position: "relative",
  },
  horizontalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  horizontalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  horizontalTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    fontFamily: "Inter_700Bold",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6A5ACD",
    borderRadius: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  verticalSection: {
    paddingHorizontal: 20,
  },
  verticalList: {
    paddingBottom: 30,
  },
  verticalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  verticalImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  verticalContent: {
    flex: 1,
  },
  verticalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
    fontFamily: "Inter_600SemiBold",
  },
  verticalStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  verticalStatText: {
    color: "#4A5568",
    fontSize: 12,
    marginLeft: 5,
    fontFamily: "Inter_500Medium",
  },
  lastStudied: {
    color: "#718096",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});

export default AllDecks;
