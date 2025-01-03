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
} from "react-native";
import EditIcon from "../svg/EditIcon"; // EditIcon'u burada kullanacağınızı varsayıyorum
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParams";
import DownloadIcon from "../svg/DownloadIcon";
import ViewListIcon from "../svg/ViewListIcon";

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

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate("CardDecks")}>
      <View style={styles.card}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <ViewListIcon style={{ marginRight: 6 }} />
              <Text style={styles.statsText}>{item.views}</Text>
            </View>
            <View style={styles.statsItem}>
              <DownloadIcon style={{ marginRight: 6 }} />
              <Text style={styles.statsText}>{item.likes}</Text>
            </View>
          </View>
          <View style={styles.authorRow}>
            <Image
              source={{ uri: item.profileImageUri }}
              style={styles.profileImage}
            />
            <Text style={styles.authorText}>
              By <Text style={styles.authorName}>{item.author}</Text>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.AppBar}>
          <Text style={styles.appText}>Library</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CreateCard");
            }}
          >
            <View style={styles.icon}>
              <EditIcon />
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.titleText}>Your Words</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal // Yatay kaydırma
          contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false} // Yatay kaydırma çubuğunu gizle
        />
        <Text style={styles.titleText}>Popular Words</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal // Yatay kaydırma
          contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false} // Yatay kaydırma çubuğunu gizle
        />
        <Text style={styles.titleText}>Recommended by Word Lingo</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal // Yatay kaydırma
          contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false} // Yatay kaydırma çubuğunu gizle
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  AppBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  appText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4f42d8",
  },
  icon: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    paddingHorizontal: 18,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    width: 270, // Kart genişliğini ayarlayın
    height: 350, // Kart yüksekliğini ayarlayın
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "space-between",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 175,
    borderRadius: 20,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 15,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  statsText: {
    fontSize: 14,
    color: "#888",
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  authorText: {
    fontSize: 14,
    color: "#888",
  },
  authorName: {
    color: "#4f42d8",
    fontWeight: "bold",
  },
});

export default AllDecks;
