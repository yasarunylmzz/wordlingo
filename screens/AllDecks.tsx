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
import DownloadIcon from "../svg/DownloadIcon";
import ViewListIcon from "../svg/ViewListIcon";
import { LinearGradient } from "expo-linear-gradient";

const AllDecks = () => {
  type NavigationType = NavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationType>();

  // Örnek veri
  const data = [
    {
      id: "1",
      title: "Snacks and desserts in Britain",
      image: require("../assets/papaya.jpg"),
      profileImageUri: "https://via.placeholder.com/50",
      views: "42",
      likes: "4.5k",
      author: "Yasar",
    },
    {
      id: "2",
      title: "Exotic fruits from the world",
      image: require("../assets/lion.jpg"),
      profileImageUri: "https://via.placeholder.com/50",
      views: "30",
      likes: "2.2k",
      author: "Alex",
    },
    {
      id: "3",
      title: "Exotic fruits from the world",
      image: require("../assets/bike.jpg"),
      profileImageUri: "https://via.placeholder.com/50",
      views: "30",
      likes: "2.2k",
      author: "Alex",
    },
  ];

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.seeAllButton}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => navigation.navigate("CardDecks")}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)"]}
          style={styles.imageOverlay}
        />
        <View style={styles.cardContent}>
          <View style={styles.topCardContent}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statsItem}>
                <ViewListIcon style={{ marginRight: 4 }} />
                <Text style={styles.statsText}>{item.views}</Text>
              </View>
              <View style={styles.statsItem}>
                <DownloadIcon style={{ marginRight: 4 }} />
                <Text style={styles.statsText}>{item.likes}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Divider'ı card içinde ama cardContent dışında konumlandırdım */}
        <View style={styles.divider} />

        <View style={styles.authorContainer}>
          <Image
            source={{ uri: item.profileImageUri }}
            style={styles.profileImage}
          />
          <Text style={styles.authorText}>
            By <Text style={styles.authorName}>{item.author}</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.appBar}>
        <Text style={styles.appTitle}>Library</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            navigation.navigate("CreateCard");
          }}
        >
          <EditIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderSectionHeader("Your Words")}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={styles.listContainer}
          showsHorizontalScrollIndicator={false}
          snapToInterval={280} // Card width + margin
          decelerationRate="fast"
          bounces={false}
        />

        {renderSectionHeader("Popular Words")}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={styles.listContainer}
          showsHorizontalScrollIndicator={false}
          snapToInterval={280} // Card width + margin
          decelerationRate="fast"
          bounces={false}
        />

        {renderSectionHeader("Recommended by Word Lingo")}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={styles.listContainer}
          showsHorizontalScrollIndicator={false}
          snapToInterval={280} // Card width + margin
          decelerationRate="fast"
          bounces={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f5",
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6A5ACD",
  },
  createButton: {
    backgroundColor: "#f0eeff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#6A5ACD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6A5ACD",
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingRight: 5,
  },
  cardWrapper: {
    marginRight: 15,
    height: 300,
  },
  card: {
    width: 260,
    height: 290,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  cardContent: {
    padding: 16,
    flex: 1,
  },
  topCardContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#f8f8fa",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statsText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginHorizontal: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#f0eeff",
  },
  authorText: {
    fontSize: 14,
    color: "#666",
  },
  authorName: {
    color: "#6A5ACD",
    fontWeight: "bold",
  },
});

export default AllDecks;
